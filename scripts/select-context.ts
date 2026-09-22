import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { resolveContext } from "./query-genome.ts";
import type { CompiledGenome } from "./compile-genome.ts";
const hash = (text: string) => createHash("sha256").update(text).digest("hex");

/** Validate the transport needed by this consumer, not the authored Genome again. */
export function parseArtifact(text: string): CompiledGenome {
  let a: CompiledGenome;
  try { a = JSON.parse(text); } catch { throw new Error("Compiled Genome is not valid JSON. Regenerate it upstream."); }
  assert.ok(a && a.generated?.formatVersion === 1 && a.generated.notice?.startsWith("GENERATED"), "Unsupported or missing compiled Genome envelope");
  assert.ok(a.genome?.id && a.genome.version && a.genome.status, "Missing compiled governance metadata");
  assert.deepEqual(a.referenceBases, { authority: "genome/", guidance: "genome/", implementation: "", sources: "" }, "Unsupported compiled reference bases");
  for (const key of ["entities", "relationships", "contracts", "rules", "exceptions", "limitations"] as const) assert.ok(Array.isArray(a[key]), `Missing compiled ${key}`);
  assert.ok(a.tokens && typeof a.tokens === "object" && a.sources && typeof a.sources === "object", "Missing compiled tokens/sources");
  const ids = new Set(a.entities.map(e => e.id));
  assert.equal(ids.size, a.entities.length, "Duplicate compiled entity IDs");
  for (const edge of a.relationships) assert.ok(ids.has(edge.from) && ids.has(edge.to), "Broken compiled relationship");
  for (const records of [a.contracts, a.rules, a.exceptions]) {
    assert.equal(new Set(records.map(r => r.id)).size, records.length, "Duplicate compiled records");
    for (const record of records) assert.ok(ids.has(record.id), "Unregistered compiled record");
  }
  for (const entity of a.entities) {
    const metadata = 'metadata' in entity.authority ? entity.authority.metadata : undefined;
    if (metadata === 'governance/exceptions.ts#exceptions') assert.ok(a.exceptions.some(e=>e.id===entity.id), "Missing compiled exception record");
  }
  for (const e of a.exceptions) assert.ok(a.rules.some(r=>r.id===e.ruleId), "Broken compiled exception rule reference");
  // These checks use embedded bytes only; no source-file reads or freshness claim.
  for (const source of Object.values(a.sources)) {
    assert.match(source.sha256, /^[a-f0-9]{64}$/, "Missing compiled provenance");
    if (source.text !== undefined) assert.equal(hash(source.text), source.sha256, "Corrupt embedded source text");
  }
  return a;
}

/** Verbatim section extraction, not semantic summarization. Current ATX convention only. */
export function excerpt(text: string, fragment?: string) {
  if (!fragment) return text.trim();
  const headings = [...text.matchAll(/^(#{1,6}) (.+)$/gm)];
  const slug = (s: string) => s.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s/g, "-");
  const matches = headings.filter(h => slug(h[2]) === fragment);
  assert.equal(matches.length, 1, `Missing or ambiguous compiled guidance fragment: ${fragment}`);
  const start = matches[0];
  const end = headings.find(h => h.index! > start.index! && h[1].length <= start[1].length);
  return text.slice(start.index, end?.index ?? text.length).trim();
}

export type Selection = {
  roots: readonly { id: string; reason: string }[];
  /** Required for conditional activation; use the initial selection's compiledSha256. */
  expectedCompiledSha256?: string;
  activations?: readonly { from: string; to: string; reason: string }[];
};
type Query = ReturnType<typeof resolveContext>;

function unique<T>(items: readonly T[], key: (item: T) => string): T[] {
  const records = new Map<string, T>();
  for (const item of items) {
    const id = key(item);
    if (records.has(id)) assert.deepEqual(item, records.get(id), `Conflicting duplicate: ${id}`);
    else records.set(id, item);
  }
  return [...records.entries()].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([, item]) => item);
}
const edgeKey = (edge: Query["relationships"][number]) => `${edge.from}|${edge.relation}|${edge.to}`;

/** Select from exactly one snapshot. No source reads, task inference or invented edges. */
export function resolveSelection(compiledText: string, selection: Selection) {
  const a = parseArtifact(compiledText);
  const compiledSha256 = hash(compiledText);
  if (selection.expectedCompiledSha256 !== undefined) {
    assert.equal(compiledSha256, selection.expectedCompiledSha256, "Incompatible compiled snapshot; resolve against the original bytes");
  }
  assert.ok(selection.roots.length, "At least one explicit root is required");
  const roots = unique(selection.roots, root => root.id);
  for (const root of roots) assert.ok(root.id && root.reason.trim(), "Each root requires a caller reason");
  // Also reject conflicting duplicate relationship notes in the compiled input.
  unique(a.relationships, edgeKey);
  const primary = roots.map(root => ({ root: root.id, context: resolveContext(a, root.id) }));
  const activations = unique(selection.activations ?? [], item => `${item.from}|${item.to}`);
  if (activations.length) assert.ok(selection.expectedCompiledSha256, "Conditional activation requires the initial compiled snapshot hash");
  const initialIds = new Set(primary.flatMap(result => result.context.entities.map(entity => entity.id as string)));
  for (const activation of activations) {
    assert.ok(activation.reason.trim(), "Activation requires a human/local decision reason");
    assert.ok(initialIds.has(activation.from), "Activation must originate in the initial selection");
    assert.ok(a.relationships.some(edge => edge.from === activation.from && edge.to === activation.to && edge.relation === "related-to"), "Activation requires an authored related-to relationship");
  }
  const queries = [...primary, ...activations.map(item => ({ root: item.to, context: resolveContext(a, item.to) }))];
  const entities = unique(queries.flatMap(q => q.context.entities), e => e.id);
  const contracts = unique(queries.flatMap(q => q.context.contracts), c => c.id);
  const rules = unique(queries.flatMap(q => q.context.rules), r => r.id);
  const exceptions = unique(queries.flatMap(q => q.context.exceptions), e => e.id);
  const relationships = unique(queries.flatMap(q => q.context.relationships), edgeKey);
  const tokens = Object.fromEntries(unique(queries.flatMap(q => Object.entries(q.context.tokens)), entry => entry[0]));
  const governance = a.entities.find(e => e.id === a.genome.id);
  assert.ok(governance && 'guidance' in governance.authority, "Missing compiled governance entity/guidance");
  for (const entity of entities) {
    assert.ok(entity.status && entity.owner && entity.authority, `Malformed compiled entity: ${entity.id}`);
    if (entity.id.startsWith('forma.components.')) assert.ok(contracts.some(c => c.id === entity.id), `Missing compiled contract: ${entity.id}`);
    if (entity.id.startsWith('forma.rules.')) assert.ok(rules.some(r => r.id === entity.id), `Missing compiled rule: ${entity.id}`);
  }
  const exceptionEntities = exceptions.map(e => {
    const entity = a.entities.find(record => record.id === e.id)!;
    assert.ok(e.reason?.trim() && e.scope?.trim() && e.review?.trim(), "Incomplete compiled exception review context");
    assert.equal(e.status, entity.status, "Compiled exception status mismatch");
    assert.equal(e.owner, entity.owner, "Compiled exception owner mismatch");
    return entity;
  });
  const conditional = unique(queries.flatMap(q => q.context.conditional), item => edgeKey(item.edge)).map(item => {
    assert.ok(item.entity, "Missing conditional entity");
    return { ...item, entity: item.entity, active: entities.some(e => e.id === item.entity!.id) };
  });
  // Only cited hashes and selected prose excerpts leave this boundary, never a source catalog.
  const sources: Record<string, { sha256: string }> = {};
  const guidance: Record<string, { text: string; path: string; sha256: string }> = {};
  function cite(reference: string, base = "genome/") {
    const url = new URL(base + reference, "https://projection.invalid/");
    assert.equal(url.origin, "https://projection.invalid", "Unsupported source reference");
    const path = url.pathname.slice(1);
    const source = a.sources[path];
    assert.ok(source, `Missing compiled source provenance: ${path}`);
    sources[path] = { sha256: source.sha256 };
    return { path, source };
  }
  function addGuidance(reference: string) {
    assert.ok(!reference.startsWith('/') && !reference.split('/').includes('..'), "Unsupported compiled guidance path");
    const { path, source } = cite(reference);
    assert.ok(source.text, `Missing embedded guidance: ${reference}`);
    guidance[reference] = { text: excerpt(source.text, reference.split('#')[1]), path, sha256: source.sha256 };
  }
  for (const entity of [...entities, governance, ...exceptionEntities, ...conditional.map(c => c.entity)]) {
    for (const ref of Object.values(entity.authority)) cite(ref);
  }
  for (const entity of [...entities, governance]) if ('guidance' in entity.authority) addGuidance(entity.authority.guidance);
  for (const rule of rules) addGuidance(rule.guidance);
  for (const contract of contracts) {
    assert.ok(contract.api && contract.tokenRoles && contract.accessibility, `Malformed compiled contract: ${contract.id}`);
    addGuidance(contract.accessibility.humanReview);
  }
  if (Object.keys(tokens).length) cite("foundations/tokens.json");
  const inclusion = {
    entities: entities.map(entity => ({ id: entity.id,
      explicit: roots.filter(r => r.id === entity.id),
      activations: activations.filter(r => r.to === entity.id),
      resolvedFrom: [...new Set(queries.filter(q => q.context.entities.some(e => e.id === entity.id)).map(q => q.root))].sort(),
    })),
    relationships: relationships.map(edge => ({ edge, resolvedFrom: [...new Set(queries.filter(q => q.context.relationships.some(e => edgeKey(e) === edgeKey(edge))).map(q => q.root))].sort() })),
    contracts: contracts.map(c => ({ id: c.id, requiredByEntity: c.id })),
    tokens: Object.keys(tokens).map(path => ({ path,
      resolvedFrom: [...new Set(queries.filter(q => path in q.context.tokens).map(q => q.root))].sort(),
      kind: "resolved-foundation-or-contract-token-dependency" as const,
    })),
  };
  return { compiledSha256, formatVersion: a.generated.formatVersion, roots, activations,
    genome: a.genome, policy: primary[0].context.policy, entities, contracts, rules, exceptions, exceptionEntities,
    relationships, tokens, governance, conditional, guidance, sources, inclusion, limitations: a.limitations };
}
export type ResolvedSelection = ReturnType<typeof resolveSelection>;
