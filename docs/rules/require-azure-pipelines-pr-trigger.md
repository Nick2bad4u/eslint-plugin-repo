# require-azure-pipelines-pr-trigger

Require an explicit Azure Pipelines `pr:` trigger.

## Targeted pattern scope

- Top-level `pr:` configuration in `azure-pipelines.yml`.
- Pipelines that omit `pr:` entirely or explicitly set `pr: none`.

## What this rule reports

This rule reports Azure Pipelines configs that do not enable pull-request
validation.

## Why this rule exists

Repositories often remember push validation but forget pull-request validation.
That leaves review branches untested until after merge, which is exactly when
feedback becomes more expensive.

## ❌ Incorrect

```yaml
trigger:
  - main
```

```yaml
trigger:
  - main
pr: none
```

## ✅ Correct

```yaml
trigger:
  - main
pr:
  branches:
    include:
      - main
```

## When not to use it

Disable this rule if the repository intentionally does not validate pull requests in Azure Pipelines.

> **Rule catalog ID:** R065

## Further reading

- [Azure Pipelines: Configure CI triggers](https://learn.microsoft.com/azure/devops/pipelines/build/triggers)
