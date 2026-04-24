# require-code-of-conduct-file

Require `CODE_OF_CONDUCT.md` for repository interactions.

## Targeted pattern scope

This rule checks the repository root for `CODE_OF_CONDUCT.md`.

## What this rule reports

This rule reports repositories that do not publish a code of conduct.

## Why this rule exists

A code of conduct documents expected behavior and gives community members a
clear path for reporting unacceptable conduct.

That matters for public repositories especially, but it also helps internal
teams set shared expectations consistently.

## ❌ Incorrect

```ts
// Repository files
// .
// ├── CONTRIBUTING.md
// ├── README.md
// └── package.json
//
// Missing: CODE_OF_CONDUCT.md
```

## ✅ Correct

```ts
// Repository files
// .
// ├── CODE_OF_CONDUCT.md
// ├── CONTRIBUTING.md
// └── README.md
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.recommended,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-code-of-conduct-file": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if the repository is strictly private and conduct policy
is managed somewhere else that all contributors already use.

> **Rule catalog ID:** R004

## Further reading

- [GitHub Docs: Adding a code of conduct to your project](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-code-of-conduct-to-your-project)
