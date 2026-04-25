# require-netlify-build-command

Require an explicit Netlify `command = ...` build setting.

## Targeted pattern scope

- `command = ...` entries in `netlify.toml`.

## What this rule reports

This rule reports Netlify configs that omit an explicit build command.

## Why this rule exists

When build commands live only in dashboard settings, deployment behavior can
drift from repository review history. Keeping `command = ...` in `netlify.toml`
makes CI behavior reproducible and auditable.

## ❌ Incorrect

```toml
[build]
  publish = "dist"
```

## ✅ Correct

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

## When not to use it

Disable this rule if the repository intentionally ships prebuilt artifacts and
never runs a Netlify build command.

> **Rule catalog ID:** R079

## Further reading

- [Netlify file-based configuration](https://docs.netlify.com/configure-builds/file-based-configuration/)
