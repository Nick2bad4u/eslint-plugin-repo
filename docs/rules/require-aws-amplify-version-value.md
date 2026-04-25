# require-aws-amplify-version-value

Require AWS Amplify configs to use supported top-level `version: 1`.

## Targeted pattern scope

- Root `version:` value in `amplify.yml`/`amplify.yaml`.

## What this rule reports

This rule reports missing or unsupported top-level version values.

## Why this rule exists

Amplify build-spec parsing behavior is versioned. Pinning supported version
metadata avoids ambiguous config semantics.

## ❌ Incorrect

```yaml
version: 2
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

Disable this rule if your repository intentionally uses non-standard Amplify
spec versions.

> **Rule catalog ID:** R102

## Further reading

- [AWS Amplify build specification syntax](https://docs.aws.amazon.com/amplify/latest/userguide/yml-specification-syntax.html)
