# require-dependabot-grouping

Require Dependabot grouping via `groups` or `multi-ecosystem-groups`.

## Targeted pattern scope

This rule reads `.github/dependabot.yml` (or `.github/dependabot.yaml`) and checks
for either supported grouping strategy:

- `groups:` inside at least one `updates` entry.
- `multi-ecosystem-groups:` at the top level.

## What this rule reports

This rule reports when the Dependabot configuration has neither `groups:` in
`updates` entries nor `multi-ecosystem-groups:` at the top level.

## Why this rule exists

Without grouping, Dependabot can open a separate pull request for every dependency update.
In repositories with many dependencies, this can produce high PR noise and increase review and CI cost.
`groups` and `multi-ecosystem-groups` both reduce update churn by batching related updates.

## ❌ Incorrect

```yaml
# .github/dependabot.yml — no supported grouping strategy configured
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

Or, for multi-ecosystem batching:

```yaml
version: 2
multi-ecosystem-groups:
  infrastructure:
    schedule:
      interval: weekly
updates:
  - package-ecosystem: npm
    directory: /
    patterns:
      - "*"
    multi-ecosystem-group: infrastructure
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.dependabot,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-dependabot-grouping": "warn",
    },
  },
];
```

## When not to use it

Disable this rule if your repository intentionally requires one pull request per
individual update and the extra PR volume is acceptable for your workflow.

> **Rule catalog ID:** R054

## Further reading

- [Dependabot: `groups` option](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#groups)
- [Dependabot: `multi-ecosystem-groups` option](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/configuring-multi-ecosystem-updates)