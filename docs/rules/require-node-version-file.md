# require-node-version-file

Require a `.node-version` file in Node.js projects.

## Targeted pattern scope

This rule checks the repository root for `.node-version`.

## What this rule reports

This rule reports when `.node-version` is missing from the repository root.

## Why this rule exists

Different Node.js versions can silently change runtime behaviour. Without a pinned
version file, developers, CI runners, and containerised builds may each use a
different Node.js version, leading to hard-to-reproduce bugs. `.node-version` is
widely supported by version managers and CI setup tooling.

## ❌ Incorrect

```json
// .node-version is missing from the repository root
```

## ✅ Correct

```txt
// .node-version contains the pinned version
20.11.1
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
 repoPlugin.configs.node,
 {
  plugins: { "repo-compliance": repoPlugin },
  rules: {
   "repo-compliance/require-node-version-file": "warn",
  },
 },
];
```

## When not to use it

Disable this rule if your project intentionally standardizes on `.nvmrc` only and
you enforce that in a separate check (for example
[`require-nvmrc-file`](./require-nvmrc-file.md)).

> **Rule catalog ID:** R039

## Further reading

- [nvm: `.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc)
- [fnm: version files](https://github.com/Schniz/fnm#fnmrc)
- [`.node-version` format](https://github.com/nodenv/nodenv#choosing-the-node-version)
