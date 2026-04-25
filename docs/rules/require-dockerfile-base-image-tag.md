# require-dockerfile-base-image-tag

Require Dockerfile `FROM` images to use explicit non-`latest` tags or digests.

## Targeted pattern scope

- `FROM ...` instructions in a repository-root `Dockerfile`.
- Base images without a tag or digest.
- Base images pinned to `:latest`.

## What this rule reports

This rule reports Dockerfiles whose base image references are not pinned to a
specific, reproducible version.

## Why this rule exists

Unpinned base images can change without any repository diff, causing
non-deterministic builds and surprise runtime behavior. Requiring explicit tags
(or digests) makes supply-chain changes visible during code review.

## ❌ Incorrect

```dockerfile
FROM node:latest
WORKDIR /app
```

```dockerfile
FROM alpine
RUN echo "missing explicit version"
```

## ✅ Correct

```dockerfile
FROM node:22-alpine
WORKDIR /app
```

```dockerfile
FROM node@sha256:3bd1a55f74be0d8a2fcb4a00e95e26ef9642f2f957f725622f4c5d6c73ab8cf8
```

## When not to use it

Disable this rule if the repository intentionally tracks moving base images and
accepts non-reproducible container builds.

> **Rule catalog ID:** R077

## Further reading

- [Dockerfile reference: FROM](https://docs.docker.com/reference/dockerfile/#from)
