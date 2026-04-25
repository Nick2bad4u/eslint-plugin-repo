# require-dockerfile-first-instruction-from

Require the first non-comment Dockerfile instruction to be `FROM`.

## Targeted pattern scope

- Repository-root Dockerfile instruction order.

## What this rule reports

This rule reports Dockerfiles where a meaningful instruction appears before
`FROM`.

## Why this rule exists

Dockerfile semantics require a base image stage; ensuring `FROM` appears first
keeps files valid and predictable.

## ❌ Incorrect

```dockerfile
WORKDIR /app
FROM node:22-alpine
```

## ✅ Correct

```dockerfile
# syntax=docker/dockerfile:1
FROM node:22-alpine
WORKDIR /app
```

## When not to use it

Disable this rule only if Dockerfiles are generated and guaranteed valid by
another controlled step.

> **Rule catalog ID:** R112

## Further reading

- [Dockerfile reference: FROM](https://docs.docker.com/reference/dockerfile/#from)
