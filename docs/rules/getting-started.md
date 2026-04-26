---
title: Getting Started
description: Add repository compliance linting to your Flat Config.
---

# Getting Started

Use this path for predictable adoption:

1. baseline policy checks,
2. provider-specific presets,
3. optional strict hardening.

If you are new, read [Overview](./overview.md) first and keep
[Presets](./presets/index.md) open while configuring.

## 1) Install

```bash
npm install --save-dev eslint-plugin-repo typescript
```

## 2) Enable baseline coverage

```js
import repoPlugin from "eslint-plugin-repo";

export default [repoPlugin.configs.recommended];
```

`recommended` gives you repository baseline policy checks. See
[recommended preset details](./presets/recommended.md).

Common first rules you will see from this baseline include
[`require-readme-file`](./require-readme-file.md),
[`require-license-file`](./require-license-file.md), and
[`require-security-policy-file`](./require-security-policy-file.md).

## 3) Add the provider preset you actually use

- [GitHub](./presets/github.md): `repoPlugin.configs.github`
- [GitLab](./presets/gitlab.md): `repoPlugin.configs.gitlab`
- [Bitbucket](./presets/bitbucket.md): `repoPlugin.configs.bitbucket`
- [Codeberg / Forgejo](./presets/codeberg.md): `repoPlugin.configs.codeberg`
- [AWS](./presets/aws.md): `repoPlugin.configs.aws`
- [Azure](./presets/azure.md): `repoPlugin.configs.azure`
- [Google Cloud](./presets/google-cloud.md): `repoPlugin.configs.googleCloud`
- [Docker](./presets/docker.md): `repoPlugin.configs.docker`
- [Vercel](./presets/vercel.md): `repoPlugin.configs.vercel`
- [Netlify](./presets/netlify.md): `repoPlugin.configs.netlify`
- [DigitalOcean](./presets/digitalocean.md): `repoPlugin.configs.digitalOcean`
- [AI guidance](./presets/ai.md): `repoPlugin.configs.ai`

Example layering:

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.recommended,
  repoPlugin.configs.github,
];
```

## 4) Optional stricter profile

- `repoPlugin.configs.strict`: adds stricter policy checks on top of baseline
  ([details](./presets/strict.md)).
- `repoPlugin.configs.all`: enables all rules in the plugin
  ([details](./presets/all.md)).

## 5) Verify and explore

- Browse the [Preset rule matrix](./presets/index.md) to see exactly which rules
  are enabled where.
- Use [All preset](./presets/all.md) as the complete rule inventory.
- Share [Overview](./overview.md) internally when onboarding teammates.

## Next reads by scenario

- GitHub repositories: [GitHub preset](./presets/github.md)
- GitLab repositories: [GitLab preset](./presets/gitlab.md)
- Cross-provider hardening: [Strict preset](./presets/strict.md)
- AI policy files in repo root: [AI preset](./presets/ai.md)
