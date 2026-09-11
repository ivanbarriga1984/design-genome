import assert from "node:assert/strict";
import { readFile, realpath } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import type { CompiledGenome } from "./compile-genome.ts";

/** Pure query over the compiled document: no authority reads and no language inference. */
export function resolveContext(artifact: CompiledGenome, seed: string) {
  assert.equal(artifact.generated.formatVersion, 1, "Unsupported compiled format");
  const byId = new Map(artifact.entities.map(e => [e.id as string, e]));
  assert.ok(byId.has(seed), `Unknown intent entity: ${seed}`);
  const selected = new Set<string>([seed]);
  const queue = [seed];
  const traversed = new Set<CompiledGenome["relationships"][number]>();
  while (queue.length) {
    const id = queue.shift()!;
    for (const edge of artifact.relationships) {
      let target: string | undefined;
      if (edge.from === id && ["uses", "governed-by"].includes(edge.relation)) target = edge.to;
      if (edge.to === id && edge.relation === "informs") target = edge.from;
      if (!target) continue;
      assert.ok(byId.has(target), `Broken context edge: ${target}`);
      traversed.add(edge);
      if (!selected.has(target)) { selected.add(target); queue.push(target); }
    }
  }
  const contracts = artifact.contracts.filter(c => selected.has(c.id));
  // Derived dependency closure from actual contract token roles and foundation pointers.
  const tokenPaths = new Set<string>();
  for (const entity of artifact.entities.filter(e => selected.has(e.id))) {
    const pointer = "contract" in entity.authority ? entity.authority.contract : undefined;
    if (pointer?.startsWith("foundations/tokens.json#/")) {
      const prefix = pointer.split("#/")[1].replaceAll("/", ".") + ".";
      for (const path of Object.keys(artifact.tokens)) if (path.startsWith(prefix)) tokenPaths.add(path);
    }
  }
  for (const contract of contracts) for (const role of Object.values(contract.tokenRoles)) {
    for (const path of typeof role === "string" ? [role] : role) tokenPaths.add(path);
  }
  function aliases(value: unknown): string[] {
    if (typeof value === "string" && /^\{[^{}]+\}$/.test(value)) return [value.slice(1, -1)];
    if (Array.isArray(value)) return value.flatMap(aliases);
    if (value && typeof value === "object") return Object.values(value).flatMap(aliases);
    return [];
  }
  const pending = [...tokenPaths];
  while (pending.length) {
    const path = pending.shift()!;
    assert.ok(artifact.tokens[path], `Missing context token: ${path}`);
    for (const target of aliases(artifact.tokens[path].value)) if (!tokenPaths.has(target)) { tokenPaths.add(target); pending.push(target); }
  }
  const rules = artifact.rules.filter(r => selected.has(r.id));
  return {
    seed,
    genome: artifact.genome,
    policy: "Follow outgoing uses/governed-by and incoming informs. related-to remains conditional and is not traversed. Exceptions are referenced context, never automatically applied.",
    entities: artifact.entities.filter(e => selected.has(e.id)),
    relationships: artifact.relationships.filter(e => traversed.has(e)),
    conditional: artifact.relationships.filter(e => e.relation === "related-to" && selected.has(e.from)).map(edge => ({ edge, entity: byId.get(edge.to) })),
    contracts, rules,
    exceptions: artifact.exceptions.filter(e => rules.some(r => r.id === e.ruleId)),
    tokens: Object.fromEntries([...tokenPaths].sort().map(path => [path, artifact.tokens[path]])),
    governance: artifact.entities.find(e => e.id === artifact.genome.id),
    // Full source catalog keeps referenced prose and cross-links available without crawling.
    sources: artifact.sources,
    referenceBases: artifact.referenceBases,
    limitations: artifact.limitations,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(await realpath(process.argv[1])).href) {
  assert.ok(process.argv.length <= 3, "Use one stable entity ID");
  // This example consumes only JSON. Run genome:check first to establish local freshness.
  const artifact: CompiledGenome = JSON.parse(await readFile(new URL("../generated/forma-genome.json", import.meta.url), "utf8"));
  console.log(JSON.stringify(resolveContext(artifact, process.argv[2] ?? "forma.patterns.destructive-action"), null, 2));
}
