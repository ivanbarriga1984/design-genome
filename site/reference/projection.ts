// Build-time presentation only. The approved compiler owns validation and projection.
import { compileGenome, canonicalJson } from "../../scripts/compile-genome.ts";
import { resolveContext } from "../../scripts/query-genome.ts";
import { excerpt } from "../../adapters/codex/context.ts";
import { authorityPath } from "../../scripts/authorities.ts";
import { readTokens } from "../../scripts/tokens.ts";
import type { Entity } from "../../genome/governance/model.ts";

export async function referenceProjection() {
  const compiled = await compileGenome();
  const { css } = await readTokens();
  const cssValues = Object.fromEntries([...css.matchAll(/(--forma-[\w-]+): (.+);/g)].map(m => [m[1], m[2]]));
  const entities = compiled.entities.map((record) => {
    const entity: Entity = record;
    const rule = compiled.rules.find(r => r.id === entity.id);
    const guidanceRef = entity.authority.guidance ?? rule?.guidance;
    const source = guidanceRef ? authorityPath(guidanceRef) : undefined;
    const guidance = source ? excerpt(compiled.sources[source.path].text!, source.fragment) : "";
    const title = guidance.match(/^#+ (.+)$/m)?.[1] ?? (entity.id === compiled.genome.id ? "Forma governance" : "Embedded workflow label exception");
    return { ...entity, title, guidance: guidance.replace(/^#+ .+\n*/, ""), guidanceRef,
      source: source?.path, slug: entity.id.split(".").slice(2).join("."), domain: entity.id.split(".")[1] };
  });
  const resolved = resolveContext(compiled, "forma.patterns.destructive-action");
  return {
    genome: compiled.genome, entities, relationships: compiled.relationships,
    contracts: compiled.contracts, rules: compiled.rules, exceptions: compiled.exceptions,
    tokens: compiled.tokens, cssValues,
    geometry: excerpt(compiled.sources["genome/foundations/README.md"].text!, "border-and-focus-geometry"),
    sources: Object.fromEntries(Object.entries(compiled.sources).map(([path, source]) => [path, { sha256: source.sha256 }])),
    generated: compiled.generated,
    machine: {
      seed: resolved.seed, policy: resolved.policy,
      entities: resolved.entities.map(e => e.id),
      contracts: resolved.contracts.map(c => c.id),
      rules: resolved.rules.map(({id, level, validation}) => ({id, level, validation})),
      conditional: resolved.conditional,
      exceptions: resolved.exceptions,
      example: { id: compiled.contracts[0].id, api: { variant: compiled.contracts[0].api.variant }, tokenRoles: { "primary.background": compiled.contracts[0].tokenRoles["primary.background"] } },
    },
    // Canonical bytes for a small inspectable excerpt, not a substitute artifact.
    compiledExcerpt: canonicalJson({ generated: compiled.generated, genome: compiled.genome, relationships: compiled.relationships.filter(e => e.from === resolved.seed) }),
  };
}
export type ReferenceData = Awaited<ReturnType<typeof referenceProjection>>;
