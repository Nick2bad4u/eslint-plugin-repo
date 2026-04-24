# require-forgejo-actions-pinned-sha

Require Forgejo workflow `uses:` references to pin third-party actions/workflows to full commit SHAs.

## Targeted pattern scope

This rule scans `.forgejo/workflows/*.{yml,yaml}` and inspects `uses:` references.

It accepts:

- local actions (`uses: ./path/to/action`)
- docker references (`uses: docker://...`)
- third-party actions/workflows pinned to a full 40-character SHA

It reports mutable refs such as tags (`@v4`) and branches (`@main`).

## What this rule reports

This rule reports Forgejo workflow `uses:` entries that are not pinned to immutable full-length commit SHAs.

## Why this rule exists

Forgejo Actions uses the same `uses:` workflow model and supports referencing remote action repositories by Git ref. Mutable refs can move over time. Pinning to full commit SHAs makes workflow dependencies immutable and auditable.

## ❌ Incorrect

```ts
// .forgejo/workflows/ci.yml
name: CI
on:
  push:
jobs:
  test:
    runs-on: docker
    steps:
      - uses: actions/checkout@v4
```

## ✅ Correct

```ts
// .forgejo/workflows/ci.yml
name: CI
on:
  push:
jobs:
  test:
    runs-on: docker
    steps:
      - uses: actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332
```

```ts
// local actions are valid
- uses: ./actions/my-local-action
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.codeberg,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-forgejo-actions-pinned-sha": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if action ref immutability is enforced outside the repository (for example by server-side policy or mirror-controlled action refs).

> **Rule catalog ID:** R026

## Further reading

- [Forgejo Docs: Actions reference](https://forgejo.org/docs/next/user/actions/reference/)
- [Forgejo Docs: Actions and GitHub Actions differences](https://forgejo.org/docs/next/user/actions/github-actions/)

## Adoption resources

- Use with `require-forgejo-actions-workflow-permissions` for stronger Forgejo workflow hardening.
- Start by pinning internet-fetched actions first, then local mirrors.
