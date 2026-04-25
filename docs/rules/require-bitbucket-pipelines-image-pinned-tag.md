# require-bitbucket-pipelines-image-pinned-tag

Require pinned (non-`latest`) Docker image tags in Bitbucket Pipelines.

## Targeted pattern scope

This rule reads `bitbucket-pipelines.yml` and checks every `image:` entry for an
explicit, non-`latest` version tag.

## What this rule reports

This rule reports `image:` entries that either have no tag at all (implicitly
pulling `latest`) or explicitly use the `:latest` tag.

## Why this rule exists

Using unpinned or `:latest` Docker images in CI makes builds non-reproducible.
The same pipeline run with the same code may produce different results if the image
was updated upstream, leading to mysterious failures that are difficult to debug and
bisect. Pinning to an explicit tag (e.g. `node:20.11-alpine`) ensures that the
exact same environment is used every time, making failures consistent and traceable.

## ❌ Incorrect

```yaml
# bitbucket-pipelines.yml — unpinned image
image: node

pipelines:
  default:
    - step:
        script:
          - npm test
```

```yaml
# bitbucket-pipelines.yml — explicit latest tag
image: node:latest
```

## ✅ Correct

```yaml
# bitbucket-pipelines.yml
image: node:20.11-alpine

pipelines:
  default:
    - step:
        script:
          - npm test
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.bitbucket,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-bitbucket-pipelines-image-pinned-tag": "error",
    },
  },
];
```

## When not to use it

Disable this rule if your organisation manages image freshness through a dedicated
image pipeline and intentionally runs against a floating tag.

> **Rule catalog ID:** R058

## Further reading

- [Bitbucket Pipelines: Use Docker images as build environments](https://support.atlassian.com/bitbucket-cloud/docs/use-docker-images-as-build-environments/)
- [Docker: Image tagging best practices](https://docs.docker.com/develop/dev-best-practices/#use-tags-wisely)
