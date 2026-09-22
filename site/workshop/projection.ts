// Build-time consumer projection, never an independent design authority.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { compileGenome, canonicalJson } from "../../scripts/compile-genome.ts";
import { resolveContext } from "../../scripts/query-genome.ts";
import { excerpt } from "../../adapters/codex/context.ts";
import { resolveSelection } from "../../scripts/select-context.ts";
import { analyticsRoots } from "./scenarios.ts";
import { authorityPath } from "../../scripts/authorities.ts";

export async function workshopProjection() {
  const compiled = await compileGenome();
  function select(seed: string) {
    const { sources, ...context } = resolveContext(compiled, seed);
    const guidance = context.entities.flatMap(entity => {
      const rule = context.rules.find(rule => rule.id === entity.id);
      const ref = ("guidance" in entity.authority ? entity.authority.guidance : undefined) ?? rule?.guidance;
      if (!ref) return [];
      const source = authorityPath(ref);
      const text = excerpt(sources[source.path].text!, source.fragment);
      const body = text.replace(/^#+ .+\n*/, "");
      return [{ id: entity.id, title: text.match(/^#+ (.+)$/m)?.[1] ?? entity.id,
        text, summary: body.split(/\n\s*\n/)[0].replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"), reference: ref,
        path: source.path, sha256: sources[source.path].sha256,
        status: entity.status, owner: entity.owner, level: rule?.level }];
    });
    return { ...context, guidance };
  }
  const primary = select("forma.patterns.destructive-action");
  const inputEdge = primary.conditional.find(item => item.entity?.id === "forma.components.input");
  assert.ok(inputEdge, "Workshop requires the authored conditional Input association");
  assert.ok(!primary.contracts.some(contract => contract.id === inputEdge.entity!.id), "Input must remain conditional");
  const selected = resolveSelection(canonicalJson(compiled), { roots: analyticsRoots.map(id => ({ id, reason: "Explicit workshop selection; no analytics pattern exists." })) });
  const analytics = { ...selected, guidance: selected.entities.flatMap(entity => {
    const rule = selected.rules.find(rule => rule.id === entity.id);
    const ref = ("guidance" in entity.authority ? entity.authority.guidance : undefined) ?? rule?.guidance;
    if (!ref) return [];
    const source = selected.guidance[ref];
    const body = source.text.replace(/^#+ .+\n*/, "");
    return [{ id: entity.id, title: source.text.match(/^#+ (.+)$/m)?.[1] ?? entity.id,
      text: source.text, summary: body.split(/\n\s*\n/)[0].replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"), reference: ref,
      path: source.path, sha256: source.sha256, status: entity.status, owner: entity.owner, level: rule?.level }];
  }) };
  return {
    form: select("forma.patterns.form"),
    analytics,
    compiledSha256: createHash("sha256").update(canonicalJson(compiled)).digest("hex"),
    sources: Object.fromEntries(Object.entries(compiled.sources).map(([path, source]) => [path, { sha256: source.sha256 }])),
    primary,
    // Pre-resolve for delivery reliability; activate only after local human review.
    additionalEntry: { relationship: inputEdge.edge, context: select(inputEdge.entity!.id) },
  };
}
export type WorkshopData = Awaited<ReturnType<typeof workshopProjection>>;
