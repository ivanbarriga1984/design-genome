import type { Exception } from "./model.ts";

/** Illustrative draft only: this is not approval of a live deviation. */
export const exceptions = [
  {
    id: "forma.governance.legacy-form-label-exception",
    ruleId: "forma.rules.explicit-action-labels",
    status: "draft",
    owner: "Design + Engineering",
    reason: "In this fictional third-party integration, the provider controls the embedded approval-request workflow and requires its final action to retain Submit for terminology consistency with the provider-hosted workflow. Forma cannot independently relabel that action.",
    scope: "Only the final Submit action inside the fictional third-party embedded approval-request workflow in Forma. Forma-owned actions, surrounding guidance, and all other workflows remain outside this exception.",
    review: "Review when the external integration changes or is replaced, including changes to provider terminology or label-customization support. Reassess whether the constraint still applies and retire the exception when it no longer does. This draft grants no live approval.",
  },
] as const satisfies readonly Exception[];
