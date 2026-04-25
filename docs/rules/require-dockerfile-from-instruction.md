# require-dockerfile-from-instruction

Require Dockerfiles to declare a `FROM` instruction.

## Targeted pattern scope

- Repository-root `Dockerfile` instruction set.

## What this rule reports

This rule reports Dockerfiles missing any `FROM` statement.

## Why this rule exists

A valid Docker build must declare a base image stage. Enforcing `FROM` avoids
broken or ambiguous image definitions.

## ❌ Incorrect

```dockerfile
WORKDIR /app
CMD ["node", "server.js"]
```

## ✅ Correct

```dockerfile
FROM node:22-alpine
WORKDIR /app
CMD ["node", "server.js"]
```

## When not to use it

Disable this rule only if Dockerfile generation guarantees `FROM` elsewhere.

> **Rule catalog ID:** R105

## Further reading

- [Dockerfile reference: FROM](https://docs.docker.com/reference/dockerfile/#from)
