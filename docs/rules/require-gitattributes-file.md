# require-gitattributes-file

Require a `.gitattributes` file in the repository root.

## Targeted pattern scope

This rule checks the repository root for the presence of a `.gitattributes` file.

## What this rule reports

This rule reports when no `.gitattributes` file is found.

## Why this rule exists

A `.gitattributes` file controls how Git handles line endings, merge strategies,
diffs, binary detection, and export content. Without it, contributors on different
operating systems may silently corrupt line endings in text files, binary files may
be diffed as text, and `git archive` outputs may include development-only files.
Establishing a `.gitattributes` file early avoids difficult cross-platform inconsistencies.

## ❌ Incorrect

<!-- No .gitattributes file at repository root -->

```txt
.github/
src/
README.md
package.json
```

## ✅ Correct

```txt
.gitattributes   ← present at root
.github/
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
      "repo-compliance/require-gitattributes-file": "warn",
    },
  },
];
```

## When not to use it

Disable this rule if your repository intentionally delegates line-ending normalisation and
binary handling entirely to host-level git configuration or tool defaults.

> **Rule catalog ID:** R037

## Further reading

- [gitattributes documentation](https://git-scm.com/docs/gitattributes)
- [GitHub: Dealing with line endings](https://docs.github.com/en/get-started/getting-started-with-git/configuring-git-to-handle-line-endings)
