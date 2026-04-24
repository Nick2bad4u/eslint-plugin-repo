# require-bitbucket-pipelines-pull-requests

Require a `pull-requests:` section in Bitbucket Pipelines.

## Targeted pattern scope

This rule checks `bitbucket-pipelines.yml` (or `bitbucket-pipelines.yaml`) and verifies that the configuration includes a `pull-requests:` section.

## What this rule reports

This rule reports repositories with Bitbucket Pipelines configured but no pull-request-specific pipeline configuration.

## Why this rule exists

Atlassian documents `pipelines.pull-requests` as the mechanism to run pipelines on PR updates. Enforcing it provides explicit pre-merge validation coverage and reduces reliance on branch-only triggers.

## ❌ Incorrect

```ts
// bitbucket-pipelines.yml
image: node:22
pipelines:
  default:
    - step:
        script:
          - npm test
```

## ✅ Correct

```ts
// bitbucket-pipelines.yml
image: node:22
pipelines:
  pull-requests:
    "**":
      - step:
          script:
            - npm test
  default:
    - step:
        script:
          - npm run lint
```

## ESLint flat config example

```js
// eslint.config.mjs
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.bitbucket,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-bitbucket-pipelines-pull-requests": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if your team intentionally runs all PR validation through an external CI integration and does not use Bitbucket pull-request pipeline triggers.

> **Rule catalog ID:** R023

## Further reading

- [Atlassian Docs: Pipeline start conditions](https://support.atlassian.com/bitbucket-cloud/docs/pipeline-start-conditions/)
- [Atlassian Docs: Configure bitbucket-pipelines.yml](https://support.atlassian.com/bitbucket-cloud/docs/configure-bitbucket-pipelinesyml/)

## Adoption resources

- Enable `repo-compliance:bitbucket` preset to enforce this rule with other Bitbucket provider checks.
- Combine with `require-bitbucket-pipelines-default-pipeline` to ensure both general branch and PR coverage.
