# require-netlify-build-publish-directory

Require an explicit Netlify publish directory.

## Targeted pattern scope

- `publish = ...` entries in `netlify.toml`.

## What this rule reports

This rule reports Netlify configs that do not declare a publish directory.

## Why this rule exists

The deploy output directory is too important to leave implicit. Storing it in
version control makes the production artifact path obvious during review and
reduces dashboard drift.

## ❌ Incorrect

```toml
[build]
  command = "npm run build"
```

## ✅ Correct

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

## When not to use it

Disable this rule if Netlify output directories are intentionally managed outside the repository.

> **Rule catalog ID:** R072

## Further reading

- [Netlify configuration file reference](https://docs.netlify.com/configure-builds/file-based-configuration/)
