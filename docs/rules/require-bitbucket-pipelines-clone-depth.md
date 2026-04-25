# require-bitbucket-pipelines-clone-depth

Require a `clone.depth` setting in Bitbucket Pipelines.

## Targeted pattern scope

This rule reads `bitbucket-pipelines.yml` and checks whether a `depth:` key exists
under the `clone:` section.

## What this rule reports

This rule reports when `bitbucket-pipelines.yml` exists but does not contain a
`clone.depth` setting.

## Why this rule exists

By default, Bitbucket Pipelines performs a full clone of the entire repository
history on every pipeline run. For repositories with long histories this can take
significant time and bandwidth, adding unnecessary overhead to every build. Setting
`clone.depth` to a shallow depth (e.g. `1`) limits the clone to only the commits
needed for the current run, reducing checkout time noticeably. For the rare
cases where full history is needed, the depth can be set explicitly to a higher
value.

## ❌ Incorrect

```yaml
# bitbucket-pipelines.yml — no clone depth configured
pipelines:
  default:
    - step:
        script:
          - npm test
```

## ✅ Correct

```yaml
# bitbucket-pipelines.yml
clone:
  depth: 1

pipelines:
  default:
    - step:
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
      "repo-compliance/require-bitbucket-pipelines-clone-depth": "warn",
    },
  },
];
```

## When not to use it

Disable this rule if your pipeline scripts require full git history (e.g. for
changelog generation with `git log`, version bumping tools, or merge-base
comparisons) and you intentionally need a full clone.

> **Rule catalog ID:** R059

## Further reading

- [Bitbucket Pipelines: `clone` options](https://support.atlassian.com/bitbucket-cloud/docs/configure-bitbucket-pipelinesyml/#Clone-settings)
