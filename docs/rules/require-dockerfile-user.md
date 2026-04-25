# require-dockerfile-user

Require an explicit `USER` instruction in Dockerfiles.

## Targeted pattern scope

- Repository-root `Dockerfile` content.
- Presence of a `USER ...` instruction.

## What this rule reports

This rule reports Dockerfiles that never set a runtime user.

## Why this rule exists

Without an explicit `USER`, containers typically run as root, which increases
blast radius if a process is compromised. Requiring `USER` keeps privilege
choices explicit and reviewable.

## ❌ Incorrect

```dockerfile
FROM node:22-alpine
WORKDIR /app
```

## ✅ Correct

```dockerfile
FROM node:22-alpine
WORKDIR /app
USER node
```

## When not to use it

Disable this rule if your container intentionally requires root at runtime.

> **Rule catalog ID:** R084

## Further reading

- [Dockerfile reference: USER](https://docs.docker.com/reference/dockerfile/#user)
