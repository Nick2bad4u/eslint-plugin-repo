# require-azure-pipelines-execution-plan

Require a top-level execution plan in Azure Pipelines config.

## Targeted pattern scope

- Root `jobs:`, `stages:`, or `steps:` keys in `azure-pipelines.yml`.

## What this rule reports

This rule reports Azure Pipelines configs that do not explicitly declare what
workload the pipeline executes.

## Why this rule exists

A pipeline config without a declared execution plan is ambiguous and often
accidental drift from expected CI behavior.

## ❌ Incorrect

```yaml
trigger:
  - main
```

## ✅ Correct

```yaml
jobs:
  - job: test
    steps:
      - script: npm test
```

## When not to use it

Disable this rule if execution plan definitions are intentionally injected at
runtime from external templates.

> **Rule catalog ID:** R089

## Further reading

- [Azure Pipelines YAML schema](https://learn.microsoft.com/azure/devops/pipelines/yaml-schema/)
