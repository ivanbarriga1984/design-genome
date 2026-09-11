import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

export const repository = new URL("../", import.meta.url);

/** Registry/guidance references are genome-relative; implementations are root-relative. */
export function authorityPath(reference: string, base = "genome/") {
  assert.ok(reference.trim() && !reference.includes("\\") && !/^[a-z]+:/i.test(reference) && !reference.startsWith("/"), `Invalid local authority: ${reference}`);
  const [file, fragment] = reference.split("#");
  assert.ok(reference.split("#").length <= 2, `Invalid authority fragment: ${reference}`);
  const url = new URL(base + file, repository);
  assert.ok(url.href.startsWith(repository.href), `Authority escapes repository: ${reference}`);
  return { path: decodeURIComponent(url.href.slice(repository.href.length)), fragment };
}

/** Matches the simple, unique ATX headings used by the authored Genome guides. */
export function validateReference(text: string, reference: string, base = "genome/") {
  const { path, fragment } = authorityPath(reference, base);
  if (!fragment) return;
  if (path.endsWith(".json")) {
    assert.ok(fragment.startsWith("/"), `Invalid JSON pointer: ${reference}`);
    let node = JSON.parse(text);
    for (const key of fragment.slice(1).split("/")) {
      assert.ok(node && Object.hasOwn(node, key.replaceAll("~1", "/").replaceAll("~0", "~")), `Missing pointer: ${reference}`);
      node = node[key.replaceAll("~1", "/").replaceAll("~0", "~")];
    }
  } else if (path.endsWith(".ts")) {
    assert.ok(text.includes(`export const ${fragment} `), `Missing export: ${reference}`);
  } else {
    assert.ok(path.endsWith(".md"), `Unsupported authority format: ${reference}`);
    const headings = [...text.matchAll(/^#{1,6} (.+)$/gm)].map(m => m[1].toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s/g, "-"));
    assert.equal(headings.filter(h => h === fragment).length, 1, `Missing or ambiguous heading: ${reference}`);
  }
}

export async function readAuthority(reference: string, base = "genome/") {
  const { path } = authorityPath(reference, base);
  const text = await readFile(new URL(path, repository), "utf8");
  validateReference(text, reference, base);
  return { path, text };
}
