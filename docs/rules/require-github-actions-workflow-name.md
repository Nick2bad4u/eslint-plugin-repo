# require-github-actions-workflow-name

Require explicit top-level `name` in GitHub workflow files.

## Targeted pattern scope

This rule scans `.github/workflows/*.{yml,yaml}` and checks for a root-level `name:` key.

## What this rule reports

This rule reports workflow files that omit an explicit top-level `name`.

## Why this rule exists

GitHub exposes workflow names in Actions UI and contexts. When `name` is omitted, the workflow context falls back to the workflow file path, which is less readable and less stable for reporting.

## ❌ Incorrect

```ts
on:
  push:
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
  repoPlugin.configs.github,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-github-actions-workflow-name": "warn",
    },
  },
];
```

## When not to use it

Disable this rule only if your team intentionally prefers file-path workflow naming and does not need explicit display names.

> **Rule catalog ID:** R034

## Further reading

- [GitHub Docs: Contexts reference (`github.workflow` behavior)](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts)
- [GitHub Docs: Workflow syntax reference](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax)
