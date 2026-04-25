# require-github-issue-template-labels

Require `labels` in GitHub issue template YAML files.

## Targeted pattern scope

This rule reads each `*.yml` / `*.yaml` GitHub issue form file inside
`.github/ISSUE_TEMPLATE/` and checks that the top-level YAML document contains a
`labels:` key. It intentionally ignores `config.yml` / `config.yaml`, which are
GitHub issue template settings files rather than issue forms.

## What this rule reports

This rule reports GitHub issue form files that do not declare a top-level
`labels:` field.

## Why this rule exists

GitHub issue templates with `labels` automatically apply those labels when the
issue is opened, enabling triage automation, board views, and SLA tracking.
Without labels, issues land in a triage backlog with no categorisation, and teams
must manually label every issue — a tedious and error-prone process that leads to
label drift.

## ❌ Incorrect

```yaml
# .github/ISSUE_TEMPLATE/bug_report.yml
name: Bug Report
description: Report a bug
body:
  - type: input
    id: title
    attributes:
      label: Summary
```

## ✅ Correct

```yaml
# .github/ISSUE_TEMPLATE/bug_report.yml
name: Bug Report
description: Report a bug
labels:
  - "type: bug"
  - "status: triage"
body:
  - type: input
    id: title
    attributes:
      label: Summary
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.github,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-github-issue-template-labels": "warn",
    },
  },
];
```

## When not to use it

Disable this rule if your team intentionally avoids automated labelling (e.g.
all labels are applied manually after triage review) or if your issue templates
are legacy Markdown forms rather than structured YAML.

> **Rule catalog ID:** R050

## Further reading

- [GitHub Docs: Configuring issue templates for your repository](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository)
- [GitHub Docs: About labels](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/about-labels)
