# require-azure-pipelines-trigger

Require an explicit Azure Pipelines `trigger:` configuration.

## Targeted pattern scope

- Top-level `trigger:` in `azure-pipelines.yml`.
- Pipelines that omit `trigger:` entirely.
- Pipelines that explicitly set `trigger: none`.

## What this rule reports

This rule reports Azure Pipelines configs that do not enable push-triggered CI.

## Why this rule exists

A repository can accidentally disable push validation while keeping other
pipeline settings intact. Requiring an explicit non-`none` `trigger:` keeps CI
coverage visible in code review and prevents silent trigger drift.

## ❌ Incorrect

```yaml
pr:
  branches:
    include:
      - main
```

```yaml
trigger: none
pr:
  - main
```

## ✅ Correct

```yaml
trigger:
  branches:
    include:
      - main
pr:
  branches:
    include:
      - main
```

## When not to use it

Disable this rule if the repository intentionally avoids push-triggered Azure
Pipelines runs.

> **Rule catalog ID:** R075

## Further reading

- [Azure Pipelines trigger reference](https://learn.microsoft.com/azure/devops/pipelines/yaml-schema/trigger)
