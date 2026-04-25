# require-aws-amplify-artifacts-base-directory-relative-path

Require AWS Amplify `artifacts.baseDirectory` values to be repository-relative.

## Targeted pattern scope

- `baseDirectory:` values in Amplify build specs.

## What this rule reports

This rule reports absolute artifacts base directory values such as `/dist`.

## Why this rule exists

Absolute output paths are brittle across environments and make repository-driven
build output conventions harder to enforce.

## ❌ Incorrect

```yaml
frontend:
  artifacts:
    baseDirectory: /dist
```

## ✅ Correct

```yaml
frontend:
  artifacts:
    baseDirectory: dist
```

## When not to use it

Disable this rule if your Amplify build environment intentionally requires
absolute output paths.

> **Rule catalog ID:** R095

## Further reading

- [AWS Amplify build specification syntax](https://docs.aws.amazon.com/amplify/latest/userguide/yml-specification-syntax.html)
