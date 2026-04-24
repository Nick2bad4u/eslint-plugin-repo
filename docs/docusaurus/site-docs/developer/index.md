---
sidebar_position: 1
---

# Developer Guide

This section documents how `eslint-plugin-repo` is structured, how the docs and rule catalogs are maintained, and how to make changes without breaking the docs pipeline.

\:::info Maintainer mindset

Treat the docs site as a real application surface, not a folder of loose markdown files. TypeDoc output, inspectors, blog posts, generated sidebars, and hand-authored guides all meet here.

\:::

## What this section covers

- Architecture and maintenance notes for docs, rules, and presets.
- API documentation workflow for generated TypeDoc pages.
- Architecture Decision Records (ADRs) for long-lived technical decisions.
- Diagrams that explain rule lifecycle and docs synchronization flows.

## Quick workflow for maintainers

1. Make your source changes (`src/**`, `docs/rules/**`, or docs app files).
2. Run validation from repository root:
   - `npm run docs:typecheck`
   - `npm run docs:api`
   - `npm run docs:build`
3. Verify internal links and navigation routes still resolve.
4. If you changed rule metadata, run the sync scripts that update derived docs tables.

## High-signal maintainer routes

| If you need to...                         | Start here                                |
| ----------------------------------------- | ----------------------------------------- |
| Understand the docs architecture          | [Charts](./charts/index.md)               |
| Change TypeDoc or generated API behavior  | [API guide](./api/index.md)               |
| Review long-lived design choices          | [ADRs](./adr/index.md)                    |
| Understand path aliases and typed imports | [Typed paths inventory](./typed-paths.md) |

## Practical workflow

### Change rule docs or presets

- Update the source docs or metadata.
- Run the sync steps that derive navigation or preset matrices.
- Rebuild docs so the rules section and generated indexes stay honest.

### Change the docs app itself

- Update `docs/docusaurus/**` thoughtfully.
- Re-run `npm run docs:typecheck` and `npm run docs:build` from repository root.
- Verify sidebars, social metadata, and generated asset paths still resolve.

### Change public plugin exports

- Update source and exported types first.
- Re-run `npm run docs:api` so generated API docs reflect reality.
- Check navigation pages that link to generated API ids.

## Key navigation

- [Pages SEO & IndexNow](./deploy-pages-seo-and-indexnow.md)
- [API guide](./api/index.md)
- [Typed paths inventory](./typed-paths.md)
- [ADRs](./adr/index.md)
- [Architecture charts](./charts/index.md)
