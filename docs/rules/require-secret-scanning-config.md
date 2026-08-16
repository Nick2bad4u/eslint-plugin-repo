# require-secret-scanning-config

Require an intentional GitHub secret scanning path-exclusion configuration.

## Targeted pattern scope

This rule checks for the presence of GitHub's repository-level secret scanning
exclusion file:

- `.github/secret_scanning.yml`

## What this rule reports

When explicitly enabled, this rule reports when `.github/secret_scanning.yml`
is missing.

## Why this rule exists

GitHub uses `.github/secret_scanning.yml` to exclude matching paths from secret
scanning alerts and push protection. Repositories that intentionally depend on
such exclusions may opt into this rule to ensure the policy remains committed.

The rule is deliberately excluded from `recommended`, `strict`, and `github`.
Requiring this file by default would be unsafe: repositories that need no
exclusions should not create one, and custom secret patterns are configured in
GitHub rather than in a repository file.

## ❌ Incorrect

```txt
// The repository intentionally requires exclusions, but the policy is missing.
.github/
  dependabot.yml
  CODEOWNERS
```

## ✅ Correct

```yaml
# .github/secret_scanning.yml
# Generated documentation fixtures contain invalid example tokens.
paths-ignore:
 - "docs/generated/**"
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
 {
  plugins: { "repo-compliance": repoPlugin },
  rules: {
   "repo-compliance/require-secret-scanning-config": "warn",
  },
 },
];
```

## When not to use it

Do not enable this rule merely to prove that secret scanning is active. It
cannot inspect repository settings, and creating an exclusion file without a
real need reduces scanning coverage. Define custom secret patterns through
GitHub's repository, organization, or enterprise security settings instead.

> **Rule catalog ID:** R042

## Further reading

- [GitHub Docs: Enable secret scanning](https://docs.github.com/en/code-security/how-tos/secure-your-secrets/detect-secret-leaks/enable-secret-scanning)
- [GitHub Docs: Exclude folders and files from secret scanning](https://docs.github.com/en/code-security/how-tos/secure-your-secrets/customize-leak-detection/exclude-folders-and-files)
- [GitHub Docs: Define custom patterns for secret scanning](https://docs.github.com/en/code-security/how-tos/secure-your-secrets/customize-leak-detection/define-custom-patterns)
