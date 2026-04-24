# require-bitbucket-pipelines-max-time

Require `max-time` in Bitbucket Pipelines (globally or per step).

## Targeted pattern scope

This rule checks `bitbucket-pipelines.yml` (or `bitbucket-pipelines.yaml`) and validates timeout configuration via either:

- `options.max-time` (global), or
- `step.max-time` (per step)

## What this rule reports

This rule reports pipelines where no global `options.max-time` is configured and one or more steps also omit `max-time`.

## Why this rule exists

Bitbucket Cloud documents `max-time` as the step timeout control (default 120 minutes). Explicit timeout configuration helps constrain runaway builds and CI minute consumption.

## ❌ Incorrect

```ts
pipelines:
  default:
    - step:
        name: build
        script:
          - npm test
```

## ✅ Correct

```ts
options:
  max-time: 30

pipelines:
  default:
    - step:
        name: build
        script:
          - npm test
```

```ts
pipelines:
  default:
    - step:
        name: build
        max-time: 15
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
      "repo-compliance/require-bitbucket-pipelines-max-time": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if timeout policy is intentionally managed outside repository YAML and not expected to be declared in the pipeline file.

> **Rule catalog ID:** R031

## Further reading

- [Atlassian Docs: Global options (`max-time`)](https://support.atlassian.com/bitbucket-cloud/docs/global-options/)
- [Atlassian Docs: Configure bitbucket-pipelines.yml](https://support.atlassian.com/bitbucket-cloud/docs/configure-bitbucket-pipelinesyml/)
