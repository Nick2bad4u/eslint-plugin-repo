# require-google-cloud-build-timeout-format

Require Google Cloud Build timeout values to use seconds format (for example,
`1200s`).

## Targeted pattern scope

- Root `timeout:` values in `cloudbuild.yaml` or `cloudbuild.yml`.

## What this rule reports

This rule reports incorrectly formatted Cloud Build timeout values when a
`timeout:` key is present. A missing `timeout` key is not flagged here; use
[`require-google-cloud-build-timeout`](./require-google-cloud-build-timeout.md)
to enforce timeout existence.

## Why this rule exists

Explicit, correctly formatted timeout values reduce accidental long-running builds
and make execution limits consistent across environments.

## ❌ Incorrect

```yaml
timeout: 20m
steps:
  - name: gcr.io/cloud-builders/npm
```

## ✅ Correct

```yaml
timeout: 1200s
steps:
  - name: gcr.io/cloud-builders/npm
```

## When not to use it

Disable this rule if timeout policy is intentionally managed outside committed
Cloud Build config.

> **Rule catalog ID:** R090

## Further reading

- [Google Cloud Build config file schema](https://cloud.google.com/build/docs/build-config-file-schema)
