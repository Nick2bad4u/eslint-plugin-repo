# require-gitlab-ci-default-timeout

Require `default.timeout` in GitLab CI configuration.

## Targeted pattern scope

This rule checks `.gitlab-ci.yml` (or `.gitlab-ci.yaml`) and verifies that a root-level `default:` block contains `timeout:`.

## What this rule reports

This rule reports GitLab CI configs that do not define a pipeline-wide default timeout baseline.

## Why this rule exists

GitLab CI supports `timeout` in pipeline configuration. Setting a `default.timeout` baseline reduces risk of long-running or stuck jobs without explicit per-job limits.

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
default:
  timeout: 30m

stages:
  - test

test:
  script:
    - npm test
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.gitlab,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-gitlab-ci-default-timeout": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if timeout policy is intentionally managed outside repository CI config.

> **Rule catalog ID:** R035

## Further reading

- [GitLab Docs: CI/CD YAML syntax reference](https://docs.gitlab.com/ci/yaml/)
- [GitLab Docs: Configuring runners and timeouts](https://docs.gitlab.com/ci/runners/configure_runners/)
