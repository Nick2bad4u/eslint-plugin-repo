# require-security-policy-file

Require `SECURITY.md` for vulnerability disclosure guidance.

## Targeted pattern scope

This rule checks the repository root for `SECURITY.md`.

## What this rule reports

This rule reports repositories that do not publish a security policy.

## Why this rule exists

Security researchers and users need a clear disclosure path when they find a
vulnerability.

Without a security policy, reports often end up in public issues or disappear
into the wrong channel, increasing exposure and slowing triage.

## ❌ Incorrect

```ts
// Repository files
// .
// ├── README.md
// ├── package.json
// └── src/
//
// Missing: SECURITY.md
```

## ✅ Correct

```ts
// Repository files
// .
// ├── SECURITY.md
// ├── README.md
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
      "repo-compliance/require-security-policy-file": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if the repository is not software-facing or disclosure
handling is intentionally centralized in a way users can already discover.

> **Rule catalog ID:** R005

## Further reading

- [GitHub Docs: Adding a security policy to your repository](https://docs.github.com/en/code-security/getting-started/adding-a-security-policy-to-your-repository)
