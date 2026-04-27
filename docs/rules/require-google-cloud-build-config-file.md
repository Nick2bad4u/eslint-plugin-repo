# require-google-cloud-build-config-file

Require a Google Cloud Build configuration file in repositories using the Google Cloud preset.

## Targeted pattern scope

- Repositories that opt into the Google Cloud preset without committing
  `cloudbuild.yaml`, `cloudbuild.yml`, or `cloudbuild.json`.

## What this rule reports

This rule reports repositories using the Google Cloud preset when no Cloud Build
config file is committed.

## Why this rule exists

A committed Cloud Build config keeps build and deploy behavior reviewable in the
repository instead of scattering it across console-only settings.

## ❌ Incorrect

```ts
// Repository enables Google Cloud policy but does not commit cloudbuild.yaml.
export default [];
```

## ✅ Correct

```yaml
# cloudbuild.yaml
timeout: 1200s
steps:
  - name: gcr.io/cloud-builders/npm
    args: ["test"]
```

## When not to use it

Disable this rule if the repository does not use Google Cloud Build.

> **Rule catalog ID:** R066

## Further reading

- [Google Cloud Build configuration overview](https://cloud.google.com/build/docs/build-config-file-schema)
