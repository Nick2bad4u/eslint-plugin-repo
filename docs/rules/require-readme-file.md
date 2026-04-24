# require-readme-file

Require a root-level README for the repository.

## Targeted pattern scope

This rule checks the repository root for a primary README document.

The rule accepts either of these files:

- `README.md`
- `README`

## What this rule reports

This rule reports repositories that do not provide any accepted README file at
the root.

## Why this rule exists

A repository without a README forces contributors, users, and maintainers to
guess basic project context.

Even a short README gives reviewers and automation consumers a stable place to
find:

- project purpose
- setup or usage notes
- contribution expectations
- links to deeper documentation

## ❌ Incorrect

```ts
// Repository files
// .
// ├── eslint.config.mjs
// ├── package.json
// └── src/
//
// Missing: README.md or README
```

## ✅ Correct

```ts
// Repository files
// .
// ├── README.md
// ├── eslint.config.mjs
// └── package.json
```

```ts
// Repository files
// .
// ├── README
// ├── eslint.config.mjs
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
      "repo-compliance/require-readme-file": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if the repository is intentionally private, ephemeral,
or generated and you do not want a root-level landing document.

> **Rule catalog ID:** R001

## Further reading

- [GitHub Docs: About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)
- [GitLab Docs: README and project documentation basics](https://docs.gitlab.com/user/project/repository/files/#readme-and-index-files)
