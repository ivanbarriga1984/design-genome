import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { generateTokens } from "./scripts/generate-tokens.ts";
import { tokenFile } from "./scripts/tokens.ts";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        site: fileURLToPath(new URL("./index.html", import.meta.url)),
        forma: fileURLToPath(new URL("./reference/forma/index.html", import.meta.url)),
      },
    },
  },
  plugins: [
    {
      name: "forma-genome-tokens",
      async buildStart() { await generateTokens(); },
      configureServer(server) {
        server.watcher.add(fileURLToPath(tokenFile));
      },
      async handleHotUpdate({ file, server }) {
        if (file === fileURLToPath(tokenFile)) {
          await generateTokens();
          server.ws.send({ type: "full-reload" });
          return [];
        }
      },
    },
    react(),
  ],
  server: { host: "127.0.0.1" },
});
