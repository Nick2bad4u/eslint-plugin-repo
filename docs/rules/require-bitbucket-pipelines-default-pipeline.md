# require-bitbucket-pipelines-default-pipeline

Require a `default:` pipeline section in `bitbucket-pipelines.yml`.

## Targeted pattern scope

This rule checks `bitbucket-pipelines.yml` (or `bitbucket-pipelines.yaml`) in the repository root and looks for a root-level `default:` key.

The `default:` section in Bitbucket Pipelines is the catch-all pipeline that runs for any branch not matched by an explicit `branches:` or `tags:` rule.

## What this rule reports

This rule reports repositories that have a `bitbucket-pipelines.yml` file without a `default:` pipeline section.

## Why this rule exists

Without a `default:` pipeline, every new branch in the repository gets **no CI coverage** unless it is explicitly listed under `branches:`. Teams routinely create feature branches, hotfix branches, or experiment branches that never match a named branch rule, leaving them unvalidated.

A `default:` pipeline guarantees that every commit on every branch runs at minimum the baseline checks (build, lint, unit tests) regardless of branch naming conventions.

## ❌ Incorrect

```ts
// bitbucket-pipelines.yml
image: node:22

pipelines:
  branches:
    main:
      - step:
          name: Build and Deploy
          script:
            - npm run build
            - npm run deploy
```

## ✅ Correct

```ts
// bitbucket-pipelines.yml
image: node:22

pipelines:
  default:
    - step:
        name: Build and Test
        script:
          - npm run build
          - npm test
  branches:
    main:
      - step:
          name: Deploy
          script:
            - npm run deploy
```

```ts
// bitbucket-pipelines.yml — default pipeline only
image: node:22

pipelines:
  default:
    - step:
        name: CI
        script:
          - npm ci
          - npm test
```

## ESLint flat config example

```js
// eslint.config.mjs
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.bitbucket,
  // or individually:
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-bitbucket-pipelines-default-pipeline": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if your pipeline strategy is fully branch-enumeration-based and every branch that can receive code is guaranteed to be listed under `branches:` or `tags:` rules. This is rarely maintainable at scale.

> **Rule catalog ID:** R020

## Further reading

- [Bitbucket Docs: Configure pipelines — default pipelines](https://support.atlassian.com/bitbucket-cloud/docs/configure-bitbucket-pipelinesyml/)
- [Bitbucket Docs: Pipelines YAML reference — `pipelines.default`](https://support.atlassian.com/bitbucket-cloud/docs/pipelines-yaml-reference/)
- [Atlassian: Best practices for Bitbucket Pipelines](https://support.atlassian.com/bitbucket-cloud/docs/best-practices-for-pipelines/)

## Adoption resources

- Enable `repo-compliance:bitbucket` preset in your flat config to activate this rule alongside other Bitbucket-specific checks.
- If transitioning from a branches-only configuration, add `default:` with the same steps that apply to most branches, then override specific branches as needed.
