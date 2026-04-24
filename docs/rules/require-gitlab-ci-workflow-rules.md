# require-gitlab-ci-workflow-rules

Require root-level `workflow: rules` in `.gitlab-ci.yml`.

## Targeted pattern scope

This rule checks `.gitlab-ci.yml` (or `.gitlab-ci.yaml`) and verifies that the root `workflow:` block exists with nested `rules:`.

## What this rule reports

This rule reports GitLab CI configurations where pipeline creation logic is not explicitly defined via `workflow: rules`.

## Why this rule exists

GitLab evaluates `workflow` before jobs and recommends explicit `workflow: rules` to control when pipelines are created and to avoid duplicate/unintended pipelines.

## ❌ Incorrect

```ts
stages:
  - test

test:
  script:
    - npm test
```

## ✅ Correct

```ts
workflow:
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

stages:
  - test
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.gitlab,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-gitlab-ci-workflow-rules": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if pipeline-creation behavior is intentionally inherited from shared includes and you do not want to enforce a local workflow block.

> **Rule catalog ID:** R030

## Further reading

- [GitLab Docs: `workflow` keyword](https://docs.gitlab.com/ci/yaml/workflow/)
- [GitLab Docs: Job rules and duplicate pipeline guidance](https://docs.gitlab.com/ci/jobs/job_rules/)
