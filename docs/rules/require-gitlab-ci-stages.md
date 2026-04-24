# require-gitlab-ci-stages

Require explicit root-level `stages` in `.gitlab-ci.yml`.

## Targeted pattern scope

This rule scans `.gitlab-ci.yml` (or `.yaml`) and checks for a root-level `stages:` key.

## What this rule reports

This rule reports GitLab CI configurations that omit explicit `stages`.

## Why this rule exists

GitLab can run with implicit default stages, but explicit `stages` improves pipeline readability and makes execution intent obvious during review and incident response.

## ❌ Incorrect

```ts
default:
  image: node:20

test:
  script:
    - npm test
```

## ✅ Correct

```ts
stages:
  - test
  - deploy

test:
  stage: test
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
      "repo-compliance/require-gitlab-ci-stages": "warn",
    },
  },
];
```

## When not to use it

Disable this rule only if your repository deliberately relies on GitLab's implicit default stages and your team accepts that lower configuration clarity.

> **Rule catalog ID:** R039

## Further reading

- [GitLab Docs: `stages` keyword](https://docs.gitlab.com/ee/ci/yaml/#stages)
