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
import repoPlugin from "eslint-plugin-repo";

export default [repoPlugin.configs.recommended];
```

\:::tip Recommended rollout

Start with `repoPlugin.configs.recommended`, validate the baseline, then add the single provider preset that matches the host for the repository you are linting.

\:::

## Quick start path

1. Install `eslint-plugin-repo`.
2. Enable `repoPlugin.configs.recommended`.
3. Add one provider preset (`github`, `gitlab`, `bitbucket`, or `codeberg`).
4. Run linting and clean up the baseline.
5. Consider `repoPlugin.configs.strict` only after the initial migration settles.

Helpful references while you do this:

- [Rules overview](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/overview)
- [Presets reference](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets)
- [Strict preset](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict)

## Layer presets intentionally

Use presets as a progression rather than enabling everything at once:

```ts
import repoPlugin from "eslint-plugin-repo";

export default [
    repoPlugin.configs.recommended,
    repoPlugin.configs.github,
    // Add `repoPlugin.configs.strict` once the baseline is stable.
];
```

Start with one provider preset (`github`, `gitlab`, `bitbucket`, or `codeberg`) that matches your repository host.

## Preset selection guide

| Situation                                                         | Suggested config                                                  |
| ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| You want a low-friction baseline                                  | `repoPlugin.configs.recommended`                                  |
| Your repository is hosted on GitHub                               | `repoPlugin.configs.recommended` + `repoPlugin.configs.github`    |
| Your repository is hosted on GitLab                               | `repoPlugin.configs.recommended` + `repoPlugin.configs.gitlab`    |
| Your repository is hosted on Bitbucket                            | `repoPlugin.configs.recommended` + `repoPlugin.configs.bitbucket` |
| Your repository is hosted on Codeberg / Forgejo                   | `repoPlugin.configs.recommended` + `repoPlugin.configs.codeberg`  |
| Your baseline is already stable and you want stronger enforcement | Add `repoPlugin.configs.strict`                                   |

## Recommended approach

- Start with `repoPlugin.configs.recommended`.
- Add provider presets (`github`, `gitlab`, `bitbucket`, `codeberg`) as needed.
- Use `repoPlugin.configs.strict` for stronger policy coverage.

Use this baseline snippet everywhere:

```ts
import repoPlugin from "eslint-plugin-repo";

export default [repoPlugin.configs.recommended];
```

## Validate the first adoption

After enabling the preset stack, run your normal lint workflow and inspect the rule docs for anything noisy before broadening coverage.

Helpful next reads:

- [Rule Overview](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/overview)
- [Presets](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets)
- [Recommended preset](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/recommended)
- [All preset](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all)
- [Developer Guide](./developer/index.md) if you are working on the plugin itself

## Rule navigation

Use the sidebar **Rules** section for the full list of rule docs.

## Troubleshooting

- If typed rules are unexpectedly disabled, verify your project’s `typescript-eslint` parser setup.
- If your team uses multiple repository hosts, combine provider presets in separate config blocks and scope them with `files` patterns where needed.
- If migration feels noisy, start in warning mode and ratchet critical rules to error over time.
