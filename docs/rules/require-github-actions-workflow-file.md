# require-github-actions-workflow-file

Require at least one GitHub Actions workflow file.

## Targeted pattern scope

This rule checks `.github/workflows/` for at least one workflow file with an
accepted extension:

- `.yml`
- `.yaml`

## What this rule reports

This rule reports repositories that enable GitHub-oriented presets without any
workflow files under `.github/workflows/`.

## Why this rule exists

If a repository adopts GitHub-focused policy checks but has no workflows at all,
that usually means intended automation was never actually declared.

This rule enforces the minimum expectation that GitHub CI or governance has a
workflow entry point.

## ❌ Incorrect

```ts
// Repository files
// .
// ├── .github/
// │   └── dependabot.yml
// ├── README.md
// └── package.json
//
// Missing: .github/workflows/*.yml or *.yaml
```

## ✅ Correct

```ts
// Repository files
// .
// └── .github/
//     └── workflows/
//         └── ci.yml
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.github,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-github-actions-workflow-file": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if the repository is hosted on GitHub but deliberately
does not use GitHub Actions for any automation.

> **Rule catalog ID:** R011

## Further reading

- [GitHub Docs: Understanding GitHub Actions](https://docs.github.com/en/actions/about-github-actions/understanding-github-actions)
- [GitHub Docs: Workflow syntax for GitHub Actions](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions)
