/** Unresolved fields are deliberately not supported-value enumerations. */
export interface ComponentContract {
  id: string;
  implementation: null;
  variants: null;
  states: null;
  api: null;
}

export const contracts = [
  {"id": "forma.components.button", "implementation": null, "variants": null, "states": null, "api": null},
  {"id": "forma.components.input", "implementation": null, "variants": null, "states": null, "api": null},
  {"id": "forma.components.card", "implementation": null, "variants": null, "states": null, "api": null},
  {"id": "forma.components.stack", "implementation": null, "variants": null, "states": null, "api": null},
] as const satisfies readonly ComponentContract[];
