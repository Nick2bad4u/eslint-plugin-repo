# require-vercel-build-command

Require a non-empty `buildCommand` in `vercel.json`.

## Targeted pattern scope

- Top-level `buildCommand` in `vercel.json`.
- Missing or empty `buildCommand` values.

## What this rule reports

This rule reports Vercel config files that do not explicitly define the build
command.

## Why this rule exists

Vercel can auto-detect build behavior, but explicit commands are easier to
review and keep consistent across environments. Committing `buildCommand`
reduces dashboard-only or framework-default drift.

## ❌ Incorrect

```json
{
  "cleanUrls": true
}
```

## ✅ Correct

```json
{
  "buildCommand": "npm run build",
  "cleanUrls": true
}
```

## When not to use it

Disable this rule if your repository intentionally relies on Vercel's
auto-detected build command behavior.

> **Rule catalog ID:** R078

## Further reading

- [Vercel project configuration](https://vercel.com/docs/project-configuration)
