# require-node-version-file

Require a Node.js version pin file (`.nvmrc` or `.node-version`) in Node.js projects.

## Targeted pattern scope

This rule is triggered only when a `package.json` file is present, confirming the
repository is a Node.js project. It then checks the root for either `.nvmrc`
or `.node-version`.

## What this rule reports

This rule reports when a `package.json` is present but no Node.js version pin file
(`.nvmrc` or `.node-version`) is found in the repository root.

## Why this rule exists

Different Node.js versions can silently change runtime behaviour. Without a version
pin file, developers, CI runners, and containerised builds may each use a different
Node.js version, leading to hard-to-reproduce bugs. Tools like `nvm`, `fnm`, `asdf`,
`volta`, and CI version-setup actions all respect `.nvmrc` or `.node-version` to
guarantee consistent execution environments.

## ❌ Incorrect

```json
// package.json present but no .nvmrc or .node-version at root
{
  "name": "my-project"
}
```

## ✅ Correct

```txt
// .nvmrc contains the pinned version
20.11.1
```

Or alternatively:

```txt
// .node-version contains the pinned version
20.11.1
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.strict,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-node-version-file": "warn",
    },
  },
];
```

## When not to use it

Disable this rule if your project manages Node.js versions through another mechanism
(e.g. `engines` field in `package.json` combined with enforced tooling like `volta`),
or if the project deliberately supports a wide range of Node.js versions without pinning.

> **Rule catalog ID:** R039

## Further reading

- [nvm: `.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc)
- [fnm: version files](https://github.com/Schniz/fnm#fnmrc)
- [`.node-version` format](https://github.com/nodenv/nodenv#choosing-the-node-version)
