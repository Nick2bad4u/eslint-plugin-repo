# require-azure-pipelines-config-file

Require an Azure Pipelines configuration file in repositories using the Azure preset.

## Targeted pattern scope

- Repositories that opt into the Azure preset without committing
  `azure-pipelines.yml` or `azure-pipelines.yaml`.

## What this rule reports

This rule reports repositories using the Azure preset when no Azure Pipelines
YAML file is committed.

## Why this rule exists

A committed pipeline file keeps validation and deployment logic in version
control, which is easier to review and safer to evolve than dashboard-only
configuration.

## ❌ Incorrect

```ts
// Repository enables Azure-specific policy but does not commit azure-pipelines.yml.
export default [];
```

## ✅ Correct

```yaml
# azure-pipelines.yml
trigger:
  - main

pool:
  vmImage: ubuntu-latest

steps:
  - script: npm test
```

## When not to use it

Disable this rule if the repository does not use Azure Pipelines or Azure automation is intentionally managed elsewhere.

> **Rule catalog ID:** R064

## Further reading

- [Azure Pipelines YAML schema reference](https://learn.microsoft.com/azure/devops/pipelines/yaml-schema/)
