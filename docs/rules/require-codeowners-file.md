# require-codeowners-file

Require a `CODEOWNERS` file for deterministic review ownership.

## Targeted pattern scope

This rule checks for a `CODEOWNERS` file in any accepted location:

- `CODEOWNERS`
- `.github/CODEOWNERS`
- `docs/CODEOWNERS`

## What this rule reports

This rule reports repositories that do not define code ownership anywhere in the
accepted locations.

## Why this rule exists

When ownership is implicit, review routing becomes tribal knowledge.

`CODEOWNERS` gives teams a stable, automatable mapping between files and the
people or groups responsible for reviewing them.

## ❌ Incorrect

```ts
// Repository files
// .
// ├── README.md
// ├── SECURITY.md
// └── .github/
//     └── workflows/
//
// Missing: CODEOWNERS in root, .github, or docs
```

## ✅ Correct

```ts
// Repository files
// .
// ├── CODEOWNERS
// ├── README.md
// └── .github/
```

```ts
// Repository files
// .
// ├── README.md
// └── .github/
//     └── CODEOWNERS
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.strict,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-codeowners-file": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if your review ownership model is intentionally manual or
managed through a platform feature that does not rely on `CODEOWNERS`.

> **Rule catalog ID:** R007

## Further reading

- [GitHub Docs: About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [GitLab Docs: Code Owners](https://docs.gitlab.com/user/project/codeowners/)
