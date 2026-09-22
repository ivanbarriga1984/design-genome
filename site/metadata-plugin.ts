import type { Plugin, HtmlTagDescriptor } from "vite";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { referenceProjection } from "./reference/projection.ts";
import { description, pageMetadata, publicPath, socialImage, socialImageAlt } from "./metadata.ts";

function tags(path: string, title?: string): HtmlTagDescriptor[] {
  const meta = pageMetadata(path, title);
  return [
    { tag: "link", attrs: { rel: "canonical", href: meta.url }, injectTo: "head" },
    ...Object.entries({ title: meta.title, description, url: meta.url, type: "website", site_name: "Design Genome", image: socialImage, "image:alt": socialImageAlt, "image:width": "1200", "image:height": "630", "image:type": "image/png" }).map(([key, content]) => ({ tag: "meta", attrs: { property: `og:${key}`, content }, injectTo: "head" as const })),
    ...Object.entries({ card: "summary_large_image", title: meta.title, description, image: socialImage, "image:alt": socialImageAlt }).map(([key, content]) => ({ tag: "meta", attrs: { name: `twitter:${key}`, content }, injectTo: "head" as const })),
  ];
}
const escape = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
export function metadataHtml(html: string, path: string, title?: string) {
  const meta = pageMetadata(path, title);
  const clean = html.replace(/<link\b[^>]*rel="canonical"[^>]*>\s*/g, "")
    .replace(/<meta\b[^>]*(?:property="og:[^"]+"|name="twitter:[^"]+"|name="description")[^>]*>\s*/g, "")
    .replace(/<title>.*?<\/title>/s, `<title>${escape(meta.title)}</title>`);
  const rendered = tags(path, title).map(({ tag, attrs }) => `<${tag} ${Object.entries(attrs!).map(([key, value]) => `${key}="${escape(String(value))}"`).join(" ")}>`).join("\n    ");
  return clean.replace("</head>", `    <meta name="description" content="${escape(description)}">\n    ${rendered}\n  </head>`);
}
export function publicMetadata(): Plugin {
  let output = "";
  let building = false;
  // Redirect the bare URL before the public SPA can receive it. The production
  // host should apply the same redirect; Site also handles SPA fallback hosts.
  const redirect: (req: import("node:http").IncomingMessage, res: import("node:http").ServerResponse, next: () => void) => void = (req, res, next) => {
    const url = new URL(req.url ?? "/", "http://local.invalid");
    if (url.pathname === "/reference/forma") {
      res.writeHead(308, { Location: `/reference/forma/${url.search}` }); res.end();
    } else next();
  };
  return {
    name: "design-genome-public-metadata",
    configResolved(config) { output = resolve(config.root, config.build.outDir); building = config.command === "build"; },
    configureServer(server) { server.middlewares.use(redirect); },
    configurePreviewServer(server) {
      server.middlewares.use(redirect);
      // Match the static host's directory-index resolution for extensionless URLs.
      server.middlewares.use(async (req, _res, next) => {
        const url = new URL(req.url ?? "/", "http://local.invalid");
        const file = resolve(output, `.${url.pathname}`, "index.html");
        if (file.startsWith(`${output}/`)) {
          try {
            if ((await stat(file)).isFile()) req.url = `${url.pathname.replace(/\/$/, "")}/index.html${url.search}`;
          } catch { /* Non-page assets and unknown paths use the normal handler. */ }
        }
        next();
      });
    },
    transformIndexHtml: {
      order: "post",
      handler(html, context) {
        const path = new URL(context.originalUrl ?? context.path, "http://local.invalid").pathname;
        return metadataHtml(html, path);
      },
    },
    async closeBundle() {
      if (!building) return;
      const data = await referenceProjection();
      const pages = new Map<string, string | undefined>([["/present", undefined], ["/build/gene", undefined], ["/workshop", undefined], ["/framework", undefined], ["/build", undefined], ["/reference", "Overview — Forma Reference — Design Genome"], ["/reference/machine-context", "Machine context — Forma Reference — Design Genome"]]);
      for (let scene = 1; scene <= 22; scene++) pages.set(`/present/${String(scene).padStart(2, "0")}`, undefined);
      for (const entity of data.entities) {
        pages.set(`/reference/${entity.domain}`, `${entity.domain[0].toUpperCase()}${entity.domain.slice(1)} — Forma Reference — Design Genome`);
        pages.set(`/reference/${entity.domain}/${entity.slug}`, `${entity.title} — Forma Reference — Design Genome`);
      }
      const shell = await readFile(resolve(output, "index.html"), "utf8");
      for (const [path, title] of pages) {
        const file = resolve(output, `.${publicPath(path)}/index.html`);
        await mkdir(dirname(file), { recursive: true });
        await writeFile(file, metadataHtml(shell, path, title));
      }
    },
  };
}
