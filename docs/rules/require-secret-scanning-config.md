# require-secret-scanning-config

Require a GitHub secret scanning configuration surface.

## Targeted pattern scope

This rule checks for the presence of one of the following GitHub-native secret
scanning configuration surfaces:

- `.github/secret_scanning.yml`
- `.github/secret_scanning.yaml`
- `.github/secret-scanning.yml`
- `.github/secret-scanning.yaml`
- any `.yml` / `.yaml` file under `.github/secret-scanning/`

## What this rule reports

This rule reports when no supported GitHub secret scanning configuration
surface is found.

## Why this rule exists

GitHub's secret scanning feature automatically alerts on detected credentials in
pushed commits. Repository-level secret scanning config files let teams define
custom patterns and tune repository-specific scanning behavior. Without one of
these config surfaces, secret scanning falls back to platform defaults and
loses repository-specific tuning. Committing it to the repository documents the
team's security monitoring posture and makes it version-controlled.

## ❌ Incorrect

```txt
// .github directory has no secret scanning config surface
.github/
  dependabot.yml
  CODEOWNERS
```

## ✅ Correct

```yaml
# .github/secret-scanning/custom-patterns.yml
name: Internal token patterns
patterns:
  - name: Example Internal Token
    regex: 'example_[A-Za-z0-9]{32}'
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

Disable this rule if your repository deliberately relies on organisation-level
secret scanning defaults without a repository-level configuration override.

> **Rule catalog ID:** R042

## Further reading

- [GitHub Docs: Configuring secret scanning for your repositories](https://docs.github.com/en/code-security/secret-scanning/configuring-secret-scanning-for-your-repositories)
- [GitHub Docs: Excluding directories from secret scanning](https://docs.github.com/en/code-security/secret-scanning/configuring-secret-scanning-for-your-repositories#excluding-directories-from-secret-scanning)
- [GitHub Docs: Custom patterns for secret scanning](https://docs.github.com/en/code-security/secret-scanning/defining-custom-patterns-for-secret-scanning)
