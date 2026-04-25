# require-vercel-config-file

Require `vercel.json` when using the Vercel preset.

## Targeted pattern scope

- Repositories that opt into the Vercel preset without committing `vercel.json`.

## What this rule reports

This rule reports repositories using the Vercel preset when no `vercel.json`
file exists.

## Why this rule exists

Although Vercel supports dashboard configuration, repository-local config is
easier to review, audit, and reproduce across environments.

## ❌ Incorrect

```ts
// Vercel deployment depends on dashboard-only settings.
export default [];
```

## ✅ Correct

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "cleanUrls": true
}
```

## When not to use it

Disable this rule if the repository intentionally relies on Vercel defaults or dashboard-only settings.

> **Rule catalog ID:** R070

## Further reading

- [Vercel project configuration](https://vercel.com/docs/project-configuration)
