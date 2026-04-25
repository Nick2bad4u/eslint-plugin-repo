# require-digitalocean-app-spec-region-value

Require DigitalOcean app specs to provide non-empty `region` values.

## Targeted pattern scope

- Top-level `region:` value in `.do/app.yaml` or `.do/app.yml`.

## What this rule reports

This rule reports missing or empty region values.

## Why this rule exists

A blank region field is ambiguous and can hide deployment placement mistakes.
Explicit values improve infrastructure reviewability.

## ❌ Incorrect

```yaml
name: demo-app
region:
services:
  - name: web
```

## ✅ Correct

```yaml
name: demo-app
region: nyc
services:
  - name: web
```

## When not to use it

Disable this rule if region values are intentionally injected externally.

> **Rule catalog ID:** R101

## Further reading

- [DigitalOcean App Spec reference](https://docs.digitalocean.com/products/app-platform/reference/app-spec/)
