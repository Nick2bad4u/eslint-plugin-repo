# require-digitalocean-app-spec-name-value

Require DigitalOcean app spec `name` values to be non-empty.

## Targeted pattern scope

- Top-level `name:` in `.do/app.yaml`/`.do/app.yml`.

## What this rule reports

This rule reports missing or empty app-name values.

## Why this rule exists

A blank app identity undermines traceability in multi-app repositories and
deployment review.

## ❌ Incorrect

```yaml
name:
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

Disable this rule if app names are externally injected into specs.

> **Rule catalog ID:** R108

## Further reading

- [DigitalOcean App Spec reference](https://docs.digitalocean.com/products/app-platform/reference/app-spec/)
