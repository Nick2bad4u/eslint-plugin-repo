---
sidebar_position: 3
---

# Docs and API Pipeline

```mermaid
sequenceDiagram
    participant Dev as Maintainer
    participant Src as Source Code
    participant TD as TypeDoc
    participant Doc as Docusaurus
    participant CI as CI

    Dev->>Src: Update rule or API surface
    Dev->>TD: Run docs:api
    TD-->>Doc: Generate developer/api docs
    Dev->>Doc: Update hand-authored docs/sidebar when needed
    Dev->>CI: Open PR
    CI->>TD: Regenerate API docs
    CI->>Doc: Build docs site
    CI-->>Dev: Publish/validate output
```

## Operational guidance

- If Docusaurus navigation breaks for API pages, regenerate TypeDoc output first.
- Keep hand-authored docs separate from generated folders to avoid churn.
