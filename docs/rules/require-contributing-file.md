# require-contributing-file

Require `CONTRIBUTING.md` at the repository root.

## Targeted pattern scope

This rule checks the repository root for `CONTRIBUTING.md`.

## What this rule reports

This rule reports repositories that do not publish a contribution guide.

## Why this rule exists

Without contribution guidelines, every pull request has to rediscover the same
process expectations.

A `CONTRIBUTING.md` file gives contributors one place to find:

- local setup steps
- branch and pull request expectations
- coding standards
- testing and review workflow

## ❌ Incorrect

```ts
// Repository files
// .
// ├── README.md
// ├── package.json
// └── src/
//
// Missing: CONTRIBUTING.md
```

## ✅ Correct

```ts
// Repository files
// .
// ├── CONTRIBUTING.md
// ├── README.md
// └── package.json
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.recommended,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-contributing-file": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if the repository is not open to contributions or your
organization intentionally centralizes contribution policy outside the repo.

> **Rule catalog ID:** R003

## Further reading

- [GitHub Docs: Setting guidelines for repository contributors](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors)
