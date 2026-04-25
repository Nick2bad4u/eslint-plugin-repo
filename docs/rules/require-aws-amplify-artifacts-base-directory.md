# require-aws-amplify-artifacts-base-directory

Require `artifacts.baseDirectory` in AWS Amplify build specifications.

## Targeted pattern scope

- `amplify.yml` or `amplify.yaml` files with an `artifacts:` block that does not
  declare `baseDirectory:`.

## What this rule reports

This rule reports Amplify configs that define deployment artifacts without an
explicit output directory.

## Why this rule exists

Making the output directory explicit avoids deployment drift between dashboard
settings and repository state. It also makes monorepo output paths easier to
review.

## ❌ Incorrect

```yaml
version: 1
frontend:
  phases:
    build:
      commands:
        - npm run build
  artifacts:
    files:
      - "**/*"
```

## ✅ Correct

```yaml
version: 1
frontend:
  phases:
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - "**/*"
```

## When not to use it

Disable this rule if Amplify output directories are managed outside the build spec and that trade-off is intentional.

> **Rule catalog ID:** R063

## Further reading

- [AWS Amplify build specification reference](https://docs.aws.amazon.com/amplify/latest/userguide/yml-specification-syntax.html)
