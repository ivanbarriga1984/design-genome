export type RuleLevel = "MUST" | "SHOULD" | "MUST NOT";
export type ValidationMode =
  | "automated-where-applicable"
  | "automated-where-practical"
  | "partially-automated-architectural"
  | "human-review"
  | "human-review-guidance"
  | "automated-where-implementation-permits";

export interface Rule {
  id: string;
  level: RuleLevel;
  guidance: string;
  validation: { mode: ValidationMode; checker: null };
}

/** Guidance paths are relative to genome/. No checker is implemented. */
export const rules = [
  {
    "id": "forma.rules.semantic-colors-only",
    "level": "MUST",
    "guidance": "rules/README.md#semantic-colors-only",
    "validation": {
      "mode": "automated-where-applicable",
      "checker": null
    }
  },
  {
    "id": "forma.rules.spacing-tokens-only",
    "level": "MUST",
    "guidance": "rules/README.md#spacing-tokens-only",
    "validation": {
      "mode": "automated-where-practical",
      "checker": null
    }
  },
  {
    "id": "forma.rules.reuse-governed-components",
    "level": "MUST",
    "guidance": "rules/README.md#reuse-governed-components",
    "validation": {
      "mode": "partially-automated-architectural",
      "checker": null
    }
  },
  {
    "id": "forma.rules.destructive-styling-requires-destructive-intent",
    "level": "MUST",
    "guidance": "rules/README.md#destructive-styling-requires-destructive-intent",
    "validation": {
      "mode": "human-review",
      "checker": null
    }
  },
  {
    "id": "forma.rules.explicit-action-labels",
    "level": "SHOULD",
    "guidance": "rules/README.md#explicit-action-labels",
    "validation": {
      "mode": "human-review-guidance",
      "checker": null
    }
  },
  {
    "id": "forma.rules.one-primary-action-per-decision-context",
    "level": "SHOULD",
    "guidance": "rules/README.md#one-primary-action-per-decision-context",
    "validation": {
      "mode": "human-review",
      "checker": null
    }
  },
  {
    "id": "forma.rules.advanced-complexity-should-be-progressive",
    "level": "SHOULD",
    "guidance": "rules/README.md#advanced-complexity-should-be-progressive",
    "validation": {
      "mode": "human-review",
      "checker": null
    }
  },
  {
    "id": "forma.rules.unsupported-component-variants",
    "level": "MUST NOT",
    "guidance": "rules/README.md#unsupported-component-variants",
    "validation": {
      "mode": "automated-where-implementation-permits",
      "checker": null
    }
  }
] as const satisfies readonly Rule[];
