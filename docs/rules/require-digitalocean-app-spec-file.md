# require-digitalocean-app-spec-file

Require a DigitalOcean App Platform specification file.

## Targeted pattern scope

- Repositories that opt into the DigitalOcean preset without committing
  `.do/app.yaml` or `.do/app.yml`.

## What this rule reports

This rule reports repositories using the DigitalOcean preset when no App
Platform spec file exists.

## Why this rule exists

The App Platform spec captures services, routes, environment variables, and
deploy behavior. Keeping that file in version control makes infrastructure
changes reviewable with the application code they affect.

## ❌ Incorrect

```ts
// DigitalOcean App Platform is configured only in the dashboard.
export default [];
```

## ✅ Correct

```yaml
# .do/app.yaml
name: example-app
services:
  - name: web
    github:
      repo: example/repo
      branch: main
```

## When not to use it

Disable this rule if the repository does not deploy through DigitalOcean App Platform.

> **Rule catalog ID:** R073

## Further reading

- [DigitalOcean App Spec reference](https://docs.digitalocean.com/products/app-platform/reference/app-spec/)
