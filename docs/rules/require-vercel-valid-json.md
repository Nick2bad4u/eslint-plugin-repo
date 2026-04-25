# require-vercel-valid-json

Require `vercel.json` to be valid JSON.

## Targeted pattern scope

- JSON syntax validity of `vercel.json`.

## What this rule reports

This rule reports parse-invalid `vercel.json` configuration files.

## Why this rule exists

Syntax-invalid provider config often slips through reviews and then fails at
runtime/deploy time. Catching it in lint keeps config quality gates local.

## ❌ Incorrect

```json
{"buildCommand": "npm run build",}
```

## ✅ Correct

```json
{
  "buildCommand": "npm run build"
}
```

## When not to use it

Disable this rule if `vercel.json` is generated and validated by another trusted
step before deployment.

> **Rule catalog ID:** R092

## Further reading

- [Vercel project configuration](https://vercel.com/docs/project-configuration)
