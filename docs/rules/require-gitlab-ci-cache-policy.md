# require-gitlab-ci-cache-policy

Require a `policy:` key in every GitLab CI `cache:` block.

## Targeted pattern scope

This rule reads `.gitlab-ci.yml` (or `.gitlab-ci.yaml`) and checks every
`cache:` block for a `policy:` sub-key.

## What this rule reports

This rule reports `cache:` blocks that do not declare a `policy:`.

## Why this rule exists

GitLab CI's default cache policy is `pull-push`, meaning every job that uses
a cache will both download **and** re-upload the cache, even if nothing in the
cache changed. For jobs that only read from the cache (test runners, linters),
this wastes bandwidth and pipeline minutes. Explicitly setting `policy: pull`
on read-only jobs and `policy: push` on jobs that populate the cache makes
cache behaviour intentional, reduces network overhead, and speeds up pipelines.

## ❌ Incorrect

```yaml
# .gitlab-ci.yml — no policy declared
test:
  script: npm test
  cache:
    key: node-modules
    paths:
      - node_modules/
```

## ✅ Correct

```yaml
# .gitlab-ci.yml
install:
  script: npm ci
  cache:
    key: node-modules
    paths:
      - node_modules/
    policy: push

test:
  script: npm test
  cache:
    key: node-modules
    paths:
      - node_modules/
    policy: pull
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.gitlab,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-gitlab-ci-cache-policy": "warn",
    },
  },
];
```

## When not to use it

Disable this rule if your GitLab CI jobs intentionally use the default `pull-push`
policy and you prefer implicit behaviour over explicit configuration.

> **Rule catalog ID:** R055

## Further reading

- [GitLab CI/CD: Cache policy](https://docs.gitlab.com/ee/ci/caching/#cache-policy)
