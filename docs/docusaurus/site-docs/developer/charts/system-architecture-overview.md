---
sidebar_position: 2
---

# System Architecture Overview

```mermaid
flowchart LR
    A[Rule Source: src/rules/**] --> B[Plugin Exports: src/plugin.ts]
    B --> C[Build & Typecheck]
    C --> D[Rule Docs: docs/rules/**]
    B --> E[TypeDoc Generation]
    E --> F[Generated API Docs: site-docs/developer/api/**]
    D --> G[Docusaurus Rules Plugin]
    F --> H[Docusaurus Site Docs Plugin]
    G --> I[Published Documentation Site]
    H --> I
```

## Reading the diagram

- Rule behavior starts in `src/rules/**` and is surfaced through plugin exports.
- Rule documentation is hand-authored under `docs/rules/**`.
- API docs are generated and then consumed by Docusaurus.
