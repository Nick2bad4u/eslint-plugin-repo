# require-renovate-or-dependabot

Require either a Renovate or Dependabot dependency-update configuration in the repository.

## Targeted pattern scope

This rule checks the repository root for any recognised Renovate configuration file
(`renovate.json`, `renovate.json5`, `.github/renovate.json`, `.github/renovate.json5`,
`.renovaterc`, `.renovaterc.json`) **or** a Dependabot configuration file
(`.github/dependabot.yml`, `.github/dependabot.yaml`). At least one file from
either group must be present.

## What this rule reports

This rule reports when neither a Renovate nor a Dependabot configuration is found.

## Why this rule exists

Outdated dependencies are one of the most common sources of security vulnerabilities
and compatibility issues. Automated dependency update tooling (Renovate or Dependabot)
ensures updates are regularly proposed as pull requests and reviewed by humans rather
than forgotten. A repository without either tool configured is likely accumulating
technical debt silently.

## ❌ Incorrect

```txt
// No renovate.json, .renovaterc, or .github/dependabot.yml found
.github/
  CODEOWNERS
src/
package.json
```

## ✅ Correct

Using Dependabot:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
```

### Alternative: using Renovate

```json
// renovate.json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended"]
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
      "repo-compliance/require-renovate-or-dependabot": "error",
    },
  },
];
```

## When not to use it

Disable this rule if your team manages dependency updates through a different
automated process (e.g., a scheduled internal bot or manual monthly review
with a documented policy) and you deliberately prefer not to use Renovate or Dependabot.

> **Rule catalog ID:** R040

## Further reading

- [Dependabot configuration options](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
- [Renovate documentation](https://docs.renovatebot.com/)
