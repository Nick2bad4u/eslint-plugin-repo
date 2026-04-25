# require-google-cloud-build-timeout-positive

Require Google Cloud Build timeout values to be positive durations.

## Targeted pattern scope

- Root-level `timeout:` values in `cloudbuild.yaml` or `cloudbuild.yml`.

## What this rule reports

This rule reports non-positive or malformed `timeout` values when a `timeout:`
key is present. A missing `timeout` key is not flagged here; use
[`require-google-cloud-build-timeout`](./require-google-cloud-build-timeout.md)
to enforce timeout existence.

## Why this rule exists

A zero or invalid timeout undermines predictable build behavior and can hide CI
execution policy drift.

## ❌ Incorrect

```yaml
timeout: 0s
steps:
  - name: gcr.io/cloud-builders/npm
```

## ✅ Correct

```yaml
timeout: 60s
steps:
  - name: gcr.io/cloud-builders/npm
```

## When not to use it

Disable this rule if timeout policy is intentionally managed outside committed
Cloud Build configuration.

> **Rule catalog ID:** R097

## Further reading

- [Google Cloud Build config schema](https://cloud.google.com/build/docs/build-config-file-schema)
