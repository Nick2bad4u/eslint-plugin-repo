# require-netlify-config-file

Require `netlify.toml` when using the Netlify preset.

## Targeted pattern scope

- Repositories that opt into the Netlify preset without committing
  `netlify.toml`.

## What this rule reports

This rule reports repositories using the Netlify preset when no `netlify.toml`
file exists.

## Why this rule exists

Keeping Netlify configuration in the repository makes build commands, redirects,
headers, and output paths reviewable in pull requests instead of buried in the
dashboard.

## ❌ Incorrect

```ts
// Netlify hosting relies only on dashboard settings.
export default [];
```

## ✅ Correct

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

## When not to use it

Disable this rule if the repository does not use Netlify or intentionally relies on dashboard-only configuration.

> **Rule catalog ID:** R071

## Further reading

- [Netlify configuration file reference](https://docs.netlify.com/configure-builds/file-based-configuration/)
