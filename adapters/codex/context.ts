import assert from "node:assert/strict";
import { mkdir, readFile, realpath, rename, rm, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolveSelection } from "../../scripts/select-context.ts";
import { formatCodexContext } from "./format.ts";
// Retain existing helper imports used by Reference/workshop projections.
export { parseArtifact, excerpt } from "../../scripts/select-context.ts";

export const intent = "forma.patterns.destructive-action";
export const request = "Add a destructive action allowing a user to delete a project.";
export const outputFile = new URL("../../generated/codex-destructive-action.md", import.meta.url);
const inputFile = new URL("../../generated/forma-genome.json", import.meta.url);

/** Compatibility example only. Reusable callers select context and format their own task. */
export function renderContext(compiledText: string, seed = intent): string {
  assert.equal(seed, intent, "This compatibility example supports only forma.patterns.destructive-action; use resolveSelection and formatCodexContext for other tasks");
  return formatCodexContext({ task: request, context: resolveSelection(compiledText, {
    roots: [{ id: seed, reason: "Caller selected the destructive-action pattern for the deletion task." }],
  }) });
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
