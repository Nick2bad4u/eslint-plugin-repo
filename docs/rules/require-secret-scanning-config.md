# require-secret-scanning-config

Require a GitHub secret scanning configuration file.

## Targeted pattern scope

This rule checks for the presence of either `.github/secret_scanning.yml` or
`.github/secret_scanning.yaml`.

## What this rule reports

This rule reports when no GitHub secret scanning configuration file is found.

## Why this rule exists

GitHub's secret scanning feature automatically alerts on detected credentials in
pushed commits. The `.github/secret_scanning.yml` file lets teams configure which
patterns to detect (via custom patterns), which paths to exclude, and which alerts
to close as false positives. Without this file, secret scanning falls back to
platform defaults and loses repository-specific tuning. Committing it to the
repository documents the team's security monitoring posture and makes it version-controlled.

## ❌ Incorrect

```txt
// .github directory has no secret_scanning.yml
.github/
  dependabot.yml
  CODEOWNERS
```

## ✅ Correct

```yaml
# .github/secret_scanning.yml
paths-ignore:
  - "tests/fixtures/**"
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.github,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-secret-scanning-config": "warn",
    },
  },
];
```

## When not to use it

Disable this rule if your repository is private and the team deliberately relies on
organisation-level secret scanning without a repository-level configuration override.

> **Rule catalog ID:** R042

## Further reading

- [GitHub Docs: Configuring secret scanning for your repositories](https://docs.github.com/en/code-security/secret-scanning/configuring-secret-scanning-for-your-repositories)
- [GitHub Docs: Excluding directories from secret scanning](https://docs.github.com/en/code-security/secret-scanning/configuring-secret-scanning-for-your-repositories#excluding-directories-from-secret-scanning)
