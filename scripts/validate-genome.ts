import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { entities, relationships } from "../genome/registry.ts";
import { contracts } from "../genome/components/contracts.ts";
import { rules } from "../genome/rules/rules.ts";
import { exceptions } from "../genome/governance/exceptions.ts";
import { readTokens, type TokenMap } from "./tokens.ts";

/** Source integrity only; this is not executable UI or human-judgment validation. */
export async function validateGenome(tokens: TokenMap) {
  const ids = new Set(entities.map(e => e.id));
  assert.equal(ids.size, entities.length, "Duplicate entity IDs");
  for (const entity of entities) {
    assert.ok(["draft", "active", "deprecated"].includes(entity.status));
    assert.ok(["Design", "Design + Engineering"].includes(entity.owner));
    for (const source of Object.values(entity.authority)) {
      const [file, fragment] = source.split("#");
      const text = await readFile(new URL(`../genome/${file}`, import.meta.url), "utf8");
      if (file.endsWith(".json") && fragment) {
        assert.ok(fragment.startsWith("/"));
        let node = JSON.parse(text);
        for (const key of fragment.slice(1).split("/")) node = node[key.replaceAll("~1", "/").replaceAll("~0", "~")];
        assert.ok(node, `Missing pointer: ${source}`);
      } else if (file.endsWith(".ts") && fragment) assert.ok(text.includes(`export const ${fragment} `), source);
      else if (fragment) {
        const headings = [...text.matchAll(/^#{1,6} (.+)$/gm)].map(m => m[1].toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s/g, "-"));
        assert.ok(headings.includes(fragment), source);
      }
    }
  }
  const edges = new Set();
  for (const r of relationships) {
    assert.ok(ids.has(r.from) && ids.has(r.to), "Unresolved relationship");
    const key = `${r.from}|${r.relation}|${r.to}`;
    assert.ok(!edges.has(key), "Duplicate relationship"); edges.add(key);
  }
  for (const rule of rules) assert.ok(ids.has(rule.id));
  for (const exception of exceptions) assert.ok(rules.some(r => r.id === exception.ruleId));
  assert.equal(new Set(contracts.map(c => c.id)).size, 4);
  for (const contract of contracts) {
    assert.ok(ids.has(contract.id));
    await readFile(new URL(`../${contract.implementation}`, import.meta.url), "utf8");
    for (const role of Object.values(contract.tokenRoles)) {
      for (const path of typeof role === "string" ? [role] : role) assert.ok(tokens.has(path) && !path.startsWith("reference."), `Unknown/nonsemantic contract token: ${path}`);
    }
    for (const prop of Object.values(contract.api)) {
      if ("values" in prop && "default" in prop) assert.ok((prop.values as readonly unknown[]).includes(prop.default), "Invalid enum default");
    }
  }
  const stack = contracts.find(c => c.id === "forma.components.stack")!;
  assert.deepEqual([...stack.api.gap.values].sort(), [...tokens.keys()].filter(p => p.startsWith("spacing.")).sort(), "Stack gap inventory is stale");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { tokens } = await readTokens();
  await validateGenome(tokens);
  console.log(`Genome source integrity passed (${tokens.size} tokens, ${contracts.length} contracts).`);
}
