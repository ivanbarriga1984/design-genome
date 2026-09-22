// Baseline page identity, shared by HTML delivery and client-side navigation.
export const productionOrigin = "https://design-genome.com";
export const socialImage = `${productionOrigin}/design-genome-social.png`;
export const socialImageAlt = "Design Genome. Build design systems for humans and the AI era.";
export const description = "Design systems for humans and the AI era. Explore Design Genome, an additive methodology and functioning reference architecture.";
export function publicPath(path: string) {
  const clean = path.replace(/\/index\.html$/, "").replace(/\/+$/, "") || "/";
  return clean === "/reference/forma" ? `${clean}/` : clean;
}
export function pageMetadata(path: string, title?: string) {
  const normalized = publicPath(path);
  return {
    title: title ?? (normalized === "/" ? "Design Genome — For humans and the AI era" :
      normalized === "/reference/forma/" ? "Forma component showcase" :
      `${normalized === "/build/gene" ? "Build your first Gene" : normalized === "/workshop" ? "Workshop" : normalized === "/framework" ? "Framework" : normalized === "/build" ? "Build your own" : normalized === "/reference" || normalized.startsWith("/reference/") ? "Reference" : "Page not found"} — Design Genome`),
    description,
    url: `${productionOrigin}${normalized === "/" ? "/" : normalized}`,
  };
}
export function applyPageMetadata(path: string, title?: string) {
  const meta = pageMetadata(path, title);
  document.title = meta.title;
  const setMeta = (attribute: "name" | "property", key: string, content: string) => {
    let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(attribute, key);
      document.head.append(element);
    }
    element.content = content;
  };
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.append(canonical);
  }
  canonical.href = meta.url;
  setMeta("name", "description", meta.description);
  for (const [key, value] of Object.entries({ title: meta.title, description: meta.description, url: meta.url, type: "website", site_name: "Design Genome", image: socialImage, "image:alt": socialImageAlt, "image:width": "1200", "image:height": "630", "image:type": "image/png" })) setMeta("property", `og:${key}`, value);
  for (const [key, value] of Object.entries({ card: "summary_large_image", title: meta.title, description: meta.description, image: socialImage, "image:alt": socialImageAlt })) setMeta("name", `twitter:${key}`, value);
}
