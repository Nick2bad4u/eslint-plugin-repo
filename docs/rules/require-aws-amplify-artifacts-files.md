# require-aws-amplify-artifacts-files

Require explicit AWS Amplify `artifacts.files` patterns.

## Targeted pattern scope

- `artifacts.files` entries in `amplify.yml` or `amplify.yaml`.

## What this rule reports

This rule reports Amplify build specs that define an `artifacts:` block but omit
`artifacts.files`.

## Why this rule exists

Amplify can deploy whatever files are produced by your build. If artifact
include patterns are implicit, reviewers cannot easily see what is published.
Committing explicit `artifacts.files` patterns makes deploy output reviewable and
reduces accidental artifact drift.

## ❌ Incorrect

```yaml
version: 1
frontend:
  artifacts:
    baseDirectory: dist
```

## ✅ Correct

```yaml
version: 1
frontend:
  artifacts:
    baseDirectory: dist
    files:
      - "**/*"
```

## When not to use it

Disable this rule if your repository intentionally delegates artifact selection
to external Amplify defaults.

> **Rule catalog ID:** R074

## Further reading

- [AWS Amplify build specification reference](https://docs.aws.amazon.com/amplify/latest/userguide/yml-specification-syntax.html)
