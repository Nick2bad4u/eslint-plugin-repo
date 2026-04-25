# require-release-config-file

Require repository-local release tooling or release metadata configuration.

## Targeted pattern scope

This rule checks for the presence of one of the following recognised release
tooling or release metadata configuration files:

- GitHub release metadata: `.github/release.yml`, `.github/release.yaml`,
  `.github/release-drafter.yml`, `.github/release-drafter.yaml`
- Release Please / Changesets: `release-please-config.json`,
  `.release-please-manifest.json`, `.changeset/config.json`
- semantic-release / release-it: `.releaserc`, `.releaserc.json`,
  `.releaserc.js`, `.releaserc.cjs`, `.releaserc.mjs`, `.releaserc.yml`,
  `.releaserc.yaml`, `.release-it.json`, `.release-it.js`,
  `.release-it.cjs`, `.release-it.mjs`, `.release-it.yml`,
  `.release-it.yaml`, `release.config.js`, `release.config.cjs`,
  `release.config.mjs`, `release.config.ts`

## What this rule reports

This rule reports when none of the recognised release tooling or release
metadata configuration files is found.

## Why this rule exists

Repository-local release tooling and release metadata make release behavior more
discoverable and easier to review. This rule does not prove that releases are
correctly automated or that semantic versioning is enforced; it only ensures the
repository contains a supported release-related configuration surface instead of
leaving release behavior implicit.

## ❌ Incorrect

```txt
// No release tooling or release metadata configuration found
.github/
  workflows/
    ci.yml
src/
package.json
```

## ✅ Correct

```json
// release-please-config.json
{
  "$schema": "https://docs.renovatebot.com/release-please-config.json",
  "packages": {
    ".": {
      "release-type": "node"
    }
  }
}
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.github,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-release-config-file": "warn",
    },
  },
];
```

## When not to use it

Disable this rule if your project uses a different release tool not listed
above, or if releases are managed entirely outside this repository and no
repository-local release configuration is expected.

> **Rule catalog ID:** R044

## Further reading

- [Release Please](https://github.com/googleapis/release-please)
- [Changesets](https://github.com/changesets/changesets)
- [semantic-release](https://semantic-release.gitbook.io/semantic-release/)
- [release-it](https://github.com/release-it/release-it)
- [GitHub release drafter](https://github.com/release-drafter/release-drafter)
