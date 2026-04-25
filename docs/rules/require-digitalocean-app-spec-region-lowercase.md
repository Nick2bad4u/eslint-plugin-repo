# require-digitalocean-app-spec-region-lowercase

Require DigitalOcean app spec `region` values to be lowercase.

## Targeted pattern scope

- Top-level `region` value in `.do/app.yaml` / `.do/app.yml`.

## What this rule reports

This rule reports non-lowercase region values.

## Why this rule exists

Lowercase canonical region values reduce typo drift and keep deployment config
style consistent.

## ❌ Incorrect

```yaml
region: NYC
```

## ✅ Correct

```yaml
region: nyc
```

## When not to use it

Disable this rule if region normalization is handled externally and uppercase
values are intentionally supported.

> **Rule catalog ID:** R115

## Further reading

- [DigitalOcean App Spec reference](https://docs.digitalocean.com/products/app-platform/reference/app-spec/)
