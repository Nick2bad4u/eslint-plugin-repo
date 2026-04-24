# require-gitlab-ci-rules-over-only-except

Require GitLab CI jobs to use `rules` instead of legacy `only` / `except` filters.

## Targeted pattern scope

This rule checks `.gitlab-ci.yml` (or `.gitlab-ci.yaml`) and reports lines using `only:` or `except:` keys.

## What this rule reports

This rule reports legacy `only` / `except` usage so teams can standardize on `rules`.

## Why this rule exists

GitLab recommends `rules` for modern pipeline behavior and warns against mixing patterns that can create duplicate or confusing pipeline triggers.

## ❌ Incorrect

```ts
test:
  script:
    - npm test
  only:
    - branches
```

## ✅ Correct

```ts
test:
  script:
    - npm test
  rules:
    - if: $CI_COMMIT_BRANCH
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.gitlab,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-gitlab-ci-rules-over-only-except": "warn",
    },
  },
];
```

## When not to use it

Disable this rule only if you intentionally maintain legacy `only` / `except` syntax and accept the associated maintenance tradeoffs.

> **Rule catalog ID:** R033

## Further reading

- [GitLab Docs: Job rules](https://docs.gitlab.com/ci/jobs/job_rules/)
- [GitLab Docs: Deprecated keywords (`only` / `except`)](https://docs.gitlab.com/ci/yaml/deprecated_keywords/)
