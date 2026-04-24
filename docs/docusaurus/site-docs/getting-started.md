---
sidebar_position: 2
---

# Getting Started

`eslint-plugin-repo` is easiest to adopt when you treat it as a **preset-first repository policy layer**, not a giant bundle of rules you enable all at once.

Install the plugin:

```bash
npm install --save-dev eslint-plugin-repo
```

Then enable it in your Flat Config:

```ts
import plugin from "eslint-plugin-repo";

export default [plugin.configs.recommended];
```

\:::tip Recommended rollout

Start with `plugin.configs.recommended`, validate the baseline, then add the single provider preset that matches the host for the repository you are linting.

\:::

## Quick start path

1. Install `eslint-plugin-repo`.
2. Enable `plugin.configs.recommended`.
3. Add one provider preset (`github`, `gitlab`, `bitbucket`, or `codeberg`).
4. Run linting and clean up the baseline.
5. Consider `plugin.configs.strict` only after the initial migration settles.

## Layer presets intentionally

Use presets as a progression rather than enabling everything at once:

```ts
import plugin from "eslint-plugin-repo";

export default [
    plugin.configs.recommended,
    plugin.configs.github,
    // Add `plugin.configs.strict` once the baseline is stable.
];
```

Start with one provider preset (`github`, `gitlab`, `bitbucket`, or `codeberg`) that matches your repository host.

## Preset selection guide

| Situation                                                         | Suggested config                                          |
| ----------------------------------------------------------------- | --------------------------------------------------------- |
| You want a low-friction baseline                                  | `plugin.configs.recommended`                              |
| Your repository is hosted on GitHub                               | `plugin.configs.recommended` + `plugin.configs.github`    |
| Your repository is hosted on GitLab                               | `plugin.configs.recommended` + `plugin.configs.gitlab`    |
| Your repository is hosted on Bitbucket                            | `plugin.configs.recommended` + `plugin.configs.bitbucket` |
| Your repository is hosted on Codeberg / Forgejo                   | `plugin.configs.recommended` + `plugin.configs.codeberg`  |
| Your baseline is already stable and you want stronger enforcement | Add `plugin.configs.strict`                               |

## Recommended approach

- Start with `plugin.configs.recommended`.
- Add provider presets (`github`, `gitlab`, `bitbucket`, `codeberg`) as needed.
- Use `plugin.configs.strict` for stronger policy coverage.

## Validate the first adoption

After enabling the preset stack, run your normal lint workflow and inspect the rule docs for anything noisy before broadening coverage.

Helpful next reads:

- [Rule Overview](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/overview)
- [Presets](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets)
- [Developer Guide](./developer/index.md) if you are working on the plugin itself

## Rule navigation

Use the sidebar **Rules** section for the full list of rule docs.

## Troubleshooting

- If typed rules are unexpectedly disabled, verify your project’s `typescript-eslint` parser setup.
- If your team uses multiple repository hosts, combine provider presets in separate config blocks and scope them with `files` patterns where needed.
- If migration feels noisy, start in warning mode and ratchet critical rules to error over time.
