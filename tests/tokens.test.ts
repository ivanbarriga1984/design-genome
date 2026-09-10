import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { deriveCss, tokenFile } from "../scripts/tokens.ts";
import { validateGenome } from "../scripts/validate-genome.ts";

const source = JSON.parse(await readFile(tokenFile, "utf8"));

test("real Genome resolves and emits deterministic, consumer-only CSS", async () => {
  const { css, tokens } = deriveCss(source);
  await validateGenome(tokens);
  assert.equal(css, deriveCss(structuredClone(source)).css);
  assert.match(css, /--forma-color-action-primary: rgb\(79 70 229 \/ 1\)/);
  assert.match(css, /--forma-typography-body: 400 1rem\/1.5 "Inter", sans-serif/);
  assert.match(css, /--forma-typography-body-letter-spacing: 0px/);
  assert.match(css, /--forma-spacing-4: 16px/);
  assert.ok(!css.includes("--forma-reference"));
  assert.ok(!css.includes("{reference."));
});

test("missing aliases and cyclic aliases fail before output", () => {
  const missing = structuredClone(source);
  missing.color.text.primary.$value = "{color.missing}";
  assert.throws(() => deriveCss(missing), /Unknown token/);
  const cycle = structuredClone(source);
  cycle.color.text.primary.$value = "{color.text.muted}";
  cycle.color.text.muted.$value = "{color.text.primary}";
  assert.throws(() => deriveCss(cycle), /Cyclic token alias/);
});

test("invalid types, dimensions, colors and mismatched aliases fail", () => {
  const mutations = [
    (s: typeof source) => { s.spacing["1"].$value.unit = "bananas"; },
    (s: typeof source) => { s.color.text.primary.$value.components[0] = 2; },
    (s: typeof source) => { s.color.text.primary.$value = "{spacing.1}"; },
    (s: typeof source) => { s.typography.body.$value.fontFamily = "{spacing.1}"; },
    (s: typeof source) => { s.spacing.$type = "unknown"; },
  ];
  for (const mutate of mutations) {
    const invalid = structuredClone(source); mutate(invalid);
    assert.throws(() => deriveCss(invalid));
  }
});

test("CSS name collisions are rejected", () => {
  const invalid = structuredClone(source);
  invalid.color["text-primary"] = { $value: "{color.text.primary}" };
  assert.throws(() => deriveCss(invalid), /CSS variable collision/);
});

test("a removed mapped token is rejected by contract integrity checks", async () => {
  const { tokens } = deriveCss(source);
  tokens.delete("radius.default");
  await assert.rejects(validateGenome(tokens), /Unknown\/nonsemantic contract token/);
});
