# require-dependabot-ecosystem-coverage

Require specific package ecosystems to be covered by Dependabot.

## Targeted pattern scope

This rule reads `.github/dependabot.yml` (or `.github/dependabot.yaml`) and
collects all declared `package-ecosystem` values. It then checks whether all
ecosystems listed in the `requiredEcosystems` option are covered.

## What this rule reports

This rule reports when one or more of the configured required ecosystems is not
present in any `updates` entry.

## Why this rule exists

Repositories often have multiple dependency types — npm packages, Docker images,
GitHub Actions, and pip packages may all coexist. Forgetting to configure Dependabot
for one ecosystem means those dependencies silently drift without update proposals.
This rule makes coverage gaps visible during linting.

## ❌ Incorrect

With `requiredEcosystems: ["npm", "github-actions"]`:

```yaml
# .github/dependabot.yml — missing github-actions ecosystem
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
  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
```

## Behavior and migration notes

The rule accepts an options object with a `requiredEcosystems` array. The default
value is `[]` (no ecosystems required by default). Teams should configure this to
match their actual stack.

```ts
interface Options {
  requiredEcosystems?: string[]; // default: []
}
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.strict,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-dependabot-ecosystem-coverage": [
        "warn",
        { requiredEcosystems: ["npm", "github-actions"] },
      ],
    },
  },
];
```

## When not to use it

Disable this rule if the concept of required ecosystem coverage does not apply to
your project, or if you rely on Renovate (which is configured separately).

> **Rule catalog ID:** R053

## Further reading

- [Dependabot: supported ecosystems and registries](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/about-dependabot-version-updates#supported-repositories-and-ecosystems)
