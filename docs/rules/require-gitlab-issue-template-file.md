# require-gitlab-issue-template-file

Require at least one GitLab issue template.

## Targeted pattern scope

This rule checks `.gitlab/issue_templates/` for at least one Markdown file.

Accepted files must match:

- `.gitlab/issue_templates/*.md`

## What this rule reports

This rule reports repositories that enable GitLab-oriented presets without any
GitLab issue template files.

## Why this rule exists

Issue templates help GitLab repositories collect consistent problem statements,
reproduction details, and request context.

That makes triage more predictable and reduces the amount of manual follow-up
needed before an issue becomes actionable.

## ❌ Incorrect

```ts
// Repository files
// .
// ├── .gitlab-ci.yml
// ├── README.md
// └── .gitlab/
//     └── merge_request_templates/
//
// Missing: .gitlab/issue_templates/*.md
```

## ✅ Correct

```ts
// Repository files
// .
// └── .gitlab/
//     └── issue_templates/
//         └── bug.md
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.gitlab,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-gitlab-issue-template-file": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if your GitLab project intentionally accepts free-form
issue creation or uses a separate intake workflow.

> **Rule catalog ID:** R013

## Further reading

- [GitLab Docs: Description templates](https://docs.gitlab.com/user/project/description_templates/)
