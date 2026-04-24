# require-bitbucket-pipelines-step-name

Require a `name` for each Bitbucket Pipelines `step`.

## Targeted pattern scope

This rule checks `bitbucket-pipelines.yml` (or `bitbucket-pipelines.yaml`) and validates that each `- step:` block includes `name`.

## What this rule reports

This rule reports every step block missing a `name` field.

## Why this rule exists

Bitbucket Pipelines supports naming steps. Explicit step names make pipeline UI output clearer and simplify CI troubleshooting.

## ❌ Incorrect

```ts
pipelines:
  default:
    - step:
        script:
          - npm test
```

## ✅ Correct

```ts
pipelines:
  default:
    - step:
        name: test
        script:
          - npm test
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.bitbucket,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-bitbucket-pipelines-step-name": "warn",
    },
  },
];
```

## When not to use it

Disable this rule only if your team intentionally prefers unnamed step blocks and does not rely on named pipeline output.

> **Rule catalog ID:** R048

## Further reading

- [Bitbucket Pipelines step options](https://support.atlassian.com/bitbucket-cloud/docs/step-options/)
- [Configure bitbucket-pipelines.yml](https://support.atlassian.com/bitbucket-cloud/docs/configure-bitbucket-pipelinesyml/)
