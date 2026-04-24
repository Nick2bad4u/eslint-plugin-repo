# require-forgejo-actions-no-write-all-permissions

> **Rule catalog ID:** R078

Require Forgejo Actions workflows to avoid `permissions: write-all`.

## Targeted pattern scope

This rule scans `.forgejo/workflows/*.{yml,yaml}` and checks workflow/job permission declarations.

## What this rule reports

This rule reports workflow files containing `permissions: write-all` at any level.

## Why this rule exists

Forgejo workflow permissions support broad scopes, and `write-all` grants excessive access. Least-privilege scoped permissions reduce security risk.

## ❌ Incorrect

```ts
name: CI
on:
  push:
    branches:
      - main
permissions: write-all
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
permissions:
  contents: read
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
      "repo-compliance/require-forgejo-actions-no-write-all-permissions": "warn",
    },
  },
];
```

## When not to use it

Disable this rule only if a trusted workflow genuinely requires unrestricted write permissions.

## Further reading

- [Forgejo Actions docs](https://forgejo.org/docs/latest/user/actions/)