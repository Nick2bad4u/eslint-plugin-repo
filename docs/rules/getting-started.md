---
title: Getting Started
description: Add repository compliance linting to your Flat Config.
---

# Getting Started

Install the plugin:

```bash
npm install --save-dev eslint-plugin-repo-compliance typescript
```

Enable a preset:

```js
import plugin from "eslint-plugin-repo-compliance";

export default [plugin.configs.recommended];
```

## Provider-specific presets

- `plugin.configs.github`
- `plugin.configs.gitlab`
- `plugin.configs.bitbucket`
- `plugin.configs.codeberg`

Use `plugin.configs.strict` for stronger baseline policy and `plugin.configs.all` to apply every rule.