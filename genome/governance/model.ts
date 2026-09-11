/** Reference-specific metadata, not a universal Design Genome schema. */
export type Status = "draft" | "active" | "deprecated";
export type Owner = "Design" | "Design + Engineering";
export type Relationship = "informs" | "uses" | "governed-by" | "related-to";

export interface Entity {
  id: string;
  status: Status;
  owner: Owner;
  authority: {
    guidance?: string;
    contract?: string;
    metadata?: string;
    implementation?: string;
  };
}

export interface Exception {
  id: string;
  ruleId: string;
  status: Status;
  owner: Owner;
  reason: string;
  scope: string;
  review: string;
  expiresOn?: string;
}

export const genome = {
  id: "forma.governance.genome",
  name: "Forma",
  version: "0.1.0",
  status: "draft",
  owner: "Design + Engineering",
} as const;
