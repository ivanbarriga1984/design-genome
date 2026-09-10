import { mkdir, writeFile, rename, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { readTokens } from "./tokens.ts";
import { validateGenome } from "./validate-genome.ts";

export const cssFile = new URL("../generated/forma-tokens.css", import.meta.url);

export async function generateTokens() {
  const temporary = new URL("./forma-tokens.css.tmp", cssFile);
  try {
    // Derive in memory; validate sources before publishing an official artifact.
    const { css, tokens } = await readTokens();
    await validateGenome(tokens);
    await mkdir(new URL("./", cssFile), { recursive: true });
    await writeFile(temporary, css);
    await rename(temporary, cssFile);
  } catch (error) {
    // A previous valid artifact must not masquerade as current after a failure.
    await rm(cssFile, { force: true });
    await rm(temporary, { force: true });
    throw error;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await generateTokens();
  console.log("Generated generated/forma-tokens.css from valid authored sources.");
}
