# require-vercel-schema-url

Require Vercel `$schema` metadata to reference a vercel.json schema URL.

## Targeted pattern scope

- Top-level `$schema` in `vercel.json`.

## What this rule reports

This rule reports missing or non-Vercel schema URL values.

## Why this rule exists

Using a vercel.json-aware schema URL improves editor validation quality and
reduces config drift.

## ❌ Incorrect

```json
{
  "$schema": "https://example.com/schema.json"
}
```

## ✅ Correct

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json"
}
```

## When not to use it

Disable this rule if schema URL conventions are intentionally customized by
project tooling.

> **Rule catalog ID:** R106

## Further reading

- [Vercel project configuration](https://vercel.com/docs/project-configuration)
