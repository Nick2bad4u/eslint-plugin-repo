# require-azure-pipelines-trigger-branches

Require explicit branch filters for Azure Pipelines push triggers.

## Targeted pattern scope

- `trigger:` in `azure-pipelines.yml`.
- Missing `trigger.branches` nested filter.

## What this rule reports

This rule reports trigger configurations that do not explicitly scope push
branches.

## Why this rule exists

Branch-scoped push triggers prevent accidental CI overreach or undercoverage when
trigger config drifts.

## ❌ Incorrect

```yaml
trigger:
  batch: true
```

## ✅ Correct

```yaml
trigger:
  branches:
    include:
      - main
```

## When not to use it

Disable this rule if branch-scoping is intentionally handled outside repository
YAML.

> **Rule catalog ID:** R103

## Further reading

- [Azure Pipelines trigger schema](https://learn.microsoft.com/azure/devops/pipelines/yaml-schema/trigger)
