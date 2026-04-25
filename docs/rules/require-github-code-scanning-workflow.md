# require-github-code-scanning-workflow

Require a GitHub Actions code scanning workflow file.

## Targeted pattern scope

This rule checks `.github/workflows/` for the presence of at least one file matching
recognised GitHub code scanning workflow naming conventions: `codeql.yml`,
`codeql.yaml`, `codeql-analysis.yml`, `codeql-analysis.yaml`,
`code-scanning.yml`, `code-scanning.yaml`, `security-analysis.yml`, or
`security-analysis.yaml`.

## What this rule reports

This rule reports when none of the recognised GitHub code scanning workflow
filenames is present in `.github/workflows/`.

## Why this rule exists

GitHub code scanning workflows such as CodeQL catch security vulnerabilities
and code quality issues before they reach production. A dedicated workflow makes
that automation visible in the repository and easier to audit. Without it,
repositories often rely on ad-hoc or undocumented scanning.

## ❌ Incorrect

```txt
// No code scanning workflow found
.github/
  workflows/
    ci.yml
    release.yml
```

## ✅ Correct

```txt
.github/
  workflows/
    codeql.yml     ← a recognised code scanning workflow name
    ci.yml
    release.yml
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.github,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-github-code-scanning-workflow": "warn",
    },
  },
];
```

## When not to use it

Disable this rule if your repository:

- Uses a different naming convention for its code scanning workflow.
- Relies on organisation-level SAST tooling that runs outside this repository.
- Is intentionally excluded from automated static analysis (e.g., documentation-only repos).

> **Rule catalog ID:** R043

## Further reading

- [GitHub Docs: About code scanning with CodeQL](https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql)
- [CodeQL action](https://github.com/github/codeql-action)
