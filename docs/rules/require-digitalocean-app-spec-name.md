# require-digitalocean-app-spec-name

Require top-level `name` in DigitalOcean App Platform specs.

## Targeted pattern scope

- Root-level `name:` in `.do/app.yaml` or `.do/app.yml`.

## What this rule reports

This rule reports app specs that omit explicit app identity.

## Why this rule exists

Top-level app naming improves reviewability and avoids ambiguous app-spec
ownership in multi-app repositories.

## ❌ Incorrect

```yaml
region: nyc
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

Disable this rule if app identity is intentionally injected by external tooling
and omitted from the checked-in spec.

> **Rule catalog ID:** R094

## Further reading

- [DigitalOcean App Spec reference](https://docs.digitalocean.com/products/app-platform/reference/app-spec/)
