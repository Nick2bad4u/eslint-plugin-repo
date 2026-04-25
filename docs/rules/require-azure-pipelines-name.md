# require-azure-pipelines-name

Require a top-level `name` in Azure Pipelines configuration.

## Targeted pattern scope

- Root-level `name:` in `azure-pipelines.yml`.

## What this rule reports

This rule reports pipelines without explicit identity metadata.

## Why this rule exists

Pipeline naming improves observability and reduces ambiguity in multi-pipeline
repositories and CI dashboards.

## ❌ Incorrect

```yaml
trigger:
  - main
jobs:
  - job: test
```

## ✅ Correct

```yaml
name: CI
trigger:
  - main
jobs:
  - job: test
```

## When not to use it

Disable this rule if pipeline naming is intentionally injected outside repository
configuration.

> **Rule catalog ID:** R096

## Further reading

- [Azure Pipelines YAML schema](https://learn.microsoft.com/azure/devops/pipelines/yaml-schema/)
