---
title: Node preset
---

# 🟢 Node

Use `repoPlugin.configs.node` for Node.js runtime version pinning repository compliance requirements.

## Provider documentation

- [Node.js release schedule](https://nodejs.org/en/about/previous-releases)
- [nvm: `.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc)
- [nodenv `.node-version` usage](https://github.com/nodenv/nodenv#choosing-the-node-version)

## Rules in this preset

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only

| Rule | Fix |
| --- | :-: |
| [`require-node-version-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-node-version-file) | — |
| [`require-nvmrc-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-nvmrc-file) | — |
