# require-gitlab-merge-request-template-file

Require at least one GitLab merge request template.

## Targeted pattern scope

This rule checks `.gitlab/merge_request_templates/` for at least one Markdown
file.

Accepted files must match:

- `.gitlab/merge_request_templates/*.md`

## What this rule reports

This rule reports repositories that enable GitLab-oriented presets without any
merge request template files.

## Why this rule exists

Merge request templates standardize the context reviewers need before they can
approve or safely deploy a change.

That usually means better rollout notes, clearer testing evidence, and fewer
review cycles spent pulling basic context out of authors.

## ❌ Incorrect

```ts
// Repository files
// .
// ├── .gitlab-ci.yml
// ├── README.md
// └── .gitlab/
//     └── issue_templates/
//
// Missing: .gitlab/merge_request_templates/*.md
```

## ✅ Correct

```ts
// Repository files
// .
// └── .gitlab/
//     └── merge_request_templates/
//         └── default.md
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.gitlab,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-gitlab-merge-request-template-file": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if your GitLab workflow intentionally avoids merge
request templates or uses a different review intake system.

> **Rule catalog ID:** R014

## Further reading

- [GitLab Docs: Description templates](https://docs.gitlab.com/user/project/description_templates/)
