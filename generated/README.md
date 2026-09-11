# Generated artifacts

`forma-tokens.css` is derived from the authored [foundation tokens](../genome/foundations/tokens.json). It is ignored by Git and carries a generated-file warning. Never edit it as authority.

Run `npm run tokens` to reproduce it. Vite generates it before development startup and production builds, and regenerates it when the token source changes during development. Vite restarts when imported contract/configuration sources change. Invalid tokens or failing source-integrity checks abort generation and remove previous CSS; development reports the error rather than silently publishing a new artifact from invalid input.

The [transformer](../scripts/tokens.ts) handles only the DTCG subset used by Forma. It resolves aliases, emits consumer-facing variables, and keeps internal references out of the CSS API. Typography emits a CSS font shorthand plus a separate letter-spacing property; apply both. No timestamps are included, so identical sources produce identical output.

Source-integrity checks are not UI rule enforcement or proof of accessible behavior. A browser may still display its last successful render while a development error is being fixed.

## Compiled Genome JSON

`forma-genome.json` is the ignored, generated machine-consumable snapshot. Run `npm run genome:generate`, then `npm run genome:check` to verify freshness. `npm run genome:query -- forma.patterns.destructive-action` demonstrates deterministic graph context resolution from that JSON alone. Source authority and human guidance remain upstream; this artifact does not become a new source of truth. See [compiler architecture and limitations](../docs/compiled-genome.md).
