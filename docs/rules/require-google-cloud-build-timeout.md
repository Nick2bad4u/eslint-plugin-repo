# require-google-cloud-build-timeout

Require an explicit root `timeout` in Google Cloud Build configuration.

## Targeted pattern scope

- Top-level `timeout:` in `cloudbuild.yaml` or `cloudbuild.yml`.

## What this rule reports

This rule reports Cloud Build configs that do not declare a root timeout.

## Why this rule exists

Explicit timeout budgets make build behavior predictable and prevent runaway
builds from quietly consuming CI minutes until the platform default is hit.

## ❌ Incorrect

```yaml
steps:
  - name: gcr.io/cloud-builders/npm
    args: ["test"]
```

## ✅ Correct

```yaml
timeout: 1200s
steps:
  - name: gcr.io/cloud-builders/npm
    args: ["test"]
```

## When not to use it

Disable this rule if timeout budgets are intentionally managed outside the repository.

> **Rule catalog ID:** R067

## Further reading

- [Google Cloud Build config file schema](https://cloud.google.com/build/docs/build-config-file-schema)
