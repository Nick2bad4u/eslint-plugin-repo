---
title: Docker preset
---

# 🐳 Docker

Use `repoPlugin.configs.docker` for Docker packaging repository compliance requirements.

## Provider documentation

- [Dockerfile reference](https://docs.docker.com/reference/dockerfile/)
- [`.dockerignore` reference](https://docs.docker.com/build/concepts/context/#dockerignore-files)

## Rules in this preset

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only

| Rule | Fix |
| --- | :-: |
| [`require-dockerfile`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile) | — |
| [`require-dockerfile-base-image-tag`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-base-image-tag) | — |
| [`require-dockerfile-cmd-or-entrypoint`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-cmd-or-entrypoint) | — |
| [`require-dockerfile-first-instruction-from`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-first-instruction-from) | — |
| [`require-dockerfile-from-instruction`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-from-instruction) | — |
| [`require-dockerfile-user`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-user) | — |
| [`require-dockerfile-workdir`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-workdir) | — |
| [`require-dockerignore-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerignore-file) | — |
