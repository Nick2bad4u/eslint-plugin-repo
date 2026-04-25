# require-aws-amplify-artifacts-files-non-empty

Require `artifacts.files` lists in Amplify config to contain at least one entry.

## Targeted pattern scope

- `artifacts.files` in `amplify.yml` / `amplify.yaml`.

## What this rule reports

This rule reports empty or missing list entries under `artifacts.files`.

## Why this rule exists

An empty artifacts list often means no deployable output is produced, which is
usually accidental and hard to spot during review.

## ❌ Incorrect

```yaml
frontend:
  artifacts:
    files:
```

## ✅ Correct

```yaml
frontend:
  artifacts:
    files:
      - "**/*"
```

## When not to use it

Disable this rule if artifact inclusion is intentionally injected by external
build tooling.

> **Rule catalog ID:** R109

## Further reading

- [AWS Amplify build specification syntax](https://docs.aws.amazon.com/amplify/latest/userguide/yml-specification-syntax.html)
