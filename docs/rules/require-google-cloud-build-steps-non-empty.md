# require-google-cloud-build-steps-non-empty

Require `steps` in Cloud Build config to include at least one step entry.

## Targeted pattern scope

- Top-level `steps` list in `cloudbuild.yaml` / `cloudbuild.yml`.

## What this rule reports

This rule reports empty step lists.

## Why this rule exists

A Cloud Build file with no steps does not describe actionable build behavior and
usually indicates incomplete CI configuration.

## ❌ Incorrect

```yaml
steps:
timeout: 60s
```

## ✅ Correct

```yaml
steps:
  - name: gcr.io/cloud-builders/npm
```

## When not to use it

Disable this rule if the build steps are always injected through external
templating.

> **Rule catalog ID:** R111

## Further reading

- [Cloud Build config schema](https://cloud.google.com/build/docs/build-config-file-schema)
