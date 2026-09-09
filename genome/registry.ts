import type { Entity, Relationship } from "./governance/model.ts";
import { genome } from "./governance/model.ts";
import { exceptions } from "./governance/exceptions.ts";

/** Authority paths are relative to genome/. This index does not own source content. */
export const entities = [
  {"id": "forma.principles.clarity-before-density", "status": "draft", "owner": "Design", "authority": {"guidance": "principles/README.md#clarity-before-density"}},
  {"id": "forma.principles.hierarchy-communicates-intent", "status": "draft", "owner": "Design", "authority": {"guidance": "principles/README.md#hierarchy-communicates-intent"}},
  {"id": "forma.principles.reveal-complexity-progressively", "status": "draft", "owner": "Design", "authority": {"guidance": "principles/README.md#reveal-complexity-progressively"}},
  {"id": "forma.foundations.color", "status": "draft", "owner": "Design", "authority": {"guidance": "foundations/README.md#color"}},
  {"id": "forma.foundations.typography", "status": "draft", "owner": "Design", "authority": {"guidance": "foundations/README.md#typography"}},
  {"id": "forma.foundations.spacing", "status": "draft", "owner": "Design", "authority": {"guidance": "foundations/README.md#spacing"}},
  {"id": "forma.foundations.radius", "status": "draft", "owner": "Design", "authority": {"guidance": "foundations/README.md#radius"}},
  {"id": "forma.components.button", "status": "draft", "owner": "Design + Engineering", "authority": {"guidance": "components/README.md#button", "contract": "components/contracts.ts#contracts"}},
  {"id": "forma.components.input", "status": "draft", "owner": "Design + Engineering", "authority": {"guidance": "components/README.md#input", "contract": "components/contracts.ts#contracts"}},
  {"id": "forma.components.card", "status": "draft", "owner": "Design + Engineering", "authority": {"guidance": "components/README.md#card", "contract": "components/contracts.ts#contracts"}},
  {"id": "forma.components.stack", "status": "draft", "owner": "Design + Engineering", "authority": {"guidance": "components/README.md#stack", "contract": "components/contracts.ts#contracts"}},
  {"id": "forma.patterns.form", "status": "draft", "owner": "Design", "authority": {"guidance": "patterns/form.md"}},
  {"id": "forma.patterns.destructive-action", "status": "draft", "owner": "Design", "authority": {"guidance": "patterns/destructive-action.md"}},
  {"id": "forma.content.voice", "status": "draft", "owner": "Design", "authority": {"guidance": "content/README.md#voice"}},
  {"id": "forma.content.action-labels", "status": "draft", "owner": "Design", "authority": {"guidance": "content/README.md#action-labels"}},
  {"id": "forma.rules.semantic-colors-only", "status": "draft", "owner": "Design + Engineering", "authority": {"metadata": "rules/rules.ts#rules"}},
  {"id": "forma.rules.spacing-tokens-only", "status": "draft", "owner": "Design + Engineering", "authority": {"metadata": "rules/rules.ts#rules"}},
  {"id": "forma.rules.reuse-governed-components", "status": "draft", "owner": "Design + Engineering", "authority": {"metadata": "rules/rules.ts#rules"}},
  {"id": "forma.rules.destructive-styling-requires-destructive-intent", "status": "draft", "owner": "Design + Engineering", "authority": {"metadata": "rules/rules.ts#rules"}},
  {"id": "forma.rules.explicit-action-labels", "status": "draft", "owner": "Design + Engineering", "authority": {"metadata": "rules/rules.ts#rules"}},
  {"id": "forma.rules.one-primary-action-per-decision-context", "status": "draft", "owner": "Design + Engineering", "authority": {"metadata": "rules/rules.ts#rules"}},
  {"id": "forma.rules.advanced-complexity-should-be-progressive", "status": "draft", "owner": "Design + Engineering", "authority": {"metadata": "rules/rules.ts#rules"}},
  {"id": "forma.rules.unsupported-component-variants", "status": "draft", "owner": "Design + Engineering", "authority": {"metadata": "rules/rules.ts#rules"}},
  {
    id: genome.id,
    status: genome.status,
    owner: genome.owner,
    authority: { guidance: "governance/README.md", metadata: "governance/model.ts#genome" },
  },
  ...exceptions.map(({ id, status, owner }) => ({
    id, status, owner,
    authority: { metadata: "governance/exceptions.ts#exceptions" },
  })),
] as const satisfies readonly Entity[];

export type EntityId = (typeof entities)[number]["id"];

export const relationships = [
  {"from": "forma.principles.clarity-before-density", "relation": "informs", "to": "forma.patterns.form"},
  {"from": "forma.principles.hierarchy-communicates-intent", "relation": "informs", "to": "forma.patterns.form"},
  {"from": "forma.patterns.form", "relation": "uses", "to": "forma.components.button"},
  {"from": "forma.patterns.form", "relation": "uses", "to": "forma.components.stack"},
  {"from": "forma.patterns.form", "relation": "uses", "to": "forma.components.input"},
  {"from": "forma.patterns.form", "relation": "uses", "to": "forma.content.action-labels"},
  {"from": "forma.patterns.form", "relation": "governed-by", "to": "forma.rules.explicit-action-labels"},
  {"from": "forma.patterns.form", "relation": "governed-by", "to": "forma.rules.one-primary-action-per-decision-context"},
  {"from": "forma.patterns.form", "relation": "governed-by", "to": "forma.rules.reuse-governed-components"},
  {"from": "forma.patterns.form", "relation": "governed-by", "to": "forma.rules.unsupported-component-variants"},
  {"from": "forma.principles.clarity-before-density", "relation": "informs", "to": "forma.patterns.destructive-action"},
  {"from": "forma.principles.hierarchy-communicates-intent", "relation": "informs", "to": "forma.patterns.destructive-action"},
  {"from": "forma.patterns.destructive-action", "relation": "uses", "to": "forma.components.button"},
  {"from": "forma.patterns.destructive-action", "relation": "uses", "to": "forma.components.stack"},
  {"from": "forma.patterns.destructive-action", "relation": "uses", "to": "forma.content.action-labels"},
  {"from": "forma.patterns.destructive-action", "relation": "governed-by", "to": "forma.rules.explicit-action-labels"},
  {"from": "forma.patterns.destructive-action", "relation": "governed-by", "to": "forma.rules.one-primary-action-per-decision-context"},
  {"from": "forma.patterns.destructive-action", "relation": "governed-by", "to": "forma.rules.reuse-governed-components"},
  {"from": "forma.patterns.destructive-action", "relation": "governed-by", "to": "forma.rules.unsupported-component-variants"},
  {"from": "forma.principles.reveal-complexity-progressively", "relation": "informs", "to": "forma.patterns.form"},
  {"from": "forma.patterns.form", "relation": "governed-by", "to": "forma.rules.advanced-complexity-should-be-progressive"},
  {"from": "forma.patterns.destructive-action", "relation": "uses", "to": "forma.content.voice"},
  {"from": "forma.patterns.destructive-action", "relation": "governed-by", "to": "forma.rules.destructive-styling-requires-destructive-intent"},
  {"from": "forma.patterns.destructive-action", "relation": "related-to", "to": "forma.components.input", "note": "Conditional: additional entry only when the consequence warrants it; not required for every destructive action."},
  {"from": "forma.foundations.color", "relation": "informs", "to": "forma.rules.semantic-colors-only"},
  {"from": "forma.foundations.spacing", "relation": "informs", "to": "forma.rules.spacing-tokens-only"},
  {"from": "forma.components.stack", "relation": "governed-by", "to": "forma.rules.spacing-tokens-only"},
  {"from": "forma.components.button", "relation": "governed-by", "to": "forma.rules.destructive-styling-requires-destructive-intent"},
] as const satisfies readonly {
  from: EntityId;
  relation: Relationship;
  to: EntityId;
  note?: string;
}[];
