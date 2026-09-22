# DDX presentation

This is the locked 22-scene workshop, not a general slide framework. Authored presentation copy and original diagrams follow the repository's CC BY 4.0 content boundary; the implementation is MIT. Canonical Genome sources and consumer adapters are unchanged.

## Present locally

```sh
npm ci
npm run build
npx vite preview --host 127.0.0.1 --port 4180
```

Open `http://127.0.0.1:4180/present/01`. Keep the local server running. No Internet connection is needed for the deck or the local activities once dependencies are installed and the build exists. Fonts, diagrams, QR matrices and presentation state are local. This is not a service-worker installation or a `file://` application; the attendee QR destinations are public URLs and require attendees to reach that site.

The existing metadata plugin emits `/present/index.html` and `/present/01/index.html` through `/present/22/index.html`. The normal production hosting directory-index rules apply. No link is added to the global navigation.

## Controls and recovery

- Right arrow / Space: next beat, then next scene.
- Left arrow: previous beat, then the previous scene's final beat.
- Shift + Right / Left: jump one scene, starting at its first beat.
- O: overview. Select any of the 22 scenes.
- C: framing calibration.
- F: request native browser fullscreen. Support depends on the browser.
- ?: keyboard help.
- Escape: close a utility; native fullscreen exit remains browser-controlled.

Focused links/buttons retain their normal Space/Enter activation. Keyboard repeats and modified browser shortcuts are ignored. Utilities use native modal dialogs with focus restoration. Revealed content remains available with reduced motion; unrevealed content is hidden and inert.

URLs encode scene and beat, for example `/present/09?beat=2`. Refresh and browser Back/Forward recover this position. Invalid positions clamp to the scene's valid bounds. A new scene URL is a recovery point; there is no separate localStorage state to become stale.

## Stage and content

`model.ts` owns the scene index, beat limits, URL navigation, scale calculation and allowed activity return destinations. `Scenes.tsx` contains the approved narrative, small scene families and local SVG/HTML diagrams. `Presentation.tsx` owns controls, resize observation and utilities. `entry.tsx` loads scoped styles and the actual Forma Button's existing styles/tokens.

The 1600 × 900 logical stage scales by `min(viewport width / 1600, viewport height / 900)`. Composition never reflows. The 6% horizontal / 7% vertical safe boundary is visible in calibration. Content is composed within that boundary, with separate space for quiet controls. Non-16:9 displays are letterboxed or pillarboxed. A narrow browser is useful for recovery, not a substitute for a legible conference display.

Scene 05 uses the real destructive Forma Button as a visual specimen, not a deletion workflow. Scene 16 links to existing Machine Context and the separate executable showcase; it does not generate or claim a new implementation. Codex is identified as the real adapter. Claude Code and Figma remain conceptual examples. Graph illustrations do not prescribe topology.

## Activity handoffs

Scene 11 uses `/workshop?presentReturn=12`; Scene 17 uses `/build/gene?presentReturn=18`. The normal site shell renders a temporary, dismissible presenter-return strip only for the explicitly allowed path/query combinations. It survives refresh and returns to the next scene. No controls are added inside either activity and ordinary attendee URLs have none. Machine Context supports the same optional return to Scene 17. The executable Forma showcase opens in another tab and leaves the deck available.

## QR assets

The three high-contrast QR matrices are bundled in `qr.json` with four-module quiet zones and medium error correction. Readable URLs are shown alongside them. The small MIT-licensed `qrcode-generator` development dependency is used only for regeneration and tests; it is not bundled as a runtime library.

```sh
node site/present/generate-qr.mjs
```

Tests reproduce every matrix from its exact destination. Always check scan distance and contrast with the actual projector before attendees arrive.

## Validation and rehearsal

Run `npm test`, `npm run build`, `npm run check`, `npm run genome:check`, and `git diff --check`. Presentation tests cover all scene/beat positions, backward/forward bounds, rendering, hidden beat semantics, overview/help/calibration, fullscreen fallback, return-route allowlisting and QR matrices.

Before the room opens: use C, check every corner and the safe rectangle, test F in the actual browser, scan all three QR codes, and rehearse both activity return paths. Browser automation cannot establish projector brightness, room scan range, or actual 60-minute facilitation pacing. The presentation preserves the approved act order; it has no automatic timer or advancing schedule.
