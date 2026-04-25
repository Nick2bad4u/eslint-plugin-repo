# require-changelog-file

Require a changelog file in the repository root.

## Targeted pattern scope

This rule checks the repository root for the presence of one of: `CHANGELOG.md`,
`CHANGELOG`, `CHANGELOG.txt`, `HISTORY.md`, `HISTORY`, or `RELEASES.md`.

## What this rule reports

This rule reports when none of the recognised changelog file variants is present.

## Why this rule exists

A changelog communicates the history of notable changes to users and contributors.
Consuming projects rely on it when upgrading dependencies, and open-source contributors
use it to understand project evolution. Without a changelog, upgrading becomes risky
and time-consuming for everyone downstream.

## ❌ Incorrect

<!-- Project root with no changelog: -->

```txt
README.md
LICENSE
package.json
src/
```

## ✅ Correct

```txt
README.md
LICENSE
CHANGELOG.md    ← any recognised variant satisfies the rule
package.json
src/
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.recommended,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-changelog-file": "warn",
    },
  },
];
```

## When not to use it

Disable this rule if your project tracks release notes exclusively via a GitHub/GitLab
release page, a wiki, or a linked external resource and you intentionally have no local
changelog file.

> **Rule catalog ID:** R036

## Further reading

- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)
