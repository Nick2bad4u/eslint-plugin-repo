# require-forgejo-actions-workflow-file

Require at least one Forgejo or Codeberg Actions workflow file.

## Targeted pattern scope

This rule checks `.forgejo/workflows/` for at least one workflow file with an
accepted extension:

- `.yml`
- `.yaml`

## What this rule reports

This rule reports repositories that enable Codeberg or Forgejo-oriented presets
without any workflow files under `.forgejo/workflows/`.

## Why this rule exists

Forgejo and Codeberg workflow policy only matters when the repository actually
declares workflows.

This rule enforces the baseline expectation that a Forgejo/Codeberg repository
using those presets has at least one workflow entry point for CI or governance
automation.

## ❌ Incorrect

```ts
// Repository files
// .
// ├── README.md
// ├── package.json
// └── .forgejo/
//
// Missing: .forgejo/workflows/*.yml or *.yaml
```

## ✅ Correct

```ts
// Repository files
// .
// └── .forgejo/
//     └── workflows/
//         └── ci.yml
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.codeberg,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-forgejo-actions-workflow-file": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if the repository does not use Forgejo or Codeberg
Actions for automation.

> **Rule catalog ID:** R016

## Further reading

- [Forgejo Actions documentation](https://forgejo.org/docs/latest/user/actions/)
