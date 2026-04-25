# require-digitalocean-app-spec-component

Require at least one deployable component block in DigitalOcean app specs.

## Targeted pattern scope

- Top-level component blocks in `.do/app.yaml` or `.do/app.yml`:
  - `services`
  - `workers`
  - `jobs`
  - `static_sites`
  - `functions`
  - `databases`

## What this rule reports

This rule reports app specs that define metadata like `name`/`region` but no
actual deployable components.

## Why this rule exists

A DigitalOcean App Platform spec without components is incomplete and can hide
misconfigured deployment intent in review.

## ❌ Incorrect

```yaml
name: demo
region: nyc
```

## ✅ Correct

```yaml
name: demo
region: nyc
services:
  - name: web
```

## When not to use it

Disable this rule if your repository intentionally stores partial app-spec
snippets and composes full specs elsewhere.

> **Rule catalog ID:** R087

## Further reading

- [DigitalOcean App Spec reference](https://docs.digitalocean.com/products/app-platform/reference/app-spec/)
