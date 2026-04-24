# require-bitbucket-pipelines-pull-requests-target-branches

Require target branch mappings under `pull-requests` in
`bitbucket-pipelines.yml`.

## Targeted pattern scope

This rule checks `bitbucket-pipelines.yml` and ensures each `pull-requests:`
block declares at least one target branch pattern key.

## What this rule reports

This rule reports when `pull-requests:` exists but has no target branch
mappings (for example, missing keys such as `"**":`).

## Why this rule exists

Bitbucket Pipelines `pull-requests` configuration is branch-pattern keyed.
Without a target branch mapping, pull request pipelines are not explicitly
defined for any destination branch.

## ❌ Incorrect

```ts
pipelines:
  pull-requests:
```

## ✅ Correct

```ts
pipelines:
  pull-requests:
    "**":
      - step:
          name: Validate pull requests
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
      "repo-compliance/require-bitbucket-pipelines-pull-requests-target-branches": "warn",
    },
  },
];
```

## When not to use it

Disable this rule if you intentionally omit pull request pipeline execution in
Bitbucket Cloud.

> **Rule catalog ID:** R049

## Further reading

- [Bitbucket Pipelines start conditions](https://support.atlassian.com/bitbucket-cloud/docs/pipeline-start-conditions/)
- [Use glob patterns on the Pipelines YAML file](https://support.atlassian.com/bitbucket-cloud/docs/use-glob-patterns-on-the-pipelines-yaml-file/)
