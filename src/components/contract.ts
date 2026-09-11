import type { CSSProperties } from "react";
import { contracts } from "../../genome/components/contracts.ts";

export const buttonContract = contracts[0];
export const inputContract = contracts[1];
export const cardContract = contracts[2];
export const stackContract = contracts[3];

/** Validate the closed API at runtime as well as through TypeScript. */
export function validateProps(contract: typeof contracts[number], props: object) {
  const api = contract.api as Record<string, { type: string; values?: readonly string[]; required?: boolean }>;
  for (const [name, value] of Object.entries(props)) {
    if (!Object.hasOwn(api, name)) throw new Error(`${contract.id}: unsupported prop ${name}`);
    if (value === undefined) continue;
    const spec = api[name];
    if (spec.values && !spec.values.includes(value)) throw new Error(`${contract.id}: unsupported ${name}`);
    if (["boolean", "string"].includes(spec.type) && typeof value !== spec.type) throw new Error(`${contract.id}: invalid ${name}`);
    if (spec.type === "callback" && typeof value !== "function") throw new Error(`${contract.id}: invalid ${name}`);
  }
  for (const [name, spec] of Object.entries(api)) {
    if (spec.required && (props as Record<string, unknown>)[name] == null) throw new Error(`${contract.id}: ${name} is required`);
  }
}

export function tokenVar(path: string) { return `var(--forma-${path.replaceAll(".", "-")})`; }

/** Private component aliases derive from contract mappings, never consumer styles. */
export function roleStyles(contract: typeof contracts[number]): CSSProperties {
  return Object.fromEntries(Object.entries(contract.tokenRoles).flatMap(([role, path]) => {
    if (typeof path !== "string") return [];
    const key = `--${role.replaceAll(".", "-").replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)}`;
    const result = [[key, tokenVar(path)]];
    if (path.startsWith("typography.")) result.push([`${key}-letter-spacing`, tokenVar(`${path}-letter-spacing`)]);
    return result;
  }));
}
