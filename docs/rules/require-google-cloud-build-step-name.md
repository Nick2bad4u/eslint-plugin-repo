# require-google-cloud-build-step-name

Require at least one named step in Google Cloud Build configuration.

## Targeted pattern scope

- `- name:` entries in `cloudbuild.yaml` or `cloudbuild.yml`.

## What this rule reports

This rule reports Cloud Build configs that do not include named execution steps.

## Why this rule exists

Named steps make build behavior understandable in code review and reduce
ambiguity about which builder image each step runs.

## ❌ Incorrect

```yaml
steps:
  - id: test
    args: ["test"]
```

## ✅ Correct

```yaml
steps:
  - name: gcr.io/cloud-builders/npm
    args: ["test"]
```

## When not to use it

Disable this rule if your repository intentionally stores only partial Cloud
Build snippets and injects step definitions elsewhere.

> **Rule catalog ID:** R083

## Further reading

- [Cloud Build config schema](https://cloud.google.com/build/docs/build-config-file-schema)
