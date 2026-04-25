# require-dockerfile

Require a repository-root `Dockerfile` when using the Docker preset.

## Targeted pattern scope

- Repositories that opt into the Docker preset without committing a root
  `Dockerfile`.

## What this rule reports

This rule reports repositories using the Docker preset when no repository-root
Dockerfile exists.

## Why this rule exists

If a repository is supposed to describe container packaging as code, the build
instructions need to live in version control, not only in external CI or
registry jobs.

## ❌ Incorrect

```ts
// Docker preset enabled, but no Dockerfile is committed.
export default [];
```

## ✅ Correct

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
CMD ["npm", "start"]
```

## When not to use it

Disable this rule if the repository does not actually build a container image.

> **Rule catalog ID:** R068

## Further reading

- [Dockerfile reference](https://docs.docker.com/reference/dockerfile/)
