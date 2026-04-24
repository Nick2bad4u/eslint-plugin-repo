# require-gitlab-ci-merge-request-pipelines

Require explicit merge-request pipeline configuration in `.gitlab-ci.yml`.

## Targeted pattern scope

This rule checks `.gitlab-ci.yml` (or `.gitlab-ci.yaml`) for merge-request pipeline signals, including:

- `rules` or `workflow: rules` using `merge_request_event`
- `only: [merge_requests]`-style clauses

## What this rule reports

This rule reports GitLab CI configurations that do not explicitly enable merge-request pipeline behavior.

## Why this rule exists

GitLab documents merge-request pipelines as event-driven (`CI_PIPELINE_SOURCE == "merge_request_event"`) and expects matching job or workflow rules in `.gitlab-ci.yml`. Explicit MR pipeline configuration helps ensure pre-merge validation runs consistently.

## ❌ Incorrect

```ts
// .gitlab-ci.yml
stages:
  - test

test:
  stage: test
  script:
    - npm test
```

## ✅ Correct

```ts
workflow:
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"

test:
  script:
    - npm test
```

```ts
test:
  script:
    - npm test
  only:
    - merge_requests
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.gitlab,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-gitlab-ci-merge-request-pipelines": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if merge-request validation is guaranteed by an external pipeline architecture and repository-level `.gitlab-ci.yml` intentionally excludes MR-specific logic.

> **Rule catalog ID:** R025

## Further reading

- [GitLab Docs: Merge request pipelines](https://docs.gitlab.com/ci/pipelines/merge_request_pipelines/)
- [GitLab Docs: Job rules](https://docs.gitlab.com/ci/jobs/job_rules/)

## Adoption resources

- Enable this rule together with `require-gitlab-ci-security-scanning` to enforce both security and MR-quality signals in GitLab CI.
