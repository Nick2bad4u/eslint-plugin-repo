# require-dependabot-reviewers

Require `reviewers` in Dependabot `updates` blocks.

## Targeted pattern scope

This rule checks `.github/dependabot.yml` (or `.github/dependabot.yaml`) and
ensures Dependabot update blocks declare `reviewers`.

## What this rule reports

This rule reports Dependabot configurations that do not define any
`reviewers` entries.

## Why this rule exists

GitHub Dependabot supports the `reviewers` option for update pull requests.
Explicit reviewers help ensure dependency updates receive timely human review.

## ❌ Incorrect

```ts
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
```

## ✅ Correct

```ts
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    reviewers:
      - octocat
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.github,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-dependabot-reviewers": "warn",
    },
  },
];
```

## When not to use it

Disable this rule if your repository intentionally routes Dependabot pull
requests without using the `reviewers` option.

> **Rule catalog ID:** R050

## Further reading

- [Dependabot options reference (`reviewers`)](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#reviewers)
- [Configure Dependabot version updates](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
