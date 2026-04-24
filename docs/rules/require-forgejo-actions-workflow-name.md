# require-forgejo-actions-workflow-name

Require explicit top-level `name` in Forgejo workflow files.

## Targeted pattern scope

This rule scans `.forgejo/workflows/*.{yml,yaml}` and checks for a root-level `name:` key.

## What this rule reports

This rule reports Forgejo workflow files that omit an explicit top-level `name`.

## Why this rule exists

Forgejo workflow syntax supports a workflow `name` key. Explicit names improve workflow run readability and operational clarity in CI interfaces and logs.

## ❌ Incorrect

```ts
on:
  push:
jobs:
  test:
    runs-on: docker
    steps:
      - run: echo test
```

## ✅ Correct

```ts
name: CI
on:
  push:
jobs:
  test:
    runs-on: docker
    steps:
      - run: echo test
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.codeberg,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-forgejo-actions-workflow-name": "warn",
    },
  },
];
```

## When not to use it

Disable this rule only if your team intentionally relies on unnamed workflow files and accepts reduced readability.

> **Rule catalog ID:** R036

## Further reading

- [Forgejo Actions basic concepts](https://forgejo.org/docs/v11.0/user/actions/basic-concepts)
- [Forgejo Actions workflow syntax reference](https://forgejo.org/docs/next/user/actions/reference/)
