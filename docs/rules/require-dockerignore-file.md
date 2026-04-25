# require-dockerignore-file

Require `.dockerignore` when a repository-root `Dockerfile` is present.

## Targeted pattern scope

- Repositories that commit a root `Dockerfile` without a matching
  `.dockerignore` file.

## What this rule reports

This rule reports repositories with a root Dockerfile that do not also commit
`.dockerignore`.

## Why this rule exists

Without `.dockerignore`, Docker sends the entire repository as build context.
That increases build time and can accidentally include credentials, Git
metadata, caches, and other files that should never reach the image build.

## ❌ Incorrect

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm ci
```

## ✅ Correct

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm ci
```

```gitignore
# .dockerignore
node_modules
.git
.env
coverage
```

## When not to use it

Disable this rule only if the repository intentionally wants the full build context and that trade-off is understood.

> **Rule catalog ID:** R069

## Further reading

- [Docker: .dockerignore files](https://docs.docker.com/build/concepts/context/#dockerignore-files)
