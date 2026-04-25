# require-netlify-publish-directory-no-trailing-slash

Require Netlify `publish` directory values to omit trailing slashes.

## Targeted pattern scope

- `publish = ...` in `netlify.toml`.

## What this rule reports

This rule reports publish directory values ending with `/`.

## Why this rule exists

A canonical path style reduces noisy config diffs and avoids subtle path-join
inconsistencies across tooling.

## ❌ Incorrect

```toml
[build]
  publish = "dist/"
```

## ✅ Correct

```toml
[build]
  publish = "dist"
```

## When not to use it

Disable this rule if trailing slash conventions are intentionally required by
other deployment tooling.

> **Rule catalog ID:** R114

## Further reading

- [Netlify file-based configuration](https://docs.netlify.com/build/configure-builds/file-based-configuration/)
