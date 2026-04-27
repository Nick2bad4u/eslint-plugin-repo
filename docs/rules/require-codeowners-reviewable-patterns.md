# require-codeowners-reviewable-patterns

Require all CODEOWNERS patterns to have at least one owner assigned.

## Targeted pattern scope

This rule reads the `CODEOWNERS` file (checked in `.github/CODEOWNERS`,
`.gitlab/CODEOWNERS`, `.bitbucket/CODEOWNERS`, `CODEOWNERS`, or
`docs/CODEOWNERS`) and parses each non-comment line, reporting any pattern that
is followed by no owner entries.

## What this rule reports

This rule reports CODEOWNERS lines that declare a file-path pattern but list no
owners, rendering the pattern unenforceable.

## Why this rule exists

GitHub and GitLab enforce CODEOWNERS patterns only when they contain at least one
valid owner. A pattern with no owners is silently ignored by the platform — it does
not block merges and does not request reviews. This creates a false sense of coverage
in the review process. Keeping every pattern reviewable ensures the intent of the
CODEOWNERS file matches its runtime behaviour.

## ❌ Incorrect

```txt
# CODEOWNERS
*.ts                     # no owner — pattern is silently ignored
docs/                    @docs-team
*.md                     # another unowned pattern
```

## ✅ Correct

```txt
# CODEOWNERS
*.ts          @team/typescript-owners
docs/         @docs-team
*.md          @docs-team
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.recommended,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-codeowners-reviewable-patterns": "warn",
    },
  },
];
```

## When not to use it

Disable this rule if your workflow intentionally uses blank-owner CODEOWNERS
lines as placeholders during migration, and you have a separate process to fill
them in before merging.

> **Rule catalog ID:** R047

## Further reading

- [GitHub Docs: About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [GitLab Docs: Code Owners](https://docs.gitlab.com/ee/user/project/codeowners/)
- [Bitbucket Cloud Docs: Set up and use code owners](https://support.atlassian.com/bitbucket-cloud/docs/set-up-and-use-code-owners/)
