# require-dependabot-grouping

Require dependency grouping (`groups`) in Dependabot configuration.

## Targeted pattern scope

This rule reads `.github/dependabot.yml` (or `.github/dependabot.yaml`) and checks
whether any entry in the `updates` array contains a `groups:` key.

## What this rule reports

This rule reports when the Dependabot configuration has no `groups:` entry in any
`updates` block.

## Why this rule exists

Without grouping, Dependabot opens a separate pull request for every single
dependency update. In repositories with a large number of dependencies, this can produce dozens
of daily PRs, creating noise, consuming review time, and clogging CI queues.
The `groups` feature bundles related updates (e.g., all `@eslint/*` packages)
into a single PR, dramatically reducing PR volume and improving the dependency
update experience.

## ❌ Incorrect

```yaml
# .github/dependabot.yml — no groups configured
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
```

## ✅ Correct

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    groups:
      all-dependencies:
        patterns:
          - "*"
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.strict,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-dependabot-grouping": "warn",
    },
  },
];
```

## When not to use it

Disable this rule if you prefer individual dependency update PRs for fine-grained
control, or if your project has a small number of dependencies where grouping provides no
meaningful benefit.

> **Rule catalog ID:** R054

## Further reading

- [Dependabot: `groups` option](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#groups)
