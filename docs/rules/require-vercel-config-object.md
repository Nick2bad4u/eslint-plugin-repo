# require-vercel-config-object

Require `vercel.json` to contain a top-level JSON object.

## Targeted pattern scope

- Top-level JSON document shape in `vercel.json`.

## What this rule reports

This rule reports non-object JSON documents (for example arrays).

## Why this rule exists

Vercel settings are object-based; non-object config documents are usually
misconfigurations that break tooling expectations.

## ❌ Incorrect

```json
[]
```

## ✅ Correct

```json
{
  "buildCommand": "npm run build"
}
```

## When not to use it

Disable this rule if your repository intentionally preprocesses non-object config
files before Vercel consumes them.

> **Rule catalog ID:** R099

## Further reading

- [Vercel project configuration](https://vercel.com/docs/project-configuration)
