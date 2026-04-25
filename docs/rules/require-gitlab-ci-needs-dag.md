# require-gitlab-ci-needs-dag

Require `needs:` in all GitLab CI job definitions to enable DAG execution.

## Targeted pattern scope

This rule reads `.gitlab-ci.yml` (or `.gitlab-ci.yaml`) and checks every
non-reserved top-level job key for the presence of a `needs:` directive.

## What this rule reports

This rule reports job definitions that are missing a `needs:` key.

## Why this rule exists

By default, GitLab CI executes jobs in stage order — all jobs in a stage must
complete before the next stage starts, even when jobs in different stages have no
actual dependencies on each other. Adding `needs:` enables GitLab's **DAG
(Directed Acyclic Graph)** execution model, where a job can start as soon as its
specific dependencies finish, regardless of stage. This can dramatically reduce
overall pipeline duration.

Even `needs: []` (empty list) is valid and tells GitLab the job has no dependencies
and can start immediately.

## ❌ Incorrect

```yaml
# .gitlab-ci.yml — no needs: declared; all jobs wait for their stage
build:
  stage: build
  script: npm run build

test:
  stage: test
  script: npm test
```

## ✅ Correct

```yaml
# .gitlab-ci.yml
build:
  stage: build
  script: npm run build
  needs: []

test:
  stage: test
  script: npm test
  needs:
    - build
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.gitlab,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-gitlab-ci-needs-dag": "warn",
    },
  },
];
```

## When not to use it

Disable this rule if your pipeline design intentionally relies on sequential stage
execution and converting to DAG would require restructuring that you are not ready
to undertake.

> **Rule catalog ID:** R057

## Further reading

- [GitLab CI: `needs` keyword](https://docs.gitlab.com/ee/ci/yaml/#needs)
- [GitLab CI: DAG pipelines](https://docs.gitlab.com/ee/ci/directed_acyclic_graph/)
