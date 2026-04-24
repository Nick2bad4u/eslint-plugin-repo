# require-pull-request-template-file

Require a pull request or merge request template for consistent review context.

## Targeted pattern scope

This rule checks for at least one accepted review-template location.

Any one of these satisfies the rule:

- `.github/pull_request_template.md`
- `PULL_REQUEST_TEMPLATE.md`
- `docs/PULL_REQUEST_TEMPLATE.md`
- `.gitlab/merge_request_templates/default.md`
- any Markdown file in `.github/PULL_REQUEST_TEMPLATE/`

## What this rule reports

This rule reports repositories that do not provide any accepted pull request or
merge request template.

## Why this rule exists

Review quality drops when every author has to invent their own PR structure.

Templates help teams standardize:

- change summaries
- rollout notes
- testing evidence
- reviewer checklists

## ❌ Incorrect

```ts
// Repository files
// .
// ├── README.md
// ├── package.json
// └── .github/
//     └── workflows/
//
// Missing any accepted PR/MR template file
```

## ✅ Correct

```ts
// Repository files
// .
// ├── PULL_REQUEST_TEMPLATE.md
// ├── README.md
// └── package.json
```

```ts
// Repository files
// .
// └── .github/
//     └── PULL_REQUEST_TEMPLATE/
//         └── default.md
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.strict,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-pull-request-template-file": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if your repository uses a different review intake system
and intentionally does not rely on repository-local PR or MR templates.

> **Rule catalog ID:** R009

## Further reading

- [GitHub Docs: Creating a pull request template for your repository](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository)
- [GitLab Docs: Description templates](https://docs.gitlab.com/user/project/description_templates/)
