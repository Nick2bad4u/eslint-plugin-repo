---
title: Overview
description: Enforce hosting-provider repository compliance with ESLint.
---

# eslint-plugin-repo

`eslint-plugin-repo` is a **repository policy lint layer** for files that teams
usually forget until CI fails: repository governance docs, templates, and
provider CI/CD configuration.

If you only read one page after this, use
[Getting Started](./getting-started.md).

## What this plugin is for

Use this plugin when you want policy checks such as:

- baseline repository requirements
  ([recommended preset](./presets/recommended.md))
- provider-specific CI/CD and hosting policies
  ([GitHub](./presets/github.md), [GitLab](./presets/gitlab.md),
  [Bitbucket](./presets/bitbucket.md), [Codeberg / Forgejo](./presets/codeberg.md),
  [AWS](./presets/aws.md), [Azure](./presets/azure.md),
  [Google Cloud](./presets/google-cloud.md), [Docker](./presets/docker.md),
  [Vercel](./presets/vercel.md), [Netlify](./presets/netlify.md),
  [DigitalOcean](./presets/digitalocean.md))
- AI workflow guidance files
  ([AI preset](./presets/ai.md))

## Flat Config shape

Start with the baseline and layer only what matches your repository:

```js
import repoPlugin from "eslint-plugin-repo";

export default [repoPlugin.configs.recommended];
```

Then add provider presets from [Presets](./presets/index.md) as needed.

## How to navigate this docs section

- **Adoption path:** [Getting Started](./getting-started.md)
- **Preset comparison:** [Presets overview](./presets/index.md)
- **Strict profile:** [Strict preset](./presets/strict.md)
- **Complete catalog:** [All preset](./presets/all.md)
- **Rule examples:**
  [`require-readme-file`](./require-readme-file.md),
  [`require-license-file`](./require-license-file.md),
  [`require-security-policy-file`](./require-security-policy-file.md),
  [`require-github-actions-workflow-file`](./require-github-actions-workflow-file.md),
  [`require-gitlab-ci-config-file`](./require-gitlab-ci-config-file.md)

## Recommended rollout sequence

1. Enable `repoPlugin.configs.recommended`.
2. Add the provider preset(s) your repo actually uses.
3. Resolve findings and tune workflow expectations.
4. Add `repoPlugin.configs.strict` only after baseline adoption is stable.

Next: [Go to Getting Started](./getting-started.md).
