# require-release-config-file

Require a release automation configuration file in the repository.

## Targeted pattern scope

This rule checks for the presence of one of the following recognised release
configuration files: `.github/release.yml`, `release-please-config.json`,
`.releaserc`, `.releaserc.json`, `.releaserc.yml`, `.releaserc.yaml`,
`.releaserc.js`, `.releaserc.cjs`, or `release.config.js`.

## What this rule reports

This rule reports when none of the recognised release configuration files is found.

## Why this rule exists

Automated release tooling (such as Release Please, semantic-release, or GitHub's
release drafter) ensures that version bumps, changelogs, and tags are created
consistently. Without a release configuration, releases are often manual and
error-prone, leading to skipped changelog entries, inconsistent version numbers,
and deployment delays.

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

Disable this rule if your project uses a different release tool not listed above,
or if releases are managed through a separate repository / CI system and no local
configuration file is needed.

> **Rule catalog ID:** R044

## Further reading

- [Release Please](https://github.com/googleapis/release-please)
- [semantic-release](https://semantic-release.gitbook.io/semantic-release/)
- [GitHub release drafter](https://github.com/release-drafter/release-drafter)
