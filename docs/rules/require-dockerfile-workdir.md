# require-dockerfile-workdir

Require a `WORKDIR` instruction in Dockerfiles.

## Targeted pattern scope

- Repository-root `Dockerfile` content.

## What this rule reports

This rule reports Dockerfiles that do not set an explicit working directory.

## Why this rule exists

Without `WORKDIR`, command path behavior can be inconsistent across images and
future image updates.

## ❌ Incorrect

```dockerfile
FROM node:22-alpine
RUN npm ci
```

## ✅ Correct

```dockerfile
FROM node:22-alpine
WORKDIR /app
RUN npm ci
```

## When not to use it

Disable this rule if container build scripts intentionally rely on the default
root working directory.

> **Rule catalog ID:** R091

## Further reading

- [Dockerfile reference: WORKDIR](https://docs.docker.com/reference/dockerfile/#workdir)
