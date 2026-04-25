# require-vercel-schema

Require `$schema` metadata in `vercel.json`.

## Targeted pattern scope

- Top-level `$schema` field in `vercel.json`.

## What this rule reports

This rule reports Vercel config files that omit `$schema`.

## Why this rule exists

Schema metadata enables editor validation/autocomplete and helps reviewers spot
invalid or deprecated keys earlier in development.

## ❌ Incorrect

```json
{
  "cleanUrls": true
}
```

## ✅ Correct

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "cleanUrls": true
}
```

## When not to use it

Disable this rule if your repository intentionally omits schema metadata and
accepts reduced editor validation.

> **Rule catalog ID:** R085

## Further reading

- [Vercel project configuration](https://vercel.com/docs/project-configuration)
