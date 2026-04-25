# require-vercel-version-value

Require `vercel.json` to declare `version: 2`.

## Targeted pattern scope

- Top-level `version` field in `vercel.json`.

## What this rule reports

This rule reports missing or non-2 version values.

## Why this rule exists

Vercel configuration behavior is versioned; pinning to the expected version keeps
configuration semantics stable.

## ❌ Incorrect

```json
{
  "version": 1
}
```

## ✅ Correct

```json
{
  "version": 2
}
```

## When not to use it

Disable this rule if your repository intentionally uses a different Vercel config
versioning strategy.

> **Rule catalog ID:** R113

## Further reading

- [Vercel project configuration](https://vercel.com/docs/project-configuration)
