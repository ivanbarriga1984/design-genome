import { readFile } from "node:fs/promises";

export const tokenFile = new URL("../genome/foundations/tokens.json", import.meta.url);
export type Token = { type: string; value: unknown };
export type TokenMap = Map<string, Token>;
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
function requireValue(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

/** Deliberately supports the DTCG types used by Forma, not every DTCG feature. */
export function collectTokens(source: unknown): TokenMap {
  const result: TokenMap = new Map();
  function visit(node: unknown, path: string[], inherited?: string) {
    requireValue(object(node), `Expected token/group at ${path.join(".")}`);
    const type = node.$type ?? inherited;
    if ("$value" in node) {
      requireValue(typeof type === "string", `Missing type: ${path.join(".")}`);
      requireValue(Object.keys(node).every(k => k.startsWith("$")), `Token cannot contain groups: ${path.join(".")}`);
      result.set(path.join("."), { type, value: node.$value });
    } else for (const [key, child] of Object.entries(node)) {
      if (key.startsWith("$")) {
        requireValue(["$type", "$description"].includes(key), `Unsupported group property: ${key}`);
        continue;
      }
      requireValue(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(key), `Unsupported token name: ${key}`);
      visit(child, [...path, key], typeof type === "string" ? type : undefined);
    }
  }
  visit(source, []);
  requireValue(result.size > 0, "Empty token source");
  return result;
}

function dimension(value: unknown): string {
  requireValue(object(value) && typeof value.value === "number" && Number.isFinite(value.value)
    && ["px", "rem"].includes(String(value.unit)), "Invalid dimension");
  return `${value.value}${value.unit}`;
}

export function resolveToken(tokens: TokenMap, path: string, trail: string[] = []): Token {
  requireValue(!trail.includes(path), `Cyclic token alias: ${[...trail, path].join(" -> ")}`);
  const token = tokens.get(path);
  requireValue(token, `Unknown token: ${path}`);
  if (typeof token.value === "string" && token.value.startsWith("{")) {
    requireValue(/^\{[^{}]+\}$/.test(token.value), `Malformed alias: ${path}`);
    const target = resolveToken(tokens, token.value.slice(1, -1), [...trail, path]);
    requireValue(target.type === token.type, `Alias type mismatch: ${path}`);
    return target;
  }
  return token;
}

function cssValue(tokens: TokenMap, token: Token): string {
  const v = token.value;
  switch (token.type) {
    case "dimension": return dimension(v);
    case "fontFamily": {
      const families = Array.isArray(v) ? v : [v];
      requireValue(families.length && families.every(f => typeof f === "string" && f.trim()), "Invalid font family");
      return families.map(f => ["serif", "sans-serif", "monospace", "system-ui"].includes(f as string) ? f : JSON.stringify(f)).join(", ");
    }
    case "color": {
      requireValue(object(v) && v.colorSpace === "srgb" && Array.isArray(v.components)
        && v.components.length === 3 && v.components.every(c => typeof c === "number" && Number.isFinite(c) && c >= 0 && c <= 1), "Invalid sRGB color");
      const alpha = v.alpha ?? 1;
      requireValue(typeof alpha === "number" && Number.isFinite(alpha) && alpha >= 0 && alpha <= 1, "Invalid color alpha");
      return `rgb(${v.components.map(c => Number((c * 255).toFixed(6))).join(" ")} / ${alpha})`;
    }
    case "typography": {
      requireValue(object(v), "Invalid typography");
      requireValue(typeof v.fontWeight === "number" && v.fontWeight >= 1 && v.fontWeight <= 1000, "Invalid font weight");
      requireValue(typeof v.lineHeight === "number" && Number.isFinite(v.lineHeight) && v.lineHeight > 0, "Invalid line height");
      dimension(v.letterSpacing);
      let family: Token = { type: "fontFamily", value: v.fontFamily };
      if (typeof v.fontFamily === "string" && v.fontFamily.startsWith("{")) {
        requireValue(/^\{[^{}]+\}$/.test(v.fontFamily), "Malformed font-family alias");
        family = resolveToken(tokens, v.fontFamily.slice(1, -1));
        requireValue(family.type === "fontFamily", "Typography font-family type mismatch");
      }
      return `${v.fontWeight} ${dimension(v.fontSize)}/${v.lineHeight} ${cssValue(tokens, family)}`;
    }
    default: throw new Error(`Unsupported token type: ${token.type}`);
  }
}

/** Validate every source token, including internal references, before returning CSS. */
export function deriveCss(source: unknown): { css: string; tokens: TokenMap } {
  const tokens = collectTokens(source);
  const lines: string[] = [];
  const names = new Set<string>();
  function emit(name: string, value: string) {
    requireValue(!names.has(name), `CSS variable collision: ${name}`);
    names.add(name); lines.push(`  ${name}: ${value};`);
  }
  for (const path of [...tokens.keys()].sort()) {
    const token = resolveToken(tokens, path);
    const value = cssValue(tokens, token);
    if (path.startsWith("reference.")) continue;
    requireValue(["color", "typography", "spacing", "radius", "border", "focus"].includes(path.split(".")[0]), `Unknown consumer group: ${path}`);
    const name = `--forma-${path.replaceAll(".", "-")}`;
    emit(name, value);
    if (token.type === "typography") {
      emit(`${name}-letter-spacing`, dimension((token.value as Record<string, unknown>).letterSpacing));
    }
  }
  return { css: `/* GENERATED from genome/foundations/tokens.json. DO NOT EDIT. Run npm run tokens. */\n:root {\n${lines.join("\n")}\n}\n`, tokens };
}

export async function readTokens() {
  return deriveCss(JSON.parse(await readFile(tokenFile, "utf8")));
}
