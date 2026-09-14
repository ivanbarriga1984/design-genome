import type { Plugin } from "vite";
import { fileURLToPath } from "node:url";
import { referenceProjection } from "./projection.ts";

export function referenceContent(): Plugin {
  const id = "virtual:forma-reference";
  const internal = "\0" + id;
  return {
    name: "forma-reference-content",
    resolveId(source) { if (source === id) return internal; },
    async load(source) {
      if (source !== internal) return;
      const data = await referenceProjection();
      for (const path of Object.keys(data.sources)) this.addWatchFile(fileURLToPath(new URL(`../../${path}`, import.meta.url)));
      return `export default ${JSON.stringify(data)};`;
    },
    handleHotUpdate({ file, server }) {
      if (/\/genome\/.*\.(md|json)$/.test(file)) {
        const module = server.moduleGraph.getModuleById(internal);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: "full-reload" });
      }
    },
  };
}
