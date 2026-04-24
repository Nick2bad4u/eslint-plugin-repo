# require-issue-template-file

Require at least one issue template for structured reports.

## Targeted pattern scope

This rule checks for repository issue templates in the GitHub-style issue
template directory.

Accepted files must exist under:

- `.github/ISSUE_TEMPLATE/*.md`
- `.github/ISSUE_TEMPLATE/*.yml`
- `.github/ISSUE_TEMPLATE/*.yaml`

## What this rule reports

This rule reports repositories that do not provide any accepted issue template
files.

## Why this rule exists

Issue templates improve report quality by prompting users for the details your
team actually needs to triage work.

That usually means fewer low-context bug reports and less back-and-forth before
someone can act on an issue.

## ❌ Incorrect

```ts
// Repository files
// .
// ├── README.md
// ├── package.json
// └── .github/
//     └── workflows/
//
// Missing: .github/ISSUE_TEMPLATE/*.md|*.yml|*.yaml
```

## ✅ Correct

```ts
// Repository files
// .
// └── .github/
//     └── ISSUE_TEMPLATE/
//         └── bug-report.yml
```

```ts
// Repository files
// .
// └── .github/
//     └── ISSUE_TEMPLATE/
//         └── feature-request.md
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.strict,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-issue-template-file": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if your repository intentionally accepts free-form issue
creation or uses an external intake system instead of repository issue
templates.

> **Rule catalog ID:** R008

## Further reading

- [GitHub Docs: Configuring issue templates for your repository](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository)
