# require-dependabot-schedule

Require a `schedule.interval` in every Dependabot `updates` block.

## Targeted pattern scope

This rule reads `.github/dependabot.yml` (or `.github/dependabot.yaml`) and checks
that every entry in the `updates` array contains a `schedule.interval` value.

## What this rule reports

This rule reports `updates` entries that are missing `schedule` or `schedule.interval`.

## Why this rule exists

Without a `schedule` block, Dependabot updates are not automatically triggered.
The `schedule.interval` field is **required** by Dependabot — omitting it means the
`updates` entry is effectively broken and will never run. Enforcing it at lint time
catches misconfigured entries before they silently fail in production.

## ❌ Incorrect

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
```

## ✅ Correct

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.recommended,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-dependabot-schedule": "error",
    },
  },
];
```

## When not to use it

This rule should almost never be disabled — a missing `schedule.interval` means the
Dependabot entry is non-functional. Disable only if you are intentionally using an
alternative Dependabot trigger mechanism.

> **Rule catalog ID:** R052

## Further reading

- [Dependabot: `schedule` option](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#schedule)
