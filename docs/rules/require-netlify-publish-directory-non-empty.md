# require-netlify-publish-directory-non-empty

Require Netlify `publish` directory values to be non-empty.

## Targeted pattern scope

- `publish = ...` assignments in `netlify.toml`.

## What this rule reports

This rule reports missing or empty publish path values.

## Why this rule exists

An empty publish directory silently breaks deployment output assumptions even if
the key exists.

## ❌ Incorrect

```toml
[build]
  command = "npm run build"
  publish = ""
```

## ✅ Correct

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

## When not to use it

Disable this rule if publish directories are intentionally injected outside the
repository config.

> **Rule catalog ID:** R107

## Further reading

- [Netlify file-based configuration](https://docs.netlify.com/build/configure-builds/file-based-configuration/)
