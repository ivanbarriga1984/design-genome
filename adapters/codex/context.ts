import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, realpath, rename, rm, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolveContext } from "../../scripts/query-genome.ts";
import type { CompiledGenome } from "../../scripts/compile-genome.ts";

export const intent = "forma.patterns.destructive-action";
export const request = "Add a destructive action allowing a user to delete a project.";
export const outputFile = new URL("../../generated/codex-destructive-action.md", import.meta.url);
const inputFile = new URL("../../generated/forma-genome.json", import.meta.url);
const hash = (text: string) => createHash("sha256").update(text).digest("hex");
const json = (value: unknown): string => JSON.stringify(value);

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

export function renderContext(compiledText: string, seed = intent): string {
  assert.equal(seed, intent, "This first Codex consumer supports only forma.patterns.destructive-action");
  const a = parseArtifact(compiledText);
  const context = resolveContext(a, seed);
  assert.ok(context.governance, "Missing compiled governance entity");
  // Fail on missing records rather than silently supplying incomplete governed context.
  for (const entity of context.entities) {
    assert.ok(entity.status && entity.owner && entity.authority, `Malformed compiled entity: ${entity.id}`);
    if (entity.id.startsWith('forma.components.')) assert.ok(context.contracts.some(c=>c.id===entity.id), `Missing compiled contract: ${entity.id}`);
    if (entity.id.startsWith('forma.rules.')) assert.ok(context.rules.some(r=>r.id===entity.id), `Missing compiled rule: ${entity.id}`);
  }
  for (const e of context.exceptions) {
    const entity = a.entities.find(r=>r.id===e.id)!;
    assert.ok(e.reason?.trim() && e.scope?.trim() && e.review?.trim(), "Incomplete compiled exception review context");
    assert.equal(e.status, entity.status, "Compiled exception status mismatch");
    assert.equal(e.owner, entity.owner, "Compiled exception owner mismatch");
  }
  const lines = [
    "# Codex · destructive-action context",
    "GENERATED consumer projection. DO NOT EDIT. Authored Genome remains upstream; this packet creates no new authority or permission.",
    `Compiled artifact SHA-256: ${hash(compiledText)}. Format: ${a.generated.formatVersion}.`,
    "## Intent and invocation boundary",
    `Proposed implementation request: ${request}`,
    `Explicit seed: ${seed}. This command does not classify free text or execute this request.`,
    "Use this packet only with a separately authorized implementation task. Read it as task-scoped governed context. Read implementation files as needed to reuse and integrate existing code, not to rediscover design policy. Do not crawl genome/ or independent documentation to infer missing design decisions; report a gap or conflict for upstream resolution. Keep authored rule levels, statuses and conditional notes intact. Do not apply this packet globally to unrelated work.",
    "## Governed context · relevance is not a new MUST level",
    `Genome: ${json(context.genome)}`,
    `Resolution: ${context.policy}`,
    "Authored MUST / SHOULD / MUST NOT levels remain below. Inclusion does not promote draft knowledge to active or prove its applicability to product consequences.",
  ];
  const references = new Set<string>();
  function guidance(reference: string) {
    const [file, fragment] = reference.split('#');
    assert.ok(!file.startsWith('/') && !file.split('/').includes('..'), "Unsupported compiled guidance path");
    const source = a.sources[`genome/${file}`];
    assert.ok(source?.text, `Missing embedded guidance: ${reference}`);
    references.add(`genome/${reference}`);
    return excerpt(source.text, fragment).split("\n").map(line => `> ${line}`).join("\n");
  }
  function record(entity: CompiledGenome['entities'][number]) {
    for (const ref of Object.values(entity.authority)) references.add(new URL(ref, 'https://projection.invalid/genome/').pathname.slice(1) + (ref.includes('#') ? '#' + ref.split('#')[1] : ''));
    return json(entity);
  }
  function section(title: string, domain: string) {
    lines.push(`### ${title}`);
    for (const entity of context.entities.filter(e=>e.id.startsWith(`forma.${domain}.`))) {
      lines.push(record(entity));
      if ('guidance' in entity.authority) lines.push(guidance(entity.authority.guidance));
    }
  }
  lines.push('### Relationship evidence');
  for (const edge of context.relationships) lines.push(`${edge.from} — ${edge.relation} → ${edge.to}`);
  section('Relevant principles', 'principles');
  section('Selected pattern', 'patterns');
  section('Component contracts', 'components');
  for (const contract of context.contracts) {
    assert.ok(contract.api && contract.tokenRoles && contract.accessibility, `Malformed compiled contract: ${contract.id}`);
    lines.push(json(contract));
  }
  section('Inherited foundations', 'foundations');
  lines.push('Typed token records follow. Aliases and internal reference.* dependencies are retained; internal references are not consumer-facing semantic roles.');
  lines.push('Token provenance: genome/foundations/tokens.json; each dotted path maps to its matching JSON Pointer (dots become slashes).');
  references.add('genome/foundations/tokens.json');
  for (const [path, value] of Object.entries(context.tokens)) lines.push(`${path} (${value.type}): ${json(value.value)}`);
  section('Applicable rule records', 'rules');
  for (const rule of context.rules) { lines.push(json(rule), guidance(rule.guidance)); }
  section('Content guidance', 'content');
  lines.push('### Governance', record(context.governance));
  assert.ok('guidance' in context.governance.authority, 'Missing governance guidance reference');
  lines.push(guidance(context.governance.authority.guidance));
  lines.push('## Conditional context · not a required dependency');
  for (const conditional of context.conditional) {
    assert.ok(conditional.entity, 'Missing conditional entity');
    lines.push(json(conditional.edge), record(conditional.entity));
  }
  lines.push('Conditional contracts are not supplied or made mandatory by this packet. If a conditional association becomes relevant, obtain separately resolved context before implementing it.');
  lines.push('## Exceptions · review context only, never automatic permission');
  for (const e of context.exceptions) { lines.push(json(e), record(a.entities.find(r=>r.id===e.id)!)); }
  lines.push('No exception is applied by this consumer. In particular, draft exceptions cannot authorize a deviation; read the exact scope and review conditions.');
  lines.push('## Human review and unresolved requirements');
  lines.push('Product consequences and applicability require human judgment. Rule checker availability remains exactly as recorded, including null. Component reuse does not prove UX or accessibility compliance.');
  for (const c of context.contracts) lines.push(`${c.id}: human review at genome/${c.accessibility.humanReview}; deterministic responsibilities remain in its contract above.`);
  lines.push(...context.limitations.map(s=>`- ${s}`));
  lines.push('This packet contains scoped excerpts, not the full source catalog. Linked references are provenance, not instructions to crawl. No free-text classification, automatic exception approval or downstream conformance claim is made.');
  lines.push('## Provenance · repository-relative references');
  lines.push('Fragment references remain in entity/rule/contract records above. File hashes below are deduplicated.');
  for (const ref of [...new Set([...references].map(r=>r.split('#')[0]))].sort()) {
    const source = a.sources[ref.split('#')[0]];
    assert.ok(source, `Missing compiled source provenance: ${ref}`);
    lines.push(`${ref} · SHA-256 ${source.sha256}`);
  }
  return lines.join('\n\n') + '\n';
}

export async function deliverContext(input = inputFile, output = outputFile) {
  const temporary = new URL(output.href + '.tmp');
  try {
    let text: string;
    try { text = await readFile(input, 'utf8'); } catch { throw new Error('Compiled Genome is missing or unreadable. Run npm run genome:generate upstream before requesting Codex context.'); }
    const packet = renderContext(text);
    await mkdir(new URL('./', output), { recursive: true });
    await writeFile(temporary, packet); await rename(temporary, output);
    return packet;
  } catch (error) { await rm(output,{force:true}); await rm(temporary,{force:true}); throw error; }
}

if (process.argv[1] && import.meta.url === pathToFileURL(await realpath(process.argv[1])).href) {
  assert.equal(process.argv.length, 2, 'Use npm run codex:context (destructive-action example only)');
  try { await deliverContext(); console.log('Generated generated/codex-destructive-action.md. Context only; no Codex task was executed.'); }
  catch(error) { console.error(`Codex context failed: ${(error as Error).message}`); process.exitCode = 1; }
}
