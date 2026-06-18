# require-nvmrc-file

Require a `.nvmrc` file in repositories.

## Targeted pattern scope

This rule checks the repository root for `.nvmrc`.

## What this rule reports

This rule reports when `.nvmrc` is missing from the repository root.

## Why this rule exists

Teams that rely on `nvm` typically use `.nvmrc` as the canonical Node.js version pin.
Without it, local development, CI runners, and release tooling can silently run
on different Node.js versions and produce inconsistent behavior.

## ❌ Incorrect

```json
// .nvmrc is missing from the repository root
```

## ✅ Correct

```txt
// .nvmrc contains the pinned Node.js version
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
   "repo-compliance/require-nvmrc-file": "warn",
  },
 },
];
```

## When not to use it

Disable this rule if your project intentionally standardizes on `.node-version`
instead and you enforce that in
[`require-node-version-file`](./require-node-version-file.md).

> **Rule catalog ID:** R040

## Further reading

- [nvm: `.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc)
- [fnm: version files](https://github.com/Schniz/fnm#fnmrc)
- [Node.js release schedule](https://nodejs.org/en/about/previous-releases)
