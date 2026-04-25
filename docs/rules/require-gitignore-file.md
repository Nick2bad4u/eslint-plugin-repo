# require-gitignore-file

Require a `.gitignore` file in the repository root.

## Targeted pattern scope

This rule checks the repository root for the presence of a `.gitignore` file.

## What this rule reports

This rule reports when no `.gitignore` file is found.

## Why this rule exists

Without a `.gitignore` file, build artefacts, dependency directories (`node_modules/`),
editor configuration, operating-system metadata (e.g. `.DS_Store`), and secrets
(`.env`) are routinely committed to version control by accident. A `.gitignore` file
is the most fundamental safeguard against repository pollution and accidental secret
exposure.

## ❌ Incorrect

<!-- No .gitignore file at repository root -->

```txt
src/
README.md
package.json
```

## ✅ Correct

```txt
.gitignore   ← present at root
src/
README.md
package.json
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.recommended,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-gitignore-file": "warn",
    },
  },
];
```

## When not to use it

Disable this rule only if your repository intentionally tracks all files or uses
a global gitignore (`~/.config/git/ignore`) for exclusion and team-wide enforcement
is handled outside the repository.

> **Rule catalog ID:** R038

## Further reading

- [Git: gitignore](https://git-scm.com/docs/gitignore)
- [GitHub gitignore templates](https://github.com/github/gitignore)
