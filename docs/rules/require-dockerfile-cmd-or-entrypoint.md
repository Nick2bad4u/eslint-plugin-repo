# require-dockerfile-cmd-or-entrypoint

Require Dockerfiles to include `CMD` or `ENTRYPOINT`.

## Targeted pattern scope

- Repository-root Dockerfile instructions.

## What this rule reports

This rule reports Dockerfiles that omit both startup instructions.

## Why this rule exists

Explicit startup instructions reduce runtime ambiguity and make container
behavior easier to review and reproduce.

## ❌ Incorrect

```dockerfile
FROM node:22-alpine
WORKDIR /app
RUN npm ci
```

## ✅ Correct

```dockerfile
FROM node:22-alpine
WORKDIR /app
CMD ["node", "server.js"]
```

## When not to use it

Disable this rule if command behavior is intentionally delegated to an external
orchestrator entrypoint layer.

> **Rule catalog ID:** R098

## Further reading

- [Dockerfile reference: CMD](https://docs.docker.com/reference/dockerfile/#cmd)
- [Dockerfile reference: ENTRYPOINT](https://docs.docker.com/reference/dockerfile/#entrypoint)
