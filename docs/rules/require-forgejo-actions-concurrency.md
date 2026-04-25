# require-forgejo-actions-concurrency

Require a `concurrency:` key in all Forgejo Actions workflow files.

## Targeted pattern scope

This rule scans `.forgejo/workflows/*.{yml,yaml}` and requires each workflow file
to contain a top-level `concurrency:` key.

## What this rule reports

This rule reports Forgejo workflow files that do not include a `concurrency:` block.

## Why this rule exists

Without `concurrency` control, pushing multiple commits in quick succession will
queue up a new pipeline run for each push, even when earlier runs are no longer
relevant. This wastes CI minutes and can produce confusing interleaved status
updates. A `concurrency` block with `cancel-in-progress: true` ensures that only
the latest run continues when a new commit supersedes a prior one.

## ❌ Incorrect

```yaml
name: CI
on:
  push:
    branches:
      - main
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
```

## ✅ Correct

```yaml
name: CI
on:
  push:
    branches:
      - main
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
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
      "repo-compliance/require-forgejo-actions-concurrency": "warn",
    },
  },
];
```

## When not to use it

Disable this rule for workflows where concurrent runs are intentional — for example,
scheduled jobs that should not cancel each other, or release workflows where only
one run is typically active at a time and cancellation would be destructive.

> **Rule catalog ID:** R060

## Further reading

- [Forgejo Actions: workflow syntax](https://forgejo.org/docs/latest/user/actions/)
- [GitHub Actions: Using concurrency](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/control-the-concurrency-of-workflows-and-jobs)
