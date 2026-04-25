# require-netlify-publish-relative-path

Require Netlify `publish` path values to be relative.

## Targeted pattern scope

- `publish = ...` values in `netlify.toml`.

## What this rule reports

This rule reports absolute publish directory paths such as `/dist`.

## Why this rule exists

Netlify build outputs are expected to be repository/base-directory relative.
Absolute paths are fragile and often accidental.

## ❌ Incorrect

```toml
[build]
  publish = "/dist"
```

## ✅ Correct

```toml
[build]
  publish = "dist"
```

## When not to use it

Disable this rule if your deployment workflow intentionally uses absolute publish
paths and guarantees environment consistency externally.

> **Rule catalog ID:** R093

## Further reading

- [Netlify file-based configuration](https://docs.netlify.com/build/configure-builds/file-based-configuration/)
