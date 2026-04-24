# require-support-file

Require `SUPPORT.md` for support and help channels.

## Targeted pattern scope

This rule checks the repository root for `SUPPORT.md`.

## What this rule reports

This rule reports repositories that do not document where users should ask
questions or request help.

## Why this rule exists

Support requests go sideways fast when users have no clear channel for help.

A `SUPPORT.md` file reduces noise in issue trackers by directing people to the
right place for:

- usage questions
- support boundaries
- escalation paths
- community chat or discussion links

## ❌ Incorrect

```ts
// Repository files
// .
// ├── README.md
// ├── SECURITY.md
// └── package.json
//
// Missing: SUPPORT.md
```

## ✅ Correct

```ts
// Repository files
// .
// ├── README.md
// ├── SECURITY.md
// ├── SUPPORT.md
// └── package.json
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.recommended,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-support-file": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if the repository intentionally does not offer support
or the support channel is already mandated by a broader organization portal.

> **Rule catalog ID:** R006

## Further reading

- [GitHub Docs: Supporting your project](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-support-resource-to-your-project)
