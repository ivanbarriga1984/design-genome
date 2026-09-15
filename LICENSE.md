# Design Genome licensing

Copyright © 2026 Ivan Barriga.

**The knowledge is CC BY 4.0. The software that operates on or implements that knowledge is MIT.** These licenses apply by role, not file extension. They are not an offer to choose either license for the same material.

## Authored knowledge and content — CC BY 4.0

Original Design Genome / Forma knowledge and content is licensed under the [Creative Commons Attribution 4.0 International license](LICENSES/CC-BY-4.0.txt).

This includes:

- All of `genome/`: principles, guidance, tokens, component contracts as authored design knowledge, registry entities and relationships, rules, governance records and exceptions, patterns, and content guidance. This includes the JSON and TypeScript knowledge artifacts in that directory.
- `docs/`, the root README, and explanatory Markdown documentation throughout the repository, including the READMEs in `site/`, `generated/`, `adapters/`, and `experiments/`.
- Original authored explanatory content and original diagrams/documentation artwork presented by the public site or Forma showcase, including content embedded in TSX, HTML, or other software files. The software rendering or interacting with that content is separately MIT-licensed.
- Original public artwork, including `public/favicon.svg` and `public/design-genome-social.png`.

Attribution information: **Design Genome — Ivan Barriga**, https://design-genome.com, source repository https://github.com/ivanbarriga1984/design-genome, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). When sharing adaptations, indicate changes as required by the license. For example: “Adapted from Design Genome by Ivan Barriga, licensed under CC BY 4.0. Changes: [describe changes].” This example is not a mandatory attribution format or an additional restriction.

## Software implementation and tooling — MIT

Original software is licensed under the [MIT License](LICENSES/MIT.txt). This includes:

- Public-site React implementation and styles in `site/`, and the HTML application entry points.
- Forma React component implementations, showcase behavior, and styles in `src/`.
- Compiler, resolver, transformation and validation code in `scripts/`.
- Adapter and consumer tooling in `adapters/`, and experiment tooling in `experiments/`.
- Tests in `tests/` and build/configuration code, including `vite.config.ts`, `tsconfig.json`, package configuration, `.editorconfig`, and `.gitignore`.

The content/documentation and third-party exclusions on this page still apply within these paths. For example, a React renderer is MIT software; the authored guidance it renders is CC BY 4.0. A TypeScript record in `genome/` remains CC BY 4.0 knowledge even when software imports it.

## Derived and bundled material

Generation and bundling do not change these boundaries. Compiled Genome JSON, resolved context, generated token values, and reproduced guidance retain the CC BY 4.0 license of the authored knowledge. Software bundled alongside that material remains MIT; third-party code and assets retain their own licenses.

## Third-party material

Third-party material is excluded from the grants above and retains its existing license and notices. In particular, preserve [`src/tabler-icons.LICENSE`](src/tabler-icons.LICENSE) for Tabler icons. Manrope, Inter, and other dependencies retain the licenses and notices supplied with their packages. No third-party material is relicensed by this project.

The standard license texts govern; this notice identifies their scope without adding restrictions.
