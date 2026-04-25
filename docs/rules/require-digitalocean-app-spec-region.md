# require-digitalocean-app-spec-region

Require a root `region` in DigitalOcean App Platform specs.

## Targeted pattern scope

- Top-level `region:` key in `.do/app.yaml` or `.do/app.yml`.

## What this rule reports

This rule reports DigitalOcean App Platform specs that omit the root deployment
region.

## Why this rule exists

Region selection affects latency, compliance boundaries, and cost. Requiring an
explicit `region` value in the app spec makes infrastructure placement decisions
clear in version control.

## ❌ Incorrect

```yaml
name: example-app
services:
  - name: web
```

## ✅ Correct

```yaml
name: example-app
region: nyc
services:
  - name: web
```

## When not to use it

Disable this rule if your repository intentionally relies on external defaults
for DigitalOcean region selection.

> **Rule catalog ID:** R080

## Further reading

- [DigitalOcean App Spec reference](https://docs.digitalocean.com/products/app-platform/reference/app-spec/)
