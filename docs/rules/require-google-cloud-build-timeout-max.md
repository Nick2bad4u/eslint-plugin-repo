# require-google-cloud-build-timeout-max

Require Google Cloud Build timeout values to be bounded and valid.

## Targeted pattern scope

- Root `timeout:` values in `cloudbuild.yaml`/`cloudbuild.yml`.

## What this rule reports

This rule reports malformed, non-positive, or over-maximum `timeout` values
when a `timeout:` key is present. A missing `timeout` key is not flagged here;
use [`require-google-cloud-build-timeout`](./require-google-cloud-build-timeout.md)
to enforce timeout existence.

## Why this rule exists

Bounded timeout values keep build execution policy explicit and prevent runaway
config values.

## ❌ Incorrect

```yaml
timeout: 999999s
steps:
  - name: gcr.io/cloud-builders/npm
```

## ✅ Correct

```yaml
timeout: 3600s
steps:
  - name: gcr.io/cloud-builders/npm
```

## When not to use it

Disable this rule if timeout policy is externally governed and may exceed this
repository policy bound.

> **Rule catalog ID:** R104

## Further reading

- [Cloud Build config schema](https://cloud.google.com/build/docs/build-config-file-schema)
