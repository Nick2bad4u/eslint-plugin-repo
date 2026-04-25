# require-release-config-file

Require a release automation configuration file in the repository.

## Targeted pattern scope

This rule checks for the presence of one of the following recognised release
configuration files:

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

This rule reports when none of the recognised release configuration files is found.

## Why this rule exists

Automated release tooling (such as Release Please, Changesets,
semantic-release, release-it, or GitHub Release Drafter) ensures that version
bumps, changelogs, and tags are created consistently. Without a release
configuration, releases are often manual and error-prone, leading to skipped
changelog entries, inconsistent version numbers, and deployment delays.

## ❌ Incorrect

```txt
// No release configuration file found
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
above, or if releases are managed through a separate repository / CI system and
no local configuration file is needed.

> **Rule catalog ID:** R044

## Further reading

- [Release Please](https://github.com/googleapis/release-please)
- [Changesets](https://github.com/changesets/changesets)
- [semantic-release](https://semantic-release.gitbook.io/semantic-release/)
- [release-it](https://github.com/release-it/release-it)
- [GitHub release drafter](https://github.com/release-drafter/release-drafter)
