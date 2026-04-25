# require-gitlab-ci-interruptible

Require `interruptible: true` in all GitLab CI job definitions.

## Targeted pattern scope

This rule reads `.gitlab-ci.yml` (or `.gitlab-ci.yaml`) and checks every
non-reserved top-level job key for the presence of `interruptible: true`.

## What this rule reports

This rule reports job definitions that are missing `interruptible: true`.

## Why this rule exists

When a developer pushes a new commit, GitLab will start a new pipeline while the
old one is still running. Without `interruptible: true`, the old pipeline continues
running and consuming CI minutes even though its results are no longer relevant.
Marking jobs as interruptible allows GitLab to automatically cancel stale runs,
reducing resource consumption and improving feedback loop speed.

## ❌ Incorrect

```yaml
# .gitlab-ci.yml — job is not marked interruptible
test:
  script: npm test
  stage: test
```

## ✅ Correct

```yaml
# .gitlab-ci.yml
test:
  script: npm test
  stage: test
  interruptible: true
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.gitlab,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-gitlab-ci-interruptible": "warn",
    },
  },
];
```

## When not to use it

Disable this rule for jobs that must not be interrupted once started — for example,
deployment jobs that apply infrastructure changes, or jobs that manage shared state
where partial execution causes inconsistency.

> **Rule catalog ID:** R056

## Further reading

- [GitLab CI: `interruptible` keyword](https://docs.gitlab.com/ee/ci/yaml/#interruptible)
- [GitLab CI: Auto-cancel redundant pipelines](https://docs.gitlab.com/ee/ci/pipelines/settings.html#auto-cancel-redundant-pipelines)
