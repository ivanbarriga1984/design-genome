# Disposable Forma experiment export

This harness prepares the comparison; it never starts either implementation condition. The experiment asks whether explicitly supplied Design Genome intelligence helps beyond ordinary implementation context already present in the codebase. It does not attempt to hide ordinary executable component behavior or token values from the baseline.

The only source revision is `512bf92d2639cd9467e8946baef14c3ebf25998b` — **Add first Codex Genome consumer**. The harness uses `git archive` of that commit, not the current working tree or ignored generated files. Production implementation, authority and consumer code remain unchanged.

## Export and verify

Run these commands from the canonical repository as the experiment coordinator, **outside either implementation task**:

```sh
npm run experiment -- export /private/tmp/design-genome-experiment-512bf92d-v1
npm run experiment -- verify /private/tmp/design-genome-experiment-512bf92d-v1
```

Use a new absolute directory for a new export. Existing exports are never overwritten. `/private/tmp` is writable in the current project environment but temporary; copy the complete coordinator archive to durable storage before it is cleaned. If another host requires an in-repository staging path, ignore that path locally before exporting and then copy each fixture outside the canonical checkout. Never open the canonical checkout or the entire export root as an experimental project.

The private temporary archive is removed after export, including on failure. It generates tokens and the approved Codex packet using the **pinned** scripts. It is never an implementation environment. Export requires Git, tar, Node.js 22.18+ and npm; it adds no dependency.

```text
export-root/
  baseline/                    # open ONLY this directory for A
  genome-informed/             # open ONLY this directory for B
  coordinator/
    initial/                   # starting fixture, with empty context; never task-visible
    approved-context.md        # exact pinned consumer output; never A-visible
    manifest.json              # hashes and experiment metadata; never task-visible
    npm-cache/                 # populated during dependency preparation
    validation/                # actual preparation logs; not experiment results
  results/
    baseline/                  # initially empty
    genome-informed/           # initially empty
```

Each fixture contains exactly these source files:

```text
.editorconfig
.gitignore
README.md
TASK.md
SUPPLIED_CONTEXT.md
index.html
package.json
package-lock.json
tsconfig.json
vite.config.ts
generated/forma-tokens.css
src/main.tsx
src/Showcase.tsx
src/styles.css
src/tabler-icons.LICENSE
src/components/Button.tsx
src/components/Input.tsx
src/components/Card.tsx
src/components/Stack.tsx
src/components/components.css
src/components/contract.ts
src/components/runtime-contracts.ts
tests/components.test.tsx
```

After dependency preparation and verification, each additionally has its own `node_modules/` and initial `dist/`. These are real local installations/builds, not links to canonical files or the other condition. The fixtures contain no Git metadata, authored Genome, compiled Genome JSON, methodology/consumer/evaluation documentation, compiler, adapter, or query tooling.

## Runtime decoupling

The pinned component objects are projected to exactly `id`, `api`, `variants` and `tokenRoles`. Those fields support runtime validation, errors, prop types, showcase enumeration and styles. The generated `src/components/runtime-contracts.ts` preserves values and literal TypeScript types. It contains no `semantics`, accessibility prose, governance, relationships, rule records, ownership, pattern guidance or exceptions.

Only the import in exported `src/components/contract.ts` changes. Component files, showcase, styles and component tests remain byte-identical to the pinned implementation. The token CSS is pre-generated privately and copied unchanged. Its provenance comment is not an instruction to regenerate it inside the fixture. Exported Vite no longer invokes token tooling; exported TypeScript/tests target only local implementation files. Vite serves only the fixture directory, and production source maps are disabled.

The package name is operationally renamed to `forma-implementation-fixture` in the manifest and lockfile root. All dependency specifications, package resolutions and integrity values remain unchanged. Scripts contain only development, build, typecheck and component-test commands. Both conditions get the same changes. Frozen runtime files are experiment artifacts, not maintained design authority.

## The one context difference

Both `TASK.md` files are identical. Their first line is exactly:

> Add a destructive action allowing a user to delete a project.

The remaining text states only shared operational constraints and this exact instruction:

> If SUPPLIED_CONTEXT.md contains additional supplied context, read it before implementing the task.

No component choices, design instructions or evaluation criteria are added to the shared task. A's context file is zero bytes. B's file is the exact output bytes of the approved pinned consumer; it is not edited, summarized or enhanced. The fixture filename/layout is identical. The exporter verifies that **only `SUPPLIED_CONTEXT.md` differs**.

## Dependency and workflow validation

The initial install may require registry access by the coordinator. Seed the export-local cache from the pinned fixture lockfile, before either condition:

```sh
npm --prefix /private/tmp/design-genome-experiment-512bf92d-v1/baseline ci --cache /private/tmp/design-genome-experiment-512bf92d-v1/coordinator/npm-cache --no-audit --no-fund
npm run experiment -- validate /private/tmp/design-genome-experiment-512bf92d-v1
```

`validate` performs clean **offline** installations for both conditions, typechecks, runs the eight existing component/showcase tests, and builds. It compares installed dependency bytes and production build hashes. It checks dependency symlinks stay within the fixture, verifies no production source maps or excluded knowledge markers, and probes the Vite server. Requests for canonical sources and the other condition must return 403; transpiled bridge/runtime modules must not expose authored contract prose. Excluded artifact URLs must not return Genome data. Both temporary dev servers are stopped.

Validation is a preparation check, not either experimental implementation. Actual logs go under `coordinator/validation/`. Failed checks abort; logs are not fabricated. Offline install fails clearly if the cache needs preparation. Static inventories reject unexpected files, source symlinks and any difference beyond the context file. `verify` is for the untouched initial fixtures and intentionally fails after implementation edits.

## Manifest and reproducibility

`coordinator/manifest.json` records the pinned commit, harness hash, reproducible run ID, common fixture hash, complete source-file hashes, shared task hash, both context hashes, pinned compiled-Genome hash, CSS/runtime hashes, original/exported lock hashes and export Node/npm versions. `modelSettings` remains **null** for Ivan to fill before execution; the intended Astra family is noted without inventing an exact model, effort or other settings.

Hashes use SHA-256. The common fixture hash is the hash of a sorted JSON file-path-to-content-hash map excluding `SUPPLIED_CONTEXT.md`; filesystem timestamps are excluded. The run ID combines source, common fixture and B context fingerprints. Source-file structure is identical between conditions; installed dependencies/build outputs are verified separately. Validation logs contain ordinary run-specific timings and remain coordinator-only.

## Required access boundary before manual execution

**Two directories and two Codex projects are not an OS security boundary.** The exporter isolates contents, imports and development-server file serving. It does not change Codex's filesystem permissions, installed tools, global instructions, thread access, network access or browser permissions.

For a strict uncontaminated run, expose only the selected fixture to the implementation agent. Use a separately restricted environment/account/VM or a verified sandbox configuration that denies reads outside that fixture except necessary system/runtime files. Do not mount the export parent, coordinator material, other condition, canonical checkout, Git history or this conversation. Disable cross-task/history tools and unrelated network/connectors for both conditions. Local preview access is the shared operational exception to the no-networking product requirement.

On this host, no container runtime was found and nested macOS `sandbox-exec` could not be applied inside the current tool sandbox. No automatic agent-level isolation is claimed. If the chosen Codex project can still read parent/sibling/canonical paths, **do not run the strict comparison yet**; move the selected fixture to an environment with enforceable access restrictions. A fresh project pointed at one folder is necessary, but not sufficient. The coordinator should inspect permissions/inherited instructions and verify denial of forbidden paths before giving the implementation brief. Do not ask A to explore forbidden material as a test.

## Ivan's manual run procedure — after approval

1. Generate/verify the two fixtures and run preparation validation outside Codex implementation sessions. Save the manifest and validation logs. Fill in the same exact Astra model, reasoning effort, tool access, time/output budget and shared operational settings for both runs. Record inherited/global instructions; exclude prior Design Genome knowledge and evaluation criteria.
2. Arrange the enforced access boundary described above. Copy/mount **only** `baseline/` as A's project; preserve all its bytes. Do not expose the export-root folder. Create a fresh Codex project and a brand-new conversation, not a fork of this task. Keep unrelated files and previous previews closed.
3. Supply exactly the full `TASK.md` contents. Its brief and operational constraints are the same for both conditions. Do not give extra coaching or mention what A lacks. Do not run either condition from the coordinator task.
4. After A stops, preserve its implementation and evidence outside the implementation environment. Close/stop its preview and session. Do not share its result with B.
5. Independently expose only `genome-informed/` as B's project in a separate fresh restricted environment/project/conversation. Use the **same Astra model and effort/settings** and the exact same `TASK.md` contents. Do not add a special compliance reminder; B's only context difference is its existing supplied file.
6. Preserve B identically. If clarification is needed, record it; give materially equivalent clarification to both or explicitly mark the comparison's changed conditions. Record any excluded file/context exposure as contamination.
7. Review side by side from the coordinator environment, using the previously approved qualitative protocol. No numeric scoring or causal/general improvement claim is added. Never merge either result automatically.

## Preserve results

After the respective run, execute as coordinator:

```sh
npm run experiment -- preserve /private/tmp/design-genome-experiment-512bf92d-v1 baseline
npm run experiment -- preserve /private/tmp/design-genome-experiment-512bf92d-v1 genome-informed
```

Each command copies final source files (including new files), excluding `node_modules/` and `dist/`, into `results/<condition>/implementation/`. It writes a binary-capable `git diff --no-index` against that condition's initial fixture and a final file-hash inventory. No Git repository or commit is created. Existing preserved results are never overwritten. The initial B context is accounted for, so its expected presence is not mistaken for an implementation change.

At preservation time, empty `transcript/`, `tool-logs/`, `checks/` and `screenshots/` directories are prepared for actual evidence that Ivan supplies. Copy real transcripts, tool logs, subsequent check output and screenshots there; no missing evidence should be fabricated. The initial `results/` condition directories stay empty until a real run is preserved. Synthetic edits used in unit tests exist only in temporary test folders and are deleted.

If implementation happens in a separately mounted/copied fixture, return the complete resulting source tree to its corresponding condition directory before preservation. Preserve a backup before replacing that directory. Review materials and other-condition outputs must never be copied into a running implementation project.

## Remaining methodological limits

Existing implementation APIs, validation behavior, CSS and tests already embody inherited decisions; that is legitimate common baseline information. Frozen executable contract fields are also common context, not the extra treatment. The experiment measures the added explicit packet, including its instructions and extra information, rather than isolated causal effects of a single principle. The brief intentionally leaves product details unspecified. Differences in clarification, tools, settings, prior history or access can invalidate the comparison. One paired qualitative run cannot demonstrate general model improvement or universal compliance.
