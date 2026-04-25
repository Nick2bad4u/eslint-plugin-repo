# require-aws-amplify-build-commands

Require `build.commands` in AWS Amplify build specifications.

## Targeted pattern scope

- `build.commands` in `amplify.yml` or `amplify.yaml`.

## What this rule reports

This rule reports Amplify specs that do not declare explicit build commands.

## Why this rule exists

Build commands define the deployment artifact pipeline. If they are omitted,
build behavior can drift to hidden defaults and become harder to review.

## ❌ Incorrect

```yaml
version: 1
frontend:
  phases:
    build:
      cache:
        paths:
          - node_modules/**/*
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

Disable this rule if your repository intentionally delegates build execution to
external Amplify defaults or wrappers.

> **Rule catalog ID:** R081

## Further reading

- [AWS Amplify build specification reference](https://docs.aws.amazon.com/amplify/latest/userguide/yml-specification-syntax.html)
