# require-dependabot-config-file

Require `.github/dependabot.yml` for automated dependency updates on GitHub.

## Targeted pattern scope

This rule checks for `.github/dependabot.yml`.

## What this rule reports

This rule reports repositories that enable GitHub-oriented presets without a
Dependabot configuration file.

## Why this rule exists

Dependabot cannot manage dependency update cadence or security patch pull
requests unless the repository declares update policy explicitly.

That makes `.github/dependabot.yml` the baseline contract for predictable
dependency maintenance on GitHub.

## ❌ Incorrect

```ts
// Repository files
// .
// ├── .github/
// │   └── workflows/
// ├── README.md
// └── package.json
//
// Missing: .github/dependabot.yml
```

## ✅ Correct

```ts
// Repository files
// .
// └── .github/
//     ├── dependabot.yml
//     └── workflows/
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.github,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-dependabot-config-file": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if the repository intentionally does not use Dependabot
for dependency management on GitHub.

> **Rule catalog ID:** R010

## Further reading

- [GitHub Docs: Configuring Dependabot version updates](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
