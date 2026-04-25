# require-readme-badges

Require at least one status badge in the README file.

## Targeted pattern scope

This rule reads `README.md`, `README`, `readme.md`, or `README.rst` and checks
whether the file contains an inline image link pointing to an `https://` URL,
which is the standard Markdown syntax for badges (e.g. `![CI](https://...)`).

## What this rule reports

This rule reports when the README does not contain any recognisable badge.

## Why this rule exists

Badges provide at-a-glance health signals for a repository: build status, test
coverage, current version, license, and dependency freshness. They are especially
important for open-source projects because contributors and potential adopters rely
on them to quickly assess project health without reading through CI configuration.
A README without any badges is harder to evaluate at a glance.

## ❌ Incorrect

```markdown
# my-library

A useful library with no visual health indicators.

## Installation

`npm install my-library`
```

## ✅ Correct

```markdown
# my-library

[![CI](https://github.com/owner/repo/actions/workflows/ci.yml/badge.svg)](https://github.com/owner/repo/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/my-library)](https://www.npmjs.com/package/my-library)

A useful library.
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.all,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-readme-badges": "warn",
    },
  },
];
```

## When not to use it

Disable this rule if your project is internal or private and does not expose
public CI/badge services, or if your project intentionally keeps the README minimal.

> **Rule catalog ID:** R049

## Further reading

- [Shields.io badge generator](https://shields.io/)
- [GitHub Actions status badges](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/adding-a-workflow-status-badge)
