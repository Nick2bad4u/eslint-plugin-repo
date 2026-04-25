# require-google-cloud-build-steps

Require a root `steps` block in Google Cloud Build config.

## Targeted pattern scope

- Top-level `steps:` entries in `cloudbuild.yaml` or `cloudbuild.yml`.

## What this rule reports

This rule reports Google Cloud Build configs that omit the root `steps:` key.

## Why this rule exists

The `steps` block is the core build execution plan. Requiring it in committed
config helps reviewers verify what runs in CI and prevents ambiguous or partial
build definitions.

## ❌ Incorrect

```yaml
timeout: 1200s
```

## ✅ Correct

```yaml
timeout: 1200s
steps:
  - name: gcr.io/cloud-builders/npm
    args: ["test"]
```

## When not to use it

Disable this rule if your repository intentionally stores only partial Cloud
Build metadata and injects execution steps elsewhere.

> **Rule catalog ID:** R076

## Further reading

- [Google Cloud Build configuration schema](https://cloud.google.com/build/docs/build-config-file-schema)
