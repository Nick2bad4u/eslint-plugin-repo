---
sidebar_position: 1
---

# eslint-plugin-repo

`eslint-plugin-repo` helps repositories enforce provider-specific governance and hygiene files.

\:::tip What should I read first?

- New user? Start with [Getting Started](./getting-started.md).
- Evaluating coverage? Jump to [Rule Overview](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/overview).
- Maintaining the plugin or docs app? Open the [Developer Guide](./developer/index.md).

\:::

## What this documentation includes

- A complete **rule reference** for repository-file and provider compliance checks.
- **Getting Started** guidance for Flat Config projects.
- **Preset docs** for GitHub, GitLab, Bitbucket, Codeberg/Forgejo, AWS, Azure, Google Cloud, Docker, Vercel, Netlify, and DigitalOcean.
- A dedicated **developer section** with architecture notes, ADRs, and docs pipeline guidance.

## What to read first

1. Open [Getting Started](./getting-started.md) to install the plugin and enable your first preset.
2. Review [Rule Overview](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/overview) to understand rule categories and naming.
3. Visit the [Developer Guide](./developer/index.md) if you are maintaining rules, docs, or release workflows.

## Choose your route

### I want to lint one repository host well

- Start with [recommended](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/recommended).
- Add the provider preset your repository actually uses, such as [GitHub](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/github), [GitLab](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/gitlab), [Bitbucket](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/bitbucket), [Codeberg / Forgejo](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/codeberg), [AWS](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/aws), [Azure](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/azure), [Google Cloud](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/google-cloud), [Docker](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/docker), [Vercel](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/vercel), [Netlify](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/netlify), or [DigitalOcean](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/digitalocean).
- Use [strict](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) only after the baseline is stable.

### I want to understand the rule catalog

- Browse the [Rules overview](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/overview).
- Use the provider categories in the rules sidebar to narrow the list quickly.
- Read preset pages before enabling large groups of rules blindly.

### I maintain the plugin or docs

- Open the [Developer Guide](./developer/index.md).
- Review the [docs and API pipeline chart](./developer/charts/docs-and-api-pipeline.md).
- Use the [API guide](./developer/api/index.md) when changing plugin exports or TypeDoc output.

## Documentation map

- **Rule docs** (`/docs/rules/**`): End-user reference and preset usage.
- **Site docs** (`/docs/**`): Developer-facing architecture, lifecycle docs, and operational guides.
- **Blog** (`/blog/**`): Maintainer commentary and migration stories.

## Quick links

| Goal                         | Best starting point                                                   |
| ---------------------------- | --------------------------------------------------------------------- |
| Install the plugin           | [Getting Started](./getting-started.md)                               |
| Compare preset scope         | <https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets>  |
| Read provider-specific rules | <https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/overview> |
| Understand docs generation   | [Developer Guide](./developer/index.md)                               |

## Next step

Open the **Getting Started** page in the sidebar and enable your first preset.
