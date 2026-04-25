# require-dependabot-update-entries

Require Dependabot to declare at least one update entry.

## Targeted pattern scope

This rule reads `.github/dependabot.yml` (or `.github/dependabot.yaml`) and
checks whether the configuration contains at least one `updates` entry with a
`package-ecosystem` declaration.

## What this rule reports

This rule reports when the Dependabot configuration file does not contain any
usable update entries.

## Why this rule exists

Dependabot does nothing useful without at least one `updates` entry. Repositories
occasionally commit an empty or placeholder configuration file and assume
dependency updates are automated when they are not. This rule catches that by
requiring at least one real update entry.

## ❌ Incorrect

```yaml
# .github/dependabot.yml — no update entries
version: 2
updates:
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
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.strict,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-dependabot-update-entries": "warn",
    },
  },
];
```

## When not to use it

Disable this rule if your repository intentionally keeps a placeholder
Dependabot configuration without active update entries, or if you use a
different dependency update tool entirely.

> **Rule catalog ID:** R053

## Further reading

- [Dependabot: supported ecosystems and registries](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/about-dependabot-version-updates#supported-repositories-and-ecosystems)
