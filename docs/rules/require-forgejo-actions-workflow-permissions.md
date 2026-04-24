# require-forgejo-actions-workflow-permissions

Require explicit `permissions` in each Forgejo Actions workflow.

## Targeted pattern scope

This rule scans Forgejo workflow files in `.forgejo/workflows/*.{yml,yaml}` and targets workflows that do not declare any `permissions` key.

A `permissions` key is accepted at either the workflow level or the job level.

## What this rule reports

This rule reports repositories where one or more Forgejo workflow files are missing explicit token permissions.

## Why this rule exists

Forgejo Actions uses the same workflow syntax as GitHub Actions and supports the same `permissions` token model. When `permissions` is not declared, the workflow token may receive write access to resources it does not need.

Making permissions explicit reduces the attack surface of CI automation and makes the security posture of each workflow reviewable in pull requests. This is especially important for public repositories or workflows triggered by external contributions such as `pull_request` or `pull_request_target` events.

## ❌ Incorrect

```ts
// .forgejo/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

## ✅ Correct

```ts
// .forgejo/workflows/ci.yml — workflow-level permissions
name: CI
on:
  push:
permissions:
  contents: read
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

```ts
// .forgejo/workflows/lint.yml — job-level permissions
name: Lint
on:
  pull_request:
jobs:
  lint:
    permissions:
      contents: read
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

## ESLint flat config example

```js
// eslint.config.mjs
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.codeberg,
  // or individually:
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-forgejo-actions-workflow-permissions": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if workflow token permissions are guaranteed by an external policy system and repository-level enforcement would be redundant.

> **Rule catalog ID:** R021

## Further reading

- [Forgejo Docs: Actions](https://forgejo.org/docs/latest/user/actions/)
- [GitHub Docs: Use GITHUB\_TOKEN for authentication in workflows](https://docs.github.com/actions/reference/authentication-in-a-workflow) (Forgejo uses the same permissions model)
- [GitHub Docs: Assigning permissions to jobs](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/assigning-permissions-to-jobs)

## Adoption resources

- Enable `repo-compliance:codeberg` preset in your flat config to activate this rule alongside other Codeberg/Forgejo-specific checks.
- For repositories migrating from GitHub Actions to Forgejo Actions, existing workflow-level `permissions` blocks are fully compatible — no changes needed.
