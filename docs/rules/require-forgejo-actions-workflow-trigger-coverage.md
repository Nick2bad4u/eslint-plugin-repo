# require-forgejo-actions-workflow-trigger-coverage

Require at least one `push:` or `pull_request:` trigger in every Forgejo Actions workflow.

## Targeted pattern scope

This rule scans `.forgejo/workflows/*.{yml,yaml}` and requires each workflow file
to include at least one `push:` or `pull_request:` trigger in its `on:` block.

## What this rule reports

This rule reports Forgejo workflow files that contain no `push:` or `pull_request:`
trigger.

## Why this rule exists

A workflow without `push` or `pull_request` triggers does not provide continuous
integration feedback on code changes. Such workflows may only run on schedules,
manual dispatch, or external events — meaning that broken code can be merged without
any automated CI signal. Requiring at least one code-change trigger ensures the
repository has basic CI coverage for every contribution.

## ❌ Incorrect

```yaml
# Workflow only runs on schedule — no push/PR trigger
name: Weekly audit
on:
  schedule:
    - cron: "0 0 * * 1"
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - run: npm audit
```

## ✅ Correct

```yaml
# Workflow runs on both push and manual trigger
name: CI
on:
  push:
    branches:
      - main
  pull_request:
  workflow_dispatch:
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.codeberg,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-forgejo-actions-workflow-trigger-coverage": "warn",
    },
  },
];
```

## When not to use it

Disable this rule for utility workflows that are intentionally triggered only by
schedule, `workflow_dispatch`, or external webhooks, and where push/PR triggers
would be inappropriate (e.g., periodic maintenance scripts, deployment-only workflows).

> **Rule catalog ID:** R061

## Further reading

- [Forgejo Actions: workflow syntax](https://forgejo.org/docs/latest/user/actions/)
- [GitHub Actions: Events that trigger workflows](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows)
