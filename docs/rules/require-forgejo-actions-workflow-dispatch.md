# require-forgejo-actions-workflow-dispatch

Require Forgejo Actions workflows to declare a `workflow_dispatch` trigger.

## Targeted pattern scope

This rule scans `.forgejo/workflows/*.{yml,yaml}` and requires each workflow to include the `workflow_dispatch` event.

## What this rule reports

This rule reports Forgejo workflow files that do not include `workflow_dispatch`.

## Why this rule exists

Forgejo Actions supports manual workflow execution via `workflow_dispatch`. Requiring it keeps maintenance and recovery workflows runnable without forcing commit-based triggers.

## ❌ Incorrect

```ts
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

```ts
name: CI
on:
  push:
    branches:
      - main
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
      "repo-compliance/require-forgejo-actions-workflow-dispatch": "warn",
    },
  },
];
```

## When not to use it

Disable this rule only if your Forgejo repository intentionally disallows manual workflow execution.

> **Rule catalog ID:** R076

## Further reading

- [Forgejo Actions: workflow syntax](https://forgejo.org/docs/latest/user/actions/)
