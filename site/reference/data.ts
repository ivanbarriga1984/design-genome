import data from "virtual:forma-reference";
export { data };
export type ReferenceEntity = (typeof data.entities)[number];
export const domains = [
  { slug: "principles", name: "Principles", description: "The reasoning behind design decisions." },
  { slug: "foundations", name: "Foundations", description: "Semantic roles and the values they carry." },
  { slug: "components", name: "Components", description: "Four working primitives, with governed contracts." },
  { slug: "patterns", name: "Patterns", description: "Guidance for coordinated decisions and workflows." },
  { slug: "content", name: "Content", description: "Voice and action labels for a clear next step." },
  { slug: "rules", name: "Rules", description: "Explicit constraints, recommendations, and review boundaries." },
  { slug: "governance", name: "Governance", description: "Ownership, status, authority, and scoped exceptions." },
];
export const github = "https://github.com/ivanbarriga1984/design-genome/blob/main/";
export const entityPath = (e: ReferenceEntity) => `/reference/${e.domain}/${e.slug}`;
export const entityById = (id: string) => data.entities.find(e => e.id === id)!;
export const tokenVariable = (path: string) => `--forma-${path.replaceAll(".", "-")}`;
export const tokenValue = (path: string) => data.cssValues[tokenVariable(path)];
export const tokenPath = (path: string) => ["border", "focus"].includes(path.split(".")[0]) ? "/reference/foundations#geometry" : `/reference/foundations/${path.split(".")[0]}#${path.replaceAll(".", "-")}`;
export function sourceLink(reference: string, base = "genome/") {
  return new URL(base + reference, github).href;
}
// Resolve only explicitly authored locations; ordinary source links remain source links.
export function guidanceLink(href: string, source: string) {
  if (/^https?:/.test(href)) return href;
  const url = new URL(href, github + source);
  const relative = url.href.slice(github.length);
  for (const entity of data.entities) {
    if (entity.guidanceRef && new URL("genome/" + entity.guidanceRef, github).href === url.href) return entityPath(entity);
  }
  const domain = domains.find(d => relative === `genome/${d.slug}/README.md`);
  if (domain) return `/reference/${domain.slug}`;
  if (relative === "genome/foundations/README.md#border-and-focus-geometry") return "/reference/foundations#geometry";
  return url.href;
}
