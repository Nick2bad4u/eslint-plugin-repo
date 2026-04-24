# require-forgejo-actions-job-timeout-minutes

Require explicit `timeout-minutes` for Forgejo workflow jobs.

## Targeted pattern scope

This rule scans `.forgejo/workflows/*.{yml,yaml}` and checks job definitions under `jobs:` for `timeout-minutes`.

It skips reusable workflow jobs declared with `jobs.<job_id>.uses`.

## What this rule reports

This rule reports Forgejo workflow jobs that do not declare `timeout-minutes`.

## Why this rule exists

Forgejo Actions supports `jobs.<job_id>.timeout-minutes`. Explicit timeouts limit the blast radius of stuck runners and reduce long-running accidental CI consumption.

## ❌ Incorrect

```ts
name: CI
on:
  push:
jobs:
  test:
    runs-on: docker
    steps:
      - uses: actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332
```

## ✅ Correct

```ts
name: CI
on:
  push:
jobs:
  test:
    runs-on: docker
    timeout-minutes: 12
    steps:
      - uses: actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.codeberg,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-forgejo-actions-job-timeout-minutes": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if timeout governance is guaranteed externally (for example by generated workflow templates).

> **Rule catalog ID:** R029

## Further reading

- [Forgejo Docs: Actions reference](https://forgejo.org/docs/next/user/actions/reference/)
- [GitHub Docs: Workflow syntax (`jobs.<job_id>.timeout-minutes`)](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idtimeout-minutes)
