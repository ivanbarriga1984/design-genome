import assert from "node:assert/strict";
import { readAuthority } from "./authorities.ts";
import { pathToFileURL } from "node:url";
import { entities, relationships } from "../genome/registry.ts";
import { contracts } from "../genome/components/contracts.ts";
import { rules } from "../genome/rules/rules.ts";
import { exceptions } from "../genome/governance/exceptions.ts";
import { readTokens, type TokenMap } from "./tokens.ts";

/** Source integrity only; this is not executable UI or human-judgment validation. */
export const authoredRecords = { entities, relationships, contracts, rules, exceptions };
export async function validateGenome(tokens: TokenMap, records = authoredRecords) {
  const { entities, relationships, contracts, rules, exceptions } = records;
  const ids = new Set(entities.map(e => e.id));
  assert.equal(ids.size, entities.length, "Duplicate entity IDs");
  for (const entity of entities) {
    assert.match(entity.id, /^forma\.(principles|foundations|components|patterns|content|rules|governance)\.[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid stable ID");
    assert.ok(Object.keys(entity.authority).length > 0, "Missing authority");
    assert.ok(["draft", "active", "deprecated"].includes(entity.status));
    assert.ok(["Design", "Design + Engineering"].includes(entity.owner));
    for (const source of Object.values(entity.authority)) {
      await readAuthority(source);
    }
  }
  const edges = new Set();
  for (const r of relationships) {
    assert.ok(ids.has(r.from) && ids.has(r.to), "Unresolved relationship");
    assert.ok(["informs", "uses", "governed-by", "related-to"].includes(r.relation), "Unknown relationship kind");
    const key = `${r.from}|${r.relation}|${r.to}`;
    assert.ok(!edges.has(key), "Duplicate relationship"); edges.add(key);
  }
  for (const list of [rules, exceptions, contracts]) {
    assert.equal(new Set(list.map(r => r.id)).size, list.length, "Duplicate structured record IDs");
    for (const record of list) assert.ok(ids.has(record.id), `Unregistered record: ${record.id}`);
  }
  for (const rule of rules) {
    assert.ok(["MUST", "SHOULD", "MUST NOT"].includes(rule.level), "Invalid rule level");
    assert.ok(["automated-where-applicable", "automated-where-practical", "partially-automated-architectural", "human-review", "human-review-guidance", "automated-where-implementation-permits"].includes(rule.validation.mode), "Invalid validation mode");
    assert.equal(rule.validation.checker, null, "Unsupported checker reference");
    await readAuthority(rule.guidance);
  }
  for (const exception of exceptions) {
    assert.ok(rules.some(r => r.id === exception.ruleId), "Unknown exception rule");
    for (const key of ["reason", "scope", "review"] as const) assert.ok(exception[key].trim(), `Empty exception ${key}`);
    const entity = entities.find(e => e.id === exception.id)!;
    assert.equal(entity.status, exception.status, "Exception status disagrees with registry");
    assert.equal(entity.owner, exception.owner, "Exception owner disagrees with registry");
    const expiry = (exception as { expiresOn?: string }).expiresOn;
    if (expiry !== undefined) assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(expiry) && new Date(expiry).toISOString().slice(0, 10) === expiry, "Invalid exception expiry");
  }
  assert.equal(new Set(contracts.map(c => c.id)).size, 4);
  for (const contract of contracts) {
    assert.ok(ids.has(contract.id));
    await readAuthority(contract.implementation, "");
    await readAuthority(contract.accessibility.humanReview);
    const authority = entities.find(e => e.id === contract.id)!.authority;
    assert.ok("implementation" in authority, "Missing implementation authority");
    assert.equal(authority.implementation, `../${contract.implementation}`, "Implementation authorities disagree");
    for (const name of contract.unsupportedProps) assert.ok(!Object.hasOwn(contract.api, name), "Allowed and unsupported prop overlap");
    for (const role of Object.values(contract.tokenRoles)) {
      for (const path of typeof role === "string" ? [role] : role) assert.ok(tokens.has(path) && !path.startsWith("reference."), `Unknown/nonsemantic contract token: ${path}`);
    }
    for (const prop of Object.values(contract.api)) {
      assert.ok(["enum", "boolean", "string", "content", "callback"].includes(prop.type), "Unknown prop type");
      if (prop.type === "enum") assert.ok("values" in prop && prop.values.length > 0 && new Set(prop.values).size === prop.values.length, "Invalid enum inventory");
      if ("default" in prop && ["boolean", "string"].includes(prop.type)) assert.equal(typeof prop.default, prop.type, "Invalid default type");
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
