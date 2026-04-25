# require-netlify-build-command-non-empty

Require Netlify `build.command` values to be present and non-empty.

## Targeted pattern scope

- `command = ...` assignments in `netlify.toml`.

## What this rule reports

This rule reports missing or empty build command values.

## Why this rule exists

An empty command assignment can pass superficial checks while silently breaking
build expectations.

## ❌ Incorrect

```toml
[build]
  command = ""
  publish = "dist"
```

## ✅ Correct

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

## When not to use it

Disable this rule if build command selection is intentionally managed outside
`netlify.toml`.

> **Rule catalog ID:** R100

## Further reading

- [Netlify file-based configuration](https://docs.netlify.com/build/configure-builds/file-based-configuration/)
