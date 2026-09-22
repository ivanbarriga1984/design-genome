import type { Plugin } from "vite";
import { fileURLToPath } from "node:url";
import { referenceProjection } from "./projection.ts";

import { workshopProjection } from "../workshop/projection.ts";

export function referenceContent(): Plugin {
  const id = "virtual:forma-reference";
  const internal = "\0" + id;
  const workshop = "virtual:forma-workshop";
  const workshopInternal = "\0" + workshop;
  return {
    name: "forma-reference-content",
    resolveId(source) { if (source === id) return internal; if (source === workshop) return workshopInternal; },
    async load(source) {
      if (source !== internal && source !== workshopInternal) return;
      const data = source === workshopInternal ? await workshopProjection() : await referenceProjection();
      for (const path of Object.keys(data.sources)) this.addWatchFile(fileURLToPath(new URL(`../../${path}`, import.meta.url)));
      return `export default ${JSON.stringify(data)};`;
    },
    handleHotUpdate({ file, server }) {
      if (/\/genome\/.*\.(md|json|ts)$/.test(file)) {
        for (const key of [internal, workshopInternal]) {
          const module = server.moduleGraph.getModuleById(key);
          if (module) server.moduleGraph.invalidateModule(module);
        }
        server.ws.send({ type: "full-reload" });
      }
    },
  };
}
