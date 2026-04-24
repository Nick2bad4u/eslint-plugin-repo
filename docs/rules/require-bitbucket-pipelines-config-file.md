# require-bitbucket-pipelines-config-file

Require `bitbucket-pipelines.yml` at the repository root.

## Targeted pattern scope

This rule checks the repository root for `bitbucket-pipelines.yml`.

## What this rule reports

This rule reports repositories that enable Bitbucket-oriented presets without a
Bitbucket Pipelines configuration file.

## Why this rule exists

Bitbucket Pipelines automation starts with `bitbucket-pipelines.yml`.

Without that file, later Bitbucket-specific rules about default pipelines,
branch handling, or step naming have nothing real to validate.

## ❌ Incorrect

```ts
// Repository files
// .
// ├── README.md
// ├── package.json
// └── src/
//
// Missing: bitbucket-pipelines.yml
```

## ✅ Correct

```ts
// Repository files
// .
// ├── bitbucket-pipelines.yml
// ├── README.md
// └── package.json
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.bitbucket,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-bitbucket-pipelines-config-file": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if the repository does not use Bitbucket Pipelines.

> **Rule catalog ID:** R015

## Further reading

- [Bitbucket Docs: Configure your bitbucket-pipelines.yml file](https://support.atlassian.com/bitbucket-cloud/docs/configure-bitbucket-pipelinesyml/)
