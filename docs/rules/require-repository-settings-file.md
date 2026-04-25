# require-repository-settings-file

Require a repository settings configuration file to manage repository settings as code.

## Targeted pattern scope

This rule checks for the presence of one of the following recognised repository
settings configuration files:

- `.github/settings.yml`
- `.github/settings.yaml`
- `.github/repository-settings.yml`
- `.github/repository-settings.yaml`

## What this rule reports

This rule reports when none of the recognised repository settings configuration
files is found in the repository.

## Why this rule exists

Repositories often grow to require specific branch protection rules, team access
controls, topic labels, and merge strategy preferences. When these are managed
only through the GitHub UI, they are invisible to code review, cannot be audited,
and must be re-applied manually if the repository is ever deleted or migrated.

The [probot/settings](https://github.com/probot/settings) GitHub App (and
compatible tooling such as the
[settings action](https://github.com/nicowillis/repository-settings-action)) reads
`.github/settings.yml` on every push and synchronises repository settings
declaratively. This allows branch protection, access controls, and labels to be
reviewed as pull requests, tracked in git history, and reproduced exactly.

This rule enforces that such a file exists, acting as a proxy for the verification
that repository settings are managed as code rather than through ad-hoc UI clicks.

## ❌ Incorrect

```txt
// No repository settings file found
.github/
  workflows/
    ci.yml
  CODEOWNERS
src/
package.json
```

## ✅ Correct

```yaml
# .github/settings.yml (probot/settings format)
repository:
  name: my-repository
  description: A well-configured repository.
  private: false
  has_issues: true
  has_projects: false
  has_wiki: false
  default_branch: main

branches:
  - name: main
    protection:
      required_pull_request_reviews:
        required_approving_review_count: 1
        dismiss_stale_reviews: true
      required_status_checks:
        strict: true
        contexts:
          - ci / build
      enforce_admins: true
      restrictions: null

labels:
  - name: bug
    color: CC0000
    description: An unexpected problem or behaviour.
  - name: enhancement
    color: 84b6eb
    description: New feature or request.
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.github,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-repository-settings-file": "warn",
    },
  },
];
```

## When not to use it

Disable this rule if:

- Your repository settings are managed through a different Infrastructure-as-Code
  mechanism (e.g., Terraform, Pulumi, or a custom GitOps operator) and no local
  settings file is expected.
- Your organisation policy prohibits repository-level settings automation and all
  settings are applied centrally by platform engineering.
- You are using a non-GitHub hosting provider that has no equivalent file-based
  settings app.

> **Rule catalog ID:** R062

## Further reading

- [probot/settings GitHub App](https://github.com/probot/settings)
- [probot/settings configuration reference](https://github.com/probot/settings#usage)
- [Managing branch protection rules (GitHub Docs)](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule)
