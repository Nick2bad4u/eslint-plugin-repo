# require-azure-pipelines-trigger-include-branches

Require `trigger.branches.include` in Azure Pipelines to contain branch entries.

## Targeted pattern scope

- Root `trigger.branches.include` in `azure-pipelines.yml`.

## What this rule reports

This rule reports trigger branch include blocks that are present but empty.

## Why this rule exists

Empty include blocks can silently disable intended CI triggers or create
ambiguous trigger behavior.

## ❌ Incorrect

```yaml
trigger:
  branches:
    include:
```

## ✅ Correct

```yaml
trigger:
  branches:
    include:
      - main
```

## When not to use it

Disable this rule if push trigger branch selection is managed outside repository
YAML.

> **Rule catalog ID:** R110

## Further reading

- [Azure Pipelines trigger schema](https://learn.microsoft.com/azure/devops/pipelines/yaml-schema/trigger)
