# require-gitlab-ci-config-file

Require `.gitlab-ci.yml` for GitLab CI automation.

## Targeted pattern scope

This rule checks the repository root for `.gitlab-ci.yml`.

## What this rule reports

This rule reports repositories that enable GitLab-oriented presets without a
GitLab CI pipeline definition.

## Why this rule exists

GitLab CI features depend on a root pipeline configuration file.

Without `.gitlab-ci.yml`, later GitLab-specific rules about stages, workflow
rules, or security scanning cannot describe an actual pipeline baseline.

## ❌ Incorrect

```ts
// Repository files
// .
// ├── README.md
// ├── package.json
// └── src/
//
// Missing: .gitlab-ci.yml
```

## ✅ Correct

```ts
// Repository files
// .
// ├── .gitlab-ci.yml
// ├── README.md
// └── package.json
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.gitlab,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-gitlab-ci-config-file": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if the repository does not use GitLab CI at all.

> **Rule catalog ID:** R012

## Further reading

- [GitLab Docs: CI/CD YAML syntax reference](https://docs.gitlab.com/ci/yaml/)
