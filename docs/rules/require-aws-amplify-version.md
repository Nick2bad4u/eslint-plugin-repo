# require-aws-amplify-version

Require a top-level `version` key in AWS Amplify build specs.

## Targeted pattern scope

- Root-level `version:` in `amplify.yml` or `amplify.yaml`.

## What this rule reports

This rule reports Amplify build specs that omit top-level spec version metadata.

## Why this rule exists

Version metadata anchors parsing/semantics expectations and makes spec intent
explicit during review.

## ❌ Incorrect

```yaml
frontend:
  phases:
    build:
      commands:
        - npm run build
```

## ✅ Correct

```yaml
version: 1
frontend:
  phases:
    build:
      commands:
        - npm run build
```

## When not to use it

Disable this rule if your repository intentionally uses non-standard Amplify spec
material without a version declaration.

> **Rule catalog ID:** R088

## Further reading

- [AWS Amplify build specification syntax](https://docs.aws.amazon.com/amplify/latest/userguide/yml-specification-syntax.html)
