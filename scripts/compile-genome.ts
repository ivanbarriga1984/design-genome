import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, realpath, rename, rm, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { genome } from "../genome/governance/model.ts";
import { authoredRecords, validateGenome } from "./validate-genome.ts";
import { readTokens } from "./tokens.ts";
import { readAuthority } from "./authorities.ts";

export const genomeFile = new URL("../generated/forma-genome.json", import.meta.url);

/** Sort object keys only. Preserve authored array order, types, prose and nulls. */
export function canonicalJson(value: unknown): string {
  function normalize(v: unknown): unknown {
    if (v === null || typeof v === "string" || typeof v === "boolean") return v;
    if (typeof v === "number") { assert.ok(Number.isFinite(v), "Nonfinite JSON number"); return v; }
    if (Array.isArray(v)) return v.map(normalize);
    assert.ok(v && typeof v === "object" && Object.getPrototypeOf(v) === Object.prototype, "Non-JSON source value");
    return Object.fromEntries(Object.keys(v).sort().map(k => [k, normalize((v as Record<string, unknown>)[k])]));
  }
  return JSON.stringify(normalize(value), null, 2) + "\n";
}

export async function compileGenome() {
  const { tokens } = await readTokens();
  await validateGenome(tokens);
  const { entities, relationships, contracts, rules, exceptions } = authoredRecords;
  const sources: Record<string, { sha256: string; text?: string }> = {};
  async function include(reference: string, base = "genome/") {
    const { path, text } = await readAuthority(reference, base);
    sources[path] = { sha256: createHash("sha256").update(text).digest("hex"), ...(/\.(md|json)$/.test(path) ? { text } : {}) };
  }
  // These are the existing structured authority modules, not implementation imports.
  const exports: Record<string, readonly { id: string }[]> = {
    "components/contracts.ts#contracts": contracts,
    "rules/rules.ts#rules": rules,
    "governance/exceptions.ts#exceptions": exceptions,
    "governance/model.ts#genome": [genome],
  };
  for (const entity of entities) {
    for (const reference of Object.values(entity.authority)) {
      await include(reference);
      if (reference.includes(".ts#")) {
        assert.ok(exports[reference], `Unbound authoritative export: ${reference}`);
        assert.equal(exports[reference].filter(r => r.id === entity.id).length, 1, `Missing record in authority: ${entity.id}`);
      }
    }
  }
  for (const rule of rules) await include(rule.guidance);
  for (const contract of contracts) await include(contract.accessibility.humanReview);
  for (const path of ["registry.ts", "foundations/tokens.json", "foundations/README.md", "components/contracts.ts", "rules/rules.ts", "governance/model.ts", "governance/exceptions.ts"]) await include(path);
  // Verbatim methodology context, with separate provenance; never parsed as Forma rules.
  for (const path of ["docs/specification-v0.1.md", "docs/architecture-v0.1.md"]) await include(path, "");
  const registeredGenome = entities.find(e => e.id === genome.id)!;
  assert.equal(registeredGenome.status, genome.status, "Genome status disagrees with registry");
  assert.equal(registeredGenome.owner, genome.owner, "Genome owner disagrees with registry");
  const tokenRecords = Object.fromEntries([...tokens].map(([path, token]) => [path, {
    ...token,
    source: `genome/foundations/tokens.json#/${path.replaceAll(".", "/")}`,
  }]));
  return {
    generated: { notice: "GENERATED. DO NOT EDIT. Authoritative sources remain in genome/ and docs/.", formatVersion: 1, command: "npm run genome:generate" },
    referenceBases: { authority: "genome/", guidance: "genome/", implementation: "", sources: "" },
    genome, entities, relationships, contracts, rules, exceptions, tokens: tokenRecords, sources,
    limitations: [
      "Markdown is preserved verbatim in sources, not normalized into new requirements. Fragment references retain their authored scope; full documents also preserve surrounding context.",
      "Tokens retain typed values and aliases, including internal reference.* dependencies; no token maturity is inferred from a group or from executable availability.",
      "Implementation references identify existing files; their hashes are provenance, not proof of behavior or contract conformance. Implementation code is not embedded or interpreted.",
      "Draft exceptions are context, not permission. Applicability, product intent, UX quality and accessibility still require human judgment.",
      "Source links inside prose are not recursively crawled. TypeScript type declarations remain source-referenced; this format does not redefine governance vocabularies.",
    ],
  };
}
export type CompiledGenome = Awaited<ReturnType<typeof compileGenome>>;

export async function checkFreshness(file = genomeFile) {
  const expected = canonicalJson(await compileGenome());
  let actual: string;
  try { actual = await readFile(file, "utf8"); }
  catch { throw new Error("Compiled Genome is missing. Run npm run genome:generate."); }
  assert.ok(actual === expected, "Compiled Genome is stale or modified. Run npm run genome:generate.");
}

export async function generateGenome(file = genomeFile, compile = compileGenome) {
  const temporary = new URL(file.href + ".tmp");
  try {
    const text = canonicalJson(await compile());
    await mkdir(new URL("./", file), { recursive: true });
    await writeFile(temporary, text);
    await rename(temporary, file);
  } catch (error) {
    await rm(file, { force: true }); await rm(temporary, { force: true }); throw error;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(await realpath(process.argv[1])).href) {
  assert.ok(process.argv.length <= 3 && [undefined, "--check"].includes(process.argv[2]), "Use --check or no arguments");
  if (process.argv[2] === "--check") { await checkFreshness(); console.log("Compiled Genome is valid and current."); }
  else { await generateGenome(); console.log("Generated generated/forma-genome.json from validated authority."); }
}
