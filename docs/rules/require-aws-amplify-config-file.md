# require-aws-amplify-config-file

Require an AWS Amplify build specification to be committed in the repository.

## Targeted pattern scope

- Repositories that opt into the AWS preset but do not commit `amplify.yml` or
  `amplify.yaml`.

## What this rule reports

This rule reports repositories using the AWS preset when no Amplify build spec
is committed.

## Why this rule exists

Keeping the Amplify build spec in version control makes build phases, cache
behavior, and published artifacts reviewable in pull requests instead of living
only in the Amplify dashboard.

## ❌ Incorrect

```ts
// Repository uses AWS Amplify but does not commit amplify.yml.
export default [];
```

## ✅ Correct

```yaml
# amplify.yml
version: 1
frontend:
  phases:
    build:
      commands:
        - npm ci
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - "**/*"
```

## When not to use it

Disable this rule if AWS hosting is managed outside Amplify or the repository intentionally does not use an Amplify build spec.

> **Rule catalog ID:** R062

## Further reading

- [AWS Amplify build specification reference](https://docs.aws.amazon.com/amplify/latest/userguide/yml-specification-syntax.html)
