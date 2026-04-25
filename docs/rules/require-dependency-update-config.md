# require-dependency-update-config

Require automated dependency update configuration in the repository.

## Targeted pattern scope

This rule checks the repository root for any recognised automated dependency
update configuration. Supported groups are:

- Renovate configuration files (`renovate.json`, `renovate.json5`,
  `renovate.yml`, `renovate.yaml`, `renovate.config.js`,
  `renovate.config.cjs`, `renovate.config.mjs`, `.github/renovate.json`,
  `.github/renovate.json5`, `.github/renovate.yml`, `.github/renovate.yaml`,
  `.renovaterc`, `.renovaterc.json`, `.renovaterc.json5`,
  `.renovaterc.yml`, `.renovaterc.yaml`, `.renovaterc.js`,
  `.renovaterc.cjs`, `.renovaterc.mjs`)
- Dependabot configuration files (`.github/dependabot.yml`,
  `.github/dependabot.yaml`, legacy `.dependabot/config.yml`,
  `.dependabot/config.yaml`)
- Updatecli configuration files (`updatecli.yml`, `updatecli.yaml`, or any
  `.yml` / `.yaml` file inside `updatecli.d/`)

At least one supported configuration must be present.

## What this rule reports

This rule reports when no supported automated dependency update configuration is found.

## Why this rule exists

Outdated dependencies are one of the most common sources of security
vulnerabilities and compatibility issues. Automated dependency update tooling
such as Renovate, Dependabot, or Updatecli ensures updates are regularly
proposed, reviewed, and merged instead of being forgotten. A repository without
any supported dependency update configuration is likely accumulating technical
debt silently.

## ❌ Incorrect

```txt
// No automated dependency update configuration found
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

### Alternative: using Updatecli

```yaml
# updatecli.yaml
sources: {}
targets: {}
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.strict,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-dependency-update-config": "error",
    },
  },
];
```

## When not to use it

Disable this rule if your team manages dependency updates through a different
automated process (for example an internal platform bot or a centrally managed
service) and you deliberately do not want repository-local Renovate,
Dependabot, or Updatecli configuration.

> **Rule catalog ID:** R040

## Further reading

- [Dependabot configuration options](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
- [Renovate documentation](https://docs.renovatebot.com/)
- [Updatecli documentation](https://www.updatecli.io/)
