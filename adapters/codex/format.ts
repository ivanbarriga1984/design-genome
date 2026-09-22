import assert from "node:assert/strict";
import type { ResolvedSelection } from "../../scripts/select-context.ts";
const json = (value: unknown): string => JSON.stringify(value);

/** Pure formatting of selected intelligence. No selection, source reads or task inference. */
export function formatCodexContext({ task, context }: { task: string; context: ResolvedSelection }): string {
  assert.ok(task.trim(), "A caller-supplied task is required");
  const lines = [
    "# Codex · selected Genome context",
    "GENERATED consumer projection. DO NOT EDIT. Authored Genome remains upstream; this packet creates no new authority or permission.",
    `Compiled artifact SHA-256: ${context.compiledSha256}. Format: ${context.formatVersion}.`,
    "## Task/product facts supplied by the caller",
    `Proposed implementation request: ${task}`,
    "The task is caller input, not authored Genome authority. Product assumptions and implementation requests do not create policy.",
    "## Explicit caller selection",
    json(context.roots),
    "These roots were selected by the caller. Co-selection creates no authored relationship, scenario pattern or governed composition. No free-text classification or task execution occurs.",
    "### Explicit conditional activations",
    json(context.activations),
    "Activations record local human decisions; they do not rewrite authored relationships or approve policy changes.",
    "Use this packet only with a separately authorized implementation task. Read it as task-scoped governed context. Read implementation files as needed to reuse and integrate existing code, not to rediscover design policy. Do not crawl genome/ or independent documentation to infer missing design decisions; report a gap or conflict for upstream resolution. Keep authored rule levels, statuses and conditional notes intact. Do not apply this packet globally to unrelated work.",
    "## Governed context · relevance is not a new MUST level",
    `Genome: ${json(context.genome)}`,
    `Resolution: ${context.policy}`,
    "Authored MUST / SHOULD / MUST NOT levels remain below. Inclusion does not promote draft knowledge to active or prove its applicability to product consequences.",
  ];
  function guidance(reference: string) {
    const source = context.guidance[reference];
    assert.ok(source, `Missing selected guidance: ${reference}`);
    return source.text.split("\n").map(line => `> ${line}`).join("\n");
  }
  function record(entity: ResolvedSelection['entities'][number]) { return json(entity); }

  function section(title: string, domain: string) {
    lines.push(`### ${title}`);
    for (const entity of context.entities.filter(e=>e.id.startsWith(`forma.${domain}.`))) {
      lines.push(record(entity));
      if ('guidance' in entity.authority) lines.push(guidance(entity.authority.guidance));
    }
  }
  lines.push('### Relationship evidence');
  for (const edge of context.relationships) lines.push(`${edge.from} — ${edge.relation} → ${edge.to}${"note" in edge && edge.note ? ` · ${edge.note}` : ""}`);
  section('Relevant principles', 'principles');
  section('Selected patterns (if any)', 'patterns');
  section('Component contracts', 'components');
  for (const contract of context.contracts) {
    assert.ok(contract.api && contract.tokenRoles && contract.accessibility, `Malformed compiled contract: ${contract.id}`);
    lines.push(json(contract));
  }
  section('Inherited foundations', 'foundations');
  lines.push('Typed token records follow. Aliases and internal reference.* dependencies are retained; internal references are not consumer-facing semantic roles.');
  lines.push('Token provenance: genome/foundations/tokens.json; each dotted path maps to its matching JSON Pointer (dots become slashes).');
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
    lines.push(json(conditional.edge), record(conditional.entity), `Context active: ${conditional.active}. ${conditional.active ? "Selected target context is supplied above." : "Target contract is not active; obtain separately resolved context if relevant."}`);
  }
  lines.push('Inactive conditional contracts are not supplied merely because a related-to edge exists. Active targets listed here were included through explicit selection/resolution or recorded human activation; related-to remains unchanged. No conditional association becomes a universal requirement.');
  lines.push('## Exceptions · review context only, never automatic permission');
  for (const e of context.exceptions) { lines.push(json(e), record(context.exceptionEntities.find(r=>r.id===e.id)!)); }
  lines.push('No exception is applied by this consumer. In particular, draft exceptions cannot authorize a deviation; read the exact scope and review conditions.');
  lines.push('## Implementation choices and human review');
  lines.push('The consumer still chooses task-specific copy, composition and behavior within supported contracts. Distinguish supplied product facts from design knowledge. Missing product semantics or policy require clarification, not invention.');
  lines.push('## Human review and unresolved requirements');
  lines.push('Product consequences and applicability require human judgment. Rule checker availability remains exactly as recorded, including null. Component reuse does not prove UX or accessibility compliance.');
  for (const c of context.contracts) lines.push(`${c.id}: human review at genome/${c.accessibility.humanReview}; deterministic responsibilities remain in its contract above.`);
  lines.push(...context.limitations.map(s=>`- ${s}`));
  lines.push('This packet contains scoped excerpts, not the full source catalog. Linked references are provenance, not instructions to crawl. No free-text classification, automatic exception approval or downstream conformance claim is made.');
  lines.push('## Inclusion provenance');
  // Group repeated root evidence for a compact packet; the envelope retains per-record provenance.
  const roots = [...new Set([...context.roots.map(r => r.id), ...context.activations.map(r => r.to)])].sort();
  for (const root of roots) lines.push(json({ root,
    resolvedEntities: context.inclusion.entities.filter(e => e.resolvedFrom.includes(root)).map(e => e.id),
    tokenDependencies: context.inclusion.tokens.filter(t => t.resolvedFrom.includes(root)).map(t => t.path),
  }));
  lines.push('Component contracts accompany their selected entity IDs. Genuine relationship evidence retains its authored direction; the resolver policy explains traversal.');
  lines.push('Explicit roots and local activations are caller choices. Relationship evidence above is authored; contract and token dependencies follow resolution. Inclusion does not dictate a final layout or prove applicability.');
  lines.push('## Provenance · repository-relative references');
  lines.push('Hashes identify supplied bytes, not authenticity or freshness. Upstream validation establishes freshness against authored authority. Source hashes below refer to the complete cited source; quoted excerpts are selected sections.');
  for (const [path, source] of Object.entries(context.sources).sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(`${path} · SHA-256 ${source.sha256}`);
  }
  return lines.join('\n\n') + '\n';
}
