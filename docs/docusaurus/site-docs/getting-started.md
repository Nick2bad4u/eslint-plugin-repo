---
sidebar_position: 2
---

# Getting Started

Install the plugin:

```bash
npm install --save-dev eslint-plugin-repo
```

Then enable it in your Flat Config:

```ts
import plugin from "eslint-plugin-repo";

export default [plugin.configs.recommended];
```

## Recommended approach

- Start with `plugin.configs.recommended`.
- Add provider presets (`github`, `gitlab`, `bitbucket`, `codeberg`) as needed.
- Use `plugin.configs.strict` for stronger policy coverage.

## Rule navigation

Use the sidebar **Rules** section for the full list of rule docs.
