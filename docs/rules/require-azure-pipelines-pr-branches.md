# require-azure-pipelines-pr-branches

Require explicit pull-request branch filters in Azure Pipelines.

## Targeted pattern scope

- Root `pr:` configuration in `azure-pipelines.yml`.
- `pr` blocks missing explicit branch filters.

## What this rule reports

This rule reports Azure Pipelines configs where PR validation scope is not
explicitly declared.

## Why this rule exists

Explicit PR branch filters prevent accidental scope drift (for example, PR checks
running on every branch or no branch at all). Keeping those filters in version
control improves reviewability.

## ❌ Incorrect

```yaml
pr:
  autoCancel: true
```

## ✅ Correct

```yaml
pr:
  branches:
    include:
      - main
```

## When not to use it

Disable this rule if your repository intentionally relies on implicit PR
validation scope.

> **Rule catalog ID:** R082

## Further reading

- [Azure Pipelines PR trigger reference](https://learn.microsoft.com/azure/devops/pipelines/yaml-schema/pr)
