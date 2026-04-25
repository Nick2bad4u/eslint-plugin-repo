# require-netlify-build-section

Require a canonical `[build]` section in `netlify.toml`.

## Targeted pattern scope

- `netlify.toml` files that do not define `[build]`.

## What this rule reports

This rule reports Netlify config files missing the root build section.

## Why this rule exists

Netlify build policy is easier to audit when command/output settings are grouped
under `[build]` instead of spread across ad-hoc blocks.

## ❌ Incorrect

```toml
[redirects]
  from = "/*"
```

## ✅ Correct

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

## When not to use it

Disable this rule if your repository intentionally avoids Netlify build
configuration and only uses runtime directives.

> **Rule catalog ID:** R086

## Further reading

- [Netlify file-based configuration](https://docs.netlify.com/configure-builds/file-based-configuration/)
