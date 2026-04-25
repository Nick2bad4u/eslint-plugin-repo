# require-pr-template-checklist-items

Require at least one checklist item (`- [ ]`) in the pull request template.

## Targeted pattern scope

This rule checks the following common PR template locations across GitHub, GitLab,
Bitbucket, Gitea, and Forgejo:

- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/pull_request_template.md`
- `PULL_REQUEST_TEMPLATE.md`
- `pull_request_template.md`
- `.gitlab/merge_request_templates/Default.md`
- `docs/pull_request_template.md`
- `.forgejo/PULL_REQUEST_TEMPLATE.md`
- `.gitea/PULL_REQUEST_TEMPLATE.md`
- `bitbucket-pipelines.pull_request_template.md`

## What this rule reports

This rule reports when a PR template file is found but contains no Markdown
task-list item (`- [ ]`).

## Why this rule exists

Pull request checklists prompt reviewers and authors to verify key quality gates
before merging: test coverage, documentation updates, breaking change review, and
manual validation steps. Without checkboxes, PR templates are often ignored;
checklists make the template actionable. A template without any checklist is likely
not providing meaningful guidance.

## ❌ Incorrect

```markdown
## Description

Describe the changes in this PR.

## Type of change

- Bug fix
- New feature
- Breaking change
```

## ✅ Correct

```markdown
## Description

Describe the changes in this PR.

## Checklist

- [ ] Tests added or updated
- [ ] Documentation updated
- [ ] No breaking changes (or migration notes added)
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.strict,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-pr-template-checklist-items": "warn",
    },
  },
];
```

## When not to use it

Disable this rule if your team's PR workflow is fully automated with bots or
status checks and the PR template serves only as documentation without actionable
checklist items.

> **Rule catalog ID:** R051

## Further reading

- [GitHub Docs: Creating a pull request template for your repository](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository)
- [GitHub Markdown: Task lists](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/about-task-lists)
