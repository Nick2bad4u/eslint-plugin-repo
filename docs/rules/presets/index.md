---
title: Presets
description: Provider and policy presets for repository compliance.
---

# Presets

| Preset                                | Key                               | Purpose                                               |
| ------------------------------------- | --------------------------------- | ----------------------------------------------------- |
| [✅ Recommended](./recommended.md)     | `repoPlugin.configs.recommended`  | Baseline repository policy checks                     |
| [🔒 Strict](./strict.md)              | `repoPlugin.configs.strict`       | Recommended plus stronger policy requirements         |
| [🐙 GitHub](./github.md)              | `repoPlugin.configs.github`       | GitHub repository hygiene and automation              |
| [🦊 GitLab](./gitlab.md)              | `repoPlugin.configs.gitlab`       | GitLab merge-request and CI hygiene                   |
| [🗻 Codeberg](./codeberg.md)          | `repoPlugin.configs.codeberg`     | Forgejo/Codeberg workflow hygiene                     |
| [🪣 Bitbucket](./bitbucket.md)        | `repoPlugin.configs.bitbucket`    | Bitbucket pipelines policy checks                     |
| [☁️ AWS](./aws.md)                    | `repoPlugin.configs.aws`          | AWS Amplify build-spec requirements                   |
| [🔷 Azure](./azure.md)                | `repoPlugin.configs.azure`        | Azure Pipelines policy checks                         |
| [🌤️ Google Cloud](./google-cloud.md) | `repoPlugin.configs.googleCloud`  | Google Cloud Build policy checks                      |
| [🐳 Docker](./docker.md)              | `repoPlugin.configs.docker`       | Docker packaging repository checks                    |
| [▲ Vercel](./vercel.md)               | `repoPlugin.configs.vercel`       | Vercel project configuration requirements             |
| [🌐 Netlify](./netlify.md)            | `repoPlugin.configs.netlify`      | Netlify build configuration requirements              |
| [🌊 DigitalOcean](./digitalocean.md)  | `repoPlugin.configs.digitalOcean` | DigitalOcean App Platform spec requirements           |
| [🤖 AI](./ai.md)                      | `repoPlugin.configs.ai`           | Repository guidance files for AI-assisted development |
| [🧩 All](./all.md)                    | `repoPlugin.configs.all`          | All available rules                                   |

## Rule matrix

- Fix legend:
  - 🔧 = autofixable
  - 💡 = suggestions available
  - — = report only
- Preset key legend:
  - [✅](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/recommended) — [`repoPlugin.configs.recommended`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/recommended)
  - [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) — [`repoPlugin.configs.strict`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict)
  - [🐙](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/github) — [`repoPlugin.configs.github`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/github)
  - [🦊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/gitlab) — [`repoPlugin.configs.gitlab`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/gitlab)
  - [🗻](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/codeberg) — [`repoPlugin.configs.codeberg`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/codeberg)
  - [🪣](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/bitbucket) — [`repoPlugin.configs.bitbucket`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/bitbucket)
  - [☁️](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/aws) — [`repoPlugin.configs.aws`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/aws)
  - [🔷](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/azure) — [`repoPlugin.configs.azure`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/azure)
  - [🌤️](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/google-cloud) — [`repoPlugin.configs.googleCloud`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/google-cloud)
  - [🐳](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/docker) — [`repoPlugin.configs.docker`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/docker)
  - [▲](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/vercel) — [`repoPlugin.configs.vercel`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/vercel)
  - [🌐](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/netlify) — [`repoPlugin.configs.netlify`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/netlify)
  - [🌊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/digitalocean) — [`repoPlugin.configs.digitalOcean`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/digitalocean)
  - [🤖](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/ai) — [`repoPlugin.configs.ai`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/ai)
  - [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) — [`repoPlugin.configs.all`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all)

| Rule | Fix | Preset key |
| --- | :-: | :-: |
| [`require-aws-amplify-artifacts-base-directory`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-artifacts-base-directory) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [☁️](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/aws) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-aws-amplify-artifacts-base-directory-relative-path`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-artifacts-base-directory-relative-path) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [☁️](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/aws) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-aws-amplify-artifacts-files`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-artifacts-files) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [☁️](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/aws) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-aws-amplify-artifacts-files-non-empty`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-artifacts-files-non-empty) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [☁️](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/aws) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-aws-amplify-build-commands`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-build-commands) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [☁️](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/aws) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-aws-amplify-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-config-file) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [☁️](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/aws) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-aws-amplify-version`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-version) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [☁️](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/aws) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-aws-amplify-version-value`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-version-value) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [☁️](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/aws) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-azure-pipelines-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-config-file) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🔷](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/azure) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-azure-pipelines-execution-plan`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-execution-plan) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🔷](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/azure) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-azure-pipelines-name`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-name) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🔷](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/azure) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-azure-pipelines-pr-branches`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-pr-branches) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🔷](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/azure) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-azure-pipelines-pr-trigger`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-pr-trigger) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🔷](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/azure) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-azure-pipelines-trigger`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-trigger) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🔷](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/azure) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-azure-pipelines-trigger-branches`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-trigger-branches) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🔷](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/azure) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-azure-pipelines-trigger-include-branches`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-trigger-include-branches) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🔷](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/azure) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-bitbucket-pipelines-clone-depth`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-clone-depth) | — | [🪣](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/bitbucket) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-bitbucket-pipelines-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-config-file) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🪣](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/bitbucket) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-bitbucket-pipelines-default-pipeline`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-default-pipeline) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🪣](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/bitbucket) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-bitbucket-pipelines-image-pinned-tag`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-image-pinned-tag) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🪣](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/bitbucket) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-bitbucket-pipelines-max-time`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-max-time) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🪣](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/bitbucket) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-bitbucket-pipelines-pull-requests`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-pull-requests) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🪣](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/bitbucket) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-bitbucket-pipelines-pull-requests-target-branches`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-pull-requests-target-branches) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🪣](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/bitbucket) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-bitbucket-pipelines-step-name`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-step-name) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🪣](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/bitbucket) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-changelog-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-changelog-file) | — | [✅](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/recommended) [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-code-of-conduct-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-code-of-conduct-file) | — | [✅](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/recommended) [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐙](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/github) [🦊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/gitlab) [🗻](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/codeberg) [🪣](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/bitbucket) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-codeowners-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-codeowners-file) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐙](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/github) [🦊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/gitlab) [🗻](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/codeberg) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-codeowners-reviewable-patterns`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-codeowners-reviewable-patterns) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐙](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/github) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-contributing-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-contributing-file) | — | [✅](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/recommended) [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐙](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/github) [🦊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/gitlab) [🗻](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/codeberg) [🪣](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/bitbucket) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-copilot-instructions-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-copilot-instructions-file) | — | [🤖](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/ai) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-dependabot-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dependabot-config-file) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐙](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/github) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-dependabot-grouping`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dependabot-grouping) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-dependabot-reviewers`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dependabot-reviewers) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐙](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/github) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-dependabot-schedule`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dependabot-schedule) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐙](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/github) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-dependabot-update-entries`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dependabot-update-entries) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-dependency-update-config`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dependency-update-config) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-digitalocean-app-spec-component`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-component) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🌊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/digitalocean) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-digitalocean-app-spec-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-file) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🌊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/digitalocean) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-digitalocean-app-spec-name`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-name) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🌊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/digitalocean) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-digitalocean-app-spec-name-value`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-name-value) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🌊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/digitalocean) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-digitalocean-app-spec-region`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-region) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🌊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/digitalocean) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-digitalocean-app-spec-region-lowercase`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-region-lowercase) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🌊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/digitalocean) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-digitalocean-app-spec-region-value`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-region-value) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🌊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/digitalocean) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-dockerfile`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐳](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/docker) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-dockerfile-base-image-tag`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-base-image-tag) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐳](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/docker) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-dockerfile-cmd-or-entrypoint`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-cmd-or-entrypoint) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐳](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/docker) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-dockerfile-first-instruction-from`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-first-instruction-from) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐳](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/docker) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-dockerfile-from-instruction`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-from-instruction) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐳](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/docker) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-dockerfile-user`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-user) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐳](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/docker) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-dockerfile-workdir`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-workdir) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐳](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/docker) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-dockerignore-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerignore-file) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐳](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/docker) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-forgejo-actions-concurrency`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-concurrency) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🗻](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/codeberg) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-forgejo-actions-job-timeout-minutes`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-job-timeout-minutes) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🗻](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/codeberg) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-forgejo-actions-no-write-all-permissions`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-no-write-all-permissions) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🗻](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/codeberg) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-forgejo-actions-pinned-sha`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-pinned-sha) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🗻](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/codeberg) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-forgejo-actions-workflow-dispatch`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-workflow-dispatch) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🗻](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/codeberg) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-forgejo-actions-workflow-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-workflow-file) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🗻](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/codeberg) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-forgejo-actions-workflow-name`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-workflow-name) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🗻](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/codeberg) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-forgejo-actions-workflow-permissions`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-workflow-permissions) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🗻](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/codeberg) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-forgejo-actions-workflow-trigger-coverage`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-workflow-trigger-coverage) | — | [🗻](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/codeberg) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-gitattributes-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitattributes-file) | — | [✅](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/recommended) [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-github-actions-workflow-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-github-actions-workflow-file) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐙](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/github) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-github-actions-workflow-name`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-github-actions-workflow-name) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐙](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/github) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-github-code-scanning-workflow`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-github-code-scanning-workflow) | — | [🐙](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/github) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-github-issue-template-labels`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-github-issue-template-labels) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐙](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/github) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-gitignore-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitignore-file) | — | [✅](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/recommended) [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-gitlab-ci-cache-policy`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-cache-policy) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🦊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/gitlab) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-gitlab-ci-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-config-file) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🦊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/gitlab) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-gitlab-ci-default-timeout`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-default-timeout) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🦊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/gitlab) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-gitlab-ci-interruptible`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-interruptible) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🦊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/gitlab) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-gitlab-ci-merge-request-pipelines`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-merge-request-pipelines) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🦊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/gitlab) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-gitlab-ci-needs-dag`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-needs-dag) | — | [🦊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/gitlab) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-gitlab-ci-rules-over-only-except`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-rules-over-only-except) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🦊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/gitlab) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-gitlab-ci-security-scanning`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-security-scanning) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🦊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/gitlab) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-gitlab-ci-stages`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-stages) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🦊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/gitlab) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-gitlab-ci-workflow-rules`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-workflow-rules) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🦊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/gitlab) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-gitlab-issue-template-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-issue-template-file) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🦊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/gitlab) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-gitlab-merge-request-template-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-merge-request-template-file) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🦊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/gitlab) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-google-cloud-build-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-config-file) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🌤️](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/google-cloud) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-google-cloud-build-step-name`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-step-name) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🌤️](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/google-cloud) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-google-cloud-build-steps`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-steps) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🌤️](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/google-cloud) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-google-cloud-build-steps-non-empty`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-steps-non-empty) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🌤️](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/google-cloud) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-google-cloud-build-timeout`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-timeout) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🌤️](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/google-cloud) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-google-cloud-build-timeout-format`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-timeout-format) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🌤️](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/google-cloud) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-google-cloud-build-timeout-max`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-timeout-max) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🌤️](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/google-cloud) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-google-cloud-build-timeout-positive`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-timeout-positive) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🌤️](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/google-cloud) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-issue-template-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-issue-template-file) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐙](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/github) [🦊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/gitlab) [🗻](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/codeberg) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-license-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-license-file) | — | [✅](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/recommended) [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐙](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/github) [🦊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/gitlab) [🗻](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/codeberg) [🪣](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/bitbucket) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-license-spdx-identifier`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-license-spdx-identifier) | — | [✅](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/recommended) [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-netlify-build-command`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-build-command) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🌐](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/netlify) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-netlify-build-command-non-empty`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-build-command-non-empty) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🌐](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/netlify) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-netlify-build-publish-directory`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-build-publish-directory) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🌐](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/netlify) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-netlify-build-section`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-build-section) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🌐](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/netlify) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-netlify-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-config-file) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🌐](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/netlify) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-netlify-publish-directory-no-trailing-slash`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-publish-directory-no-trailing-slash) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🌐](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/netlify) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-netlify-publish-directory-non-empty`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-publish-directory-non-empty) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🌐](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/netlify) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-netlify-publish-relative-path`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-publish-relative-path) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🌐](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/netlify) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-node-version-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-node-version-file) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-pr-template-checklist-items`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-pr-template-checklist-items) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-pull-request-template-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-pull-request-template-file) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐙](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/github) [🦊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/gitlab) [🗻](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/codeberg) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-readme-badges`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-readme-badges) | — | [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-readme-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-readme-file) | — | [✅](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/recommended) [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐙](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/github) [🦊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/gitlab) [🗻](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/codeberg) [🪣](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/bitbucket) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-readme-sections`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-readme-sections) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-release-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-release-config-file) | — | [🐙](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/github) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-secret-scanning-config`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-secret-scanning-config) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐙](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/github) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-security-policy-contact-channel`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-security-policy-contact-channel) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-security-policy-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-security-policy-file) | — | [✅](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/recommended) [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐙](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/github) [🦊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/gitlab) [🗻](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/codeberg) [🪣](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/bitbucket) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-support-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-support-file) | — | [✅](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/recommended) [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [🐙](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/github) [🦊](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/gitlab) [🗻](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/codeberg) [🪣](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/bitbucket) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-vercel-build-command`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-build-command) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [▲](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/vercel) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-vercel-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-config-file) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [▲](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/vercel) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-vercel-config-object`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-config-object) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [▲](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/vercel) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-vercel-schema`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-schema) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [▲](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/vercel) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-vercel-schema-url`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-schema-url) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [▲](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/vercel) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-vercel-valid-json`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-valid-json) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [▲](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/vercel) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |
| [`require-vercel-version-value`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-version-value) | — | [🔒](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/strict) [▲](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/vercel) [🧩](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets/all) |

## Rules grouped by preset

Rules are listed below by preset so you can scan exactly what each config enables.

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only

### ✅ Recommended

- Preset key: [`repoPlugin.configs.recommended`](./recommended.md)

| Rule | Fix |
| --- | :-: |
| [`require-changelog-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-changelog-file) | — |
| [`require-code-of-conduct-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-code-of-conduct-file) | — |
| [`require-contributing-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-contributing-file) | — |
| [`require-gitattributes-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitattributes-file) | — |
| [`require-gitignore-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitignore-file) | — |
| [`require-license-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-license-file) | — |
| [`require-license-spdx-identifier`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-license-spdx-identifier) | — |
| [`require-readme-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-readme-file) | — |
| [`require-security-policy-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-security-policy-file) | — |
| [`require-support-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-support-file) | — |

### 🔒 Strict

- Preset key: [`repoPlugin.configs.strict`](./strict.md)

| Rule | Fix |
| --- | :-: |
| [`require-aws-amplify-artifacts-base-directory`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-artifacts-base-directory) | — |
| [`require-aws-amplify-artifacts-base-directory-relative-path`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-artifacts-base-directory-relative-path) | — |
| [`require-aws-amplify-artifacts-files`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-artifacts-files) | — |
| [`require-aws-amplify-artifacts-files-non-empty`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-artifacts-files-non-empty) | — |
| [`require-aws-amplify-build-commands`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-build-commands) | — |
| [`require-aws-amplify-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-config-file) | — |
| [`require-aws-amplify-version`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-version) | — |
| [`require-aws-amplify-version-value`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-version-value) | — |
| [`require-azure-pipelines-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-config-file) | — |
| [`require-azure-pipelines-execution-plan`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-execution-plan) | — |
| [`require-azure-pipelines-name`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-name) | — |
| [`require-azure-pipelines-pr-branches`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-pr-branches) | — |
| [`require-azure-pipelines-pr-trigger`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-pr-trigger) | — |
| [`require-azure-pipelines-trigger`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-trigger) | — |
| [`require-azure-pipelines-trigger-branches`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-trigger-branches) | — |
| [`require-azure-pipelines-trigger-include-branches`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-trigger-include-branches) | — |
| [`require-bitbucket-pipelines-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-config-file) | — |
| [`require-bitbucket-pipelines-default-pipeline`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-default-pipeline) | — |
| [`require-bitbucket-pipelines-image-pinned-tag`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-image-pinned-tag) | — |
| [`require-bitbucket-pipelines-max-time`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-max-time) | — |
| [`require-bitbucket-pipelines-pull-requests`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-pull-requests) | — |
| [`require-bitbucket-pipelines-pull-requests-target-branches`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-pull-requests-target-branches) | — |
| [`require-bitbucket-pipelines-step-name`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-step-name) | — |
| [`require-changelog-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-changelog-file) | — |
| [`require-code-of-conduct-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-code-of-conduct-file) | — |
| [`require-codeowners-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-codeowners-file) | — |
| [`require-codeowners-reviewable-patterns`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-codeowners-reviewable-patterns) | — |
| [`require-contributing-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-contributing-file) | — |
| [`require-dependabot-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dependabot-config-file) | — |
| [`require-dependabot-grouping`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dependabot-grouping) | — |
| [`require-dependabot-reviewers`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dependabot-reviewers) | — |
| [`require-dependabot-schedule`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dependabot-schedule) | — |
| [`require-dependabot-update-entries`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dependabot-update-entries) | — |
| [`require-dependency-update-config`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dependency-update-config) | — |
| [`require-digitalocean-app-spec-component`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-component) | — |
| [`require-digitalocean-app-spec-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-file) | — |
| [`require-digitalocean-app-spec-name`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-name) | — |
| [`require-digitalocean-app-spec-name-value`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-name-value) | — |
| [`require-digitalocean-app-spec-region`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-region) | — |
| [`require-digitalocean-app-spec-region-lowercase`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-region-lowercase) | — |
| [`require-digitalocean-app-spec-region-value`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-region-value) | — |
| [`require-dockerfile`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile) | — |
| [`require-dockerfile-base-image-tag`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-base-image-tag) | — |
| [`require-dockerfile-cmd-or-entrypoint`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-cmd-or-entrypoint) | — |
| [`require-dockerfile-first-instruction-from`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-first-instruction-from) | — |
| [`require-dockerfile-from-instruction`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-from-instruction) | — |
| [`require-dockerfile-user`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-user) | — |
| [`require-dockerfile-workdir`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-workdir) | — |
| [`require-dockerignore-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerignore-file) | — |
| [`require-forgejo-actions-concurrency`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-concurrency) | — |
| [`require-forgejo-actions-job-timeout-minutes`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-job-timeout-minutes) | — |
| [`require-forgejo-actions-no-write-all-permissions`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-no-write-all-permissions) | — |
| [`require-forgejo-actions-pinned-sha`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-pinned-sha) | — |
| [`require-forgejo-actions-workflow-dispatch`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-workflow-dispatch) | — |
| [`require-forgejo-actions-workflow-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-workflow-file) | — |
| [`require-forgejo-actions-workflow-name`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-workflow-name) | — |
| [`require-forgejo-actions-workflow-permissions`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-workflow-permissions) | — |
| [`require-gitattributes-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitattributes-file) | — |
| [`require-github-actions-workflow-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-github-actions-workflow-file) | — |
| [`require-github-actions-workflow-name`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-github-actions-workflow-name) | — |
| [`require-github-issue-template-labels`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-github-issue-template-labels) | — |
| [`require-gitignore-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitignore-file) | — |
| [`require-gitlab-ci-cache-policy`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-cache-policy) | — |
| [`require-gitlab-ci-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-config-file) | — |
| [`require-gitlab-ci-default-timeout`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-default-timeout) | — |
| [`require-gitlab-ci-interruptible`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-interruptible) | — |
| [`require-gitlab-ci-merge-request-pipelines`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-merge-request-pipelines) | — |
| [`require-gitlab-ci-rules-over-only-except`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-rules-over-only-except) | — |
| [`require-gitlab-ci-security-scanning`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-security-scanning) | — |
| [`require-gitlab-ci-stages`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-stages) | — |
| [`require-gitlab-ci-workflow-rules`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-workflow-rules) | — |
| [`require-gitlab-issue-template-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-issue-template-file) | — |
| [`require-gitlab-merge-request-template-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-merge-request-template-file) | — |
| [`require-google-cloud-build-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-config-file) | — |
| [`require-google-cloud-build-step-name`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-step-name) | — |
| [`require-google-cloud-build-steps`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-steps) | — |
| [`require-google-cloud-build-steps-non-empty`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-steps-non-empty) | — |
| [`require-google-cloud-build-timeout`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-timeout) | — |
| [`require-google-cloud-build-timeout-format`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-timeout-format) | — |
| [`require-google-cloud-build-timeout-max`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-timeout-max) | — |
| [`require-google-cloud-build-timeout-positive`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-timeout-positive) | — |
| [`require-issue-template-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-issue-template-file) | — |
| [`require-license-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-license-file) | — |
| [`require-license-spdx-identifier`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-license-spdx-identifier) | — |
| [`require-netlify-build-command`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-build-command) | — |
| [`require-netlify-build-command-non-empty`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-build-command-non-empty) | — |
| [`require-netlify-build-publish-directory`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-build-publish-directory) | — |
| [`require-netlify-build-section`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-build-section) | — |
| [`require-netlify-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-config-file) | — |
| [`require-netlify-publish-directory-no-trailing-slash`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-publish-directory-no-trailing-slash) | — |
| [`require-netlify-publish-directory-non-empty`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-publish-directory-non-empty) | — |
| [`require-netlify-publish-relative-path`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-publish-relative-path) | — |
| [`require-node-version-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-node-version-file) | — |
| [`require-pr-template-checklist-items`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-pr-template-checklist-items) | — |
| [`require-pull-request-template-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-pull-request-template-file) | — |
| [`require-readme-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-readme-file) | — |
| [`require-readme-sections`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-readme-sections) | — |
| [`require-secret-scanning-config`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-secret-scanning-config) | — |
| [`require-security-policy-contact-channel`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-security-policy-contact-channel) | — |
| [`require-security-policy-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-security-policy-file) | — |
| [`require-support-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-support-file) | — |
| [`require-vercel-build-command`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-build-command) | — |
| [`require-vercel-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-config-file) | — |
| [`require-vercel-config-object`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-config-object) | — |
| [`require-vercel-schema`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-schema) | — |
| [`require-vercel-schema-url`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-schema-url) | — |
| [`require-vercel-valid-json`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-valid-json) | — |
| [`require-vercel-version-value`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-version-value) | — |

### 🐙 GitHub

- Preset key: [`repoPlugin.configs.github`](./github.md)

| Rule | Fix |
| --- | :-: |
| [`require-code-of-conduct-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-code-of-conduct-file) | — |
| [`require-codeowners-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-codeowners-file) | — |
| [`require-codeowners-reviewable-patterns`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-codeowners-reviewable-patterns) | — |
| [`require-contributing-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-contributing-file) | — |
| [`require-dependabot-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dependabot-config-file) | — |
| [`require-dependabot-reviewers`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dependabot-reviewers) | — |
| [`require-dependabot-schedule`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dependabot-schedule) | — |
| [`require-github-actions-workflow-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-github-actions-workflow-file) | — |
| [`require-github-actions-workflow-name`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-github-actions-workflow-name) | — |
| [`require-github-code-scanning-workflow`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-github-code-scanning-workflow) | — |
| [`require-github-issue-template-labels`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-github-issue-template-labels) | — |
| [`require-issue-template-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-issue-template-file) | — |
| [`require-license-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-license-file) | — |
| [`require-pull-request-template-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-pull-request-template-file) | — |
| [`require-readme-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-readme-file) | — |
| [`require-release-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-release-config-file) | — |
| [`require-secret-scanning-config`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-secret-scanning-config) | — |
| [`require-security-policy-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-security-policy-file) | — |
| [`require-support-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-support-file) | — |

### 🦊 GitLab

- Preset key: [`repoPlugin.configs.gitlab`](./gitlab.md)

| Rule | Fix |
| --- | :-: |
| [`require-code-of-conduct-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-code-of-conduct-file) | — |
| [`require-codeowners-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-codeowners-file) | — |
| [`require-contributing-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-contributing-file) | — |
| [`require-gitlab-ci-cache-policy`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-cache-policy) | — |
| [`require-gitlab-ci-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-config-file) | — |
| [`require-gitlab-ci-default-timeout`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-default-timeout) | — |
| [`require-gitlab-ci-interruptible`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-interruptible) | — |
| [`require-gitlab-ci-merge-request-pipelines`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-merge-request-pipelines) | — |
| [`require-gitlab-ci-needs-dag`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-needs-dag) | — |
| [`require-gitlab-ci-rules-over-only-except`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-rules-over-only-except) | — |
| [`require-gitlab-ci-security-scanning`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-security-scanning) | — |
| [`require-gitlab-ci-stages`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-stages) | — |
| [`require-gitlab-ci-workflow-rules`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-workflow-rules) | — |
| [`require-gitlab-issue-template-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-issue-template-file) | — |
| [`require-gitlab-merge-request-template-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-merge-request-template-file) | — |
| [`require-issue-template-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-issue-template-file) | — |
| [`require-license-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-license-file) | — |
| [`require-pull-request-template-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-pull-request-template-file) | — |
| [`require-readme-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-readme-file) | — |
| [`require-security-policy-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-security-policy-file) | — |
| [`require-support-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-support-file) | — |

### 🗻 Codeberg / Forgejo

- Preset key: [`repoPlugin.configs.codeberg`](./codeberg.md)

| Rule | Fix |
| --- | :-: |
| [`require-code-of-conduct-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-code-of-conduct-file) | — |
| [`require-codeowners-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-codeowners-file) | — |
| [`require-contributing-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-contributing-file) | — |
| [`require-forgejo-actions-concurrency`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-concurrency) | — |
| [`require-forgejo-actions-job-timeout-minutes`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-job-timeout-minutes) | — |
| [`require-forgejo-actions-no-write-all-permissions`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-no-write-all-permissions) | — |
| [`require-forgejo-actions-pinned-sha`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-pinned-sha) | — |
| [`require-forgejo-actions-workflow-dispatch`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-workflow-dispatch) | — |
| [`require-forgejo-actions-workflow-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-workflow-file) | — |
| [`require-forgejo-actions-workflow-name`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-workflow-name) | — |
| [`require-forgejo-actions-workflow-permissions`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-workflow-permissions) | — |
| [`require-forgejo-actions-workflow-trigger-coverage`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-workflow-trigger-coverage) | — |
| [`require-issue-template-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-issue-template-file) | — |
| [`require-license-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-license-file) | — |
| [`require-pull-request-template-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-pull-request-template-file) | — |
| [`require-readme-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-readme-file) | — |
| [`require-security-policy-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-security-policy-file) | — |
| [`require-support-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-support-file) | — |

### 🪣 Bitbucket

- Preset key: [`repoPlugin.configs.bitbucket`](./bitbucket.md)

| Rule | Fix |
| --- | :-: |
| [`require-bitbucket-pipelines-clone-depth`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-clone-depth) | — |
| [`require-bitbucket-pipelines-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-config-file) | — |
| [`require-bitbucket-pipelines-default-pipeline`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-default-pipeline) | — |
| [`require-bitbucket-pipelines-image-pinned-tag`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-image-pinned-tag) | — |
| [`require-bitbucket-pipelines-max-time`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-max-time) | — |
| [`require-bitbucket-pipelines-pull-requests`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-pull-requests) | — |
| [`require-bitbucket-pipelines-pull-requests-target-branches`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-pull-requests-target-branches) | — |
| [`require-bitbucket-pipelines-step-name`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-step-name) | — |
| [`require-code-of-conduct-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-code-of-conduct-file) | — |
| [`require-contributing-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-contributing-file) | — |
| [`require-license-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-license-file) | — |
| [`require-readme-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-readme-file) | — |
| [`require-security-policy-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-security-policy-file) | — |
| [`require-support-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-support-file) | — |

### ☁️ AWS

- Preset key: [`repoPlugin.configs.aws`](./aws.md)

| Rule | Fix |
| --- | :-: |
| [`require-aws-amplify-artifacts-base-directory`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-artifacts-base-directory) | — |
| [`require-aws-amplify-artifacts-base-directory-relative-path`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-artifacts-base-directory-relative-path) | — |
| [`require-aws-amplify-artifacts-files`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-artifacts-files) | — |
| [`require-aws-amplify-artifacts-files-non-empty`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-artifacts-files-non-empty) | — |
| [`require-aws-amplify-build-commands`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-build-commands) | — |
| [`require-aws-amplify-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-config-file) | — |
| [`require-aws-amplify-version`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-version) | — |
| [`require-aws-amplify-version-value`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-version-value) | — |

### 🔷 Azure

- Preset key: [`repoPlugin.configs.azure`](./azure.md)

| Rule | Fix |
| --- | :-: |
| [`require-azure-pipelines-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-config-file) | — |
| [`require-azure-pipelines-execution-plan`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-execution-plan) | — |
| [`require-azure-pipelines-name`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-name) | — |
| [`require-azure-pipelines-pr-branches`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-pr-branches) | — |
| [`require-azure-pipelines-pr-trigger`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-pr-trigger) | — |
| [`require-azure-pipelines-trigger`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-trigger) | — |
| [`require-azure-pipelines-trigger-branches`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-trigger-branches) | — |
| [`require-azure-pipelines-trigger-include-branches`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-trigger-include-branches) | — |

### 🌤️ Google Cloud

- Preset key: [`repoPlugin.configs.googleCloud`](./google-cloud.md)

| Rule | Fix |
| --- | :-: |
| [`require-google-cloud-build-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-config-file) | — |
| [`require-google-cloud-build-step-name`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-step-name) | — |
| [`require-google-cloud-build-steps`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-steps) | — |
| [`require-google-cloud-build-steps-non-empty`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-steps-non-empty) | — |
| [`require-google-cloud-build-timeout`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-timeout) | — |
| [`require-google-cloud-build-timeout-format`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-timeout-format) | — |
| [`require-google-cloud-build-timeout-max`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-timeout-max) | — |
| [`require-google-cloud-build-timeout-positive`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-timeout-positive) | — |

### 🐳 Docker

- Preset key: [`repoPlugin.configs.docker`](./docker.md)

| Rule | Fix |
| --- | :-: |
| [`require-dockerfile`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile) | — |
| [`require-dockerfile-base-image-tag`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-base-image-tag) | — |
| [`require-dockerfile-cmd-or-entrypoint`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-cmd-or-entrypoint) | — |
| [`require-dockerfile-first-instruction-from`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-first-instruction-from) | — |
| [`require-dockerfile-from-instruction`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-from-instruction) | — |
| [`require-dockerfile-user`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-user) | — |
| [`require-dockerfile-workdir`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-workdir) | — |
| [`require-dockerignore-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerignore-file) | — |

### ▲ Vercel

- Preset key: [`repoPlugin.configs.vercel`](./vercel.md)

| Rule | Fix |
| --- | :-: |
| [`require-vercel-build-command`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-build-command) | — |
| [`require-vercel-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-config-file) | — |
| [`require-vercel-config-object`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-config-object) | — |
| [`require-vercel-schema`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-schema) | — |
| [`require-vercel-schema-url`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-schema-url) | — |
| [`require-vercel-valid-json`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-valid-json) | — |
| [`require-vercel-version-value`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-version-value) | — |

### 🌐 Netlify

- Preset key: [`repoPlugin.configs.netlify`](./netlify.md)

| Rule | Fix |
| --- | :-: |
| [`require-netlify-build-command`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-build-command) | — |
| [`require-netlify-build-command-non-empty`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-build-command-non-empty) | — |
| [`require-netlify-build-publish-directory`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-build-publish-directory) | — |
| [`require-netlify-build-section`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-build-section) | — |
| [`require-netlify-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-config-file) | — |
| [`require-netlify-publish-directory-no-trailing-slash`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-publish-directory-no-trailing-slash) | — |
| [`require-netlify-publish-directory-non-empty`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-publish-directory-non-empty) | — |
| [`require-netlify-publish-relative-path`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-publish-relative-path) | — |

### 🌊 DigitalOcean

- Preset key: [`repoPlugin.configs.digitalOcean`](./digitalocean.md)

| Rule | Fix |
| --- | :-: |
| [`require-digitalocean-app-spec-component`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-component) | — |
| [`require-digitalocean-app-spec-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-file) | — |
| [`require-digitalocean-app-spec-name`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-name) | — |
| [`require-digitalocean-app-spec-name-value`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-name-value) | — |
| [`require-digitalocean-app-spec-region`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-region) | — |
| [`require-digitalocean-app-spec-region-lowercase`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-region-lowercase) | — |
| [`require-digitalocean-app-spec-region-value`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-region-value) | — |

### 🤖 AI

- Preset key: [`repoPlugin.configs.ai`](./ai.md)

| Rule | Fix |
| --- | :-: |
| [`require-copilot-instructions-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-copilot-instructions-file) | — |

### 🧩 All

- Preset key: [`repoPlugin.configs.all`](./all.md)

| Rule | Fix |
| --- | :-: |
| [`require-aws-amplify-artifacts-base-directory`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-artifacts-base-directory) | — |
| [`require-aws-amplify-artifacts-base-directory-relative-path`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-artifacts-base-directory-relative-path) | — |
| [`require-aws-amplify-artifacts-files`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-artifacts-files) | — |
| [`require-aws-amplify-artifacts-files-non-empty`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-artifacts-files-non-empty) | — |
| [`require-aws-amplify-build-commands`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-build-commands) | — |
| [`require-aws-amplify-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-config-file) | — |
| [`require-aws-amplify-version`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-version) | — |
| [`require-aws-amplify-version-value`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-aws-amplify-version-value) | — |
| [`require-azure-pipelines-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-config-file) | — |
| [`require-azure-pipelines-execution-plan`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-execution-plan) | — |
| [`require-azure-pipelines-name`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-name) | — |
| [`require-azure-pipelines-pr-branches`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-pr-branches) | — |
| [`require-azure-pipelines-pr-trigger`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-pr-trigger) | — |
| [`require-azure-pipelines-trigger`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-trigger) | — |
| [`require-azure-pipelines-trigger-branches`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-trigger-branches) | — |
| [`require-azure-pipelines-trigger-include-branches`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-azure-pipelines-trigger-include-branches) | — |
| [`require-bitbucket-pipelines-clone-depth`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-clone-depth) | — |
| [`require-bitbucket-pipelines-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-config-file) | — |
| [`require-bitbucket-pipelines-default-pipeline`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-default-pipeline) | — |
| [`require-bitbucket-pipelines-image-pinned-tag`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-image-pinned-tag) | — |
| [`require-bitbucket-pipelines-max-time`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-max-time) | — |
| [`require-bitbucket-pipelines-pull-requests`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-pull-requests) | — |
| [`require-bitbucket-pipelines-pull-requests-target-branches`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-pull-requests-target-branches) | — |
| [`require-bitbucket-pipelines-step-name`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-bitbucket-pipelines-step-name) | — |
| [`require-changelog-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-changelog-file) | — |
| [`require-code-of-conduct-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-code-of-conduct-file) | — |
| [`require-codeowners-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-codeowners-file) | — |
| [`require-codeowners-reviewable-patterns`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-codeowners-reviewable-patterns) | — |
| [`require-contributing-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-contributing-file) | — |
| [`require-copilot-instructions-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-copilot-instructions-file) | — |
| [`require-dependabot-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dependabot-config-file) | — |
| [`require-dependabot-grouping`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dependabot-grouping) | — |
| [`require-dependabot-reviewers`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dependabot-reviewers) | — |
| [`require-dependabot-schedule`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dependabot-schedule) | — |
| [`require-dependabot-update-entries`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dependabot-update-entries) | — |
| [`require-dependency-update-config`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dependency-update-config) | — |
| [`require-digitalocean-app-spec-component`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-component) | — |
| [`require-digitalocean-app-spec-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-file) | — |
| [`require-digitalocean-app-spec-name`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-name) | — |
| [`require-digitalocean-app-spec-name-value`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-name-value) | — |
| [`require-digitalocean-app-spec-region`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-region) | — |
| [`require-digitalocean-app-spec-region-lowercase`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-region-lowercase) | — |
| [`require-digitalocean-app-spec-region-value`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-digitalocean-app-spec-region-value) | — |
| [`require-dockerfile`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile) | — |
| [`require-dockerfile-base-image-tag`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-base-image-tag) | — |
| [`require-dockerfile-cmd-or-entrypoint`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-cmd-or-entrypoint) | — |
| [`require-dockerfile-first-instruction-from`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-first-instruction-from) | — |
| [`require-dockerfile-from-instruction`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-from-instruction) | — |
| [`require-dockerfile-user`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-user) | — |
| [`require-dockerfile-workdir`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerfile-workdir) | — |
| [`require-dockerignore-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-dockerignore-file) | — |
| [`require-forgejo-actions-concurrency`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-concurrency) | — |
| [`require-forgejo-actions-job-timeout-minutes`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-job-timeout-minutes) | — |
| [`require-forgejo-actions-no-write-all-permissions`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-no-write-all-permissions) | — |
| [`require-forgejo-actions-pinned-sha`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-pinned-sha) | — |
| [`require-forgejo-actions-workflow-dispatch`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-workflow-dispatch) | — |
| [`require-forgejo-actions-workflow-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-workflow-file) | — |
| [`require-forgejo-actions-workflow-name`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-workflow-name) | — |
| [`require-forgejo-actions-workflow-permissions`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-workflow-permissions) | — |
| [`require-forgejo-actions-workflow-trigger-coverage`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-forgejo-actions-workflow-trigger-coverage) | — |
| [`require-gitattributes-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitattributes-file) | — |
| [`require-github-actions-workflow-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-github-actions-workflow-file) | — |
| [`require-github-actions-workflow-name`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-github-actions-workflow-name) | — |
| [`require-github-code-scanning-workflow`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-github-code-scanning-workflow) | — |
| [`require-github-issue-template-labels`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-github-issue-template-labels) | — |
| [`require-gitignore-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitignore-file) | — |
| [`require-gitlab-ci-cache-policy`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-cache-policy) | — |
| [`require-gitlab-ci-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-config-file) | — |
| [`require-gitlab-ci-default-timeout`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-default-timeout) | — |
| [`require-gitlab-ci-interruptible`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-interruptible) | — |
| [`require-gitlab-ci-merge-request-pipelines`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-merge-request-pipelines) | — |
| [`require-gitlab-ci-needs-dag`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-needs-dag) | — |
| [`require-gitlab-ci-rules-over-only-except`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-rules-over-only-except) | — |
| [`require-gitlab-ci-security-scanning`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-security-scanning) | — |
| [`require-gitlab-ci-stages`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-stages) | — |
| [`require-gitlab-ci-workflow-rules`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-ci-workflow-rules) | — |
| [`require-gitlab-issue-template-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-issue-template-file) | — |
| [`require-gitlab-merge-request-template-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-gitlab-merge-request-template-file) | — |
| [`require-google-cloud-build-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-config-file) | — |
| [`require-google-cloud-build-step-name`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-step-name) | — |
| [`require-google-cloud-build-steps`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-steps) | — |
| [`require-google-cloud-build-steps-non-empty`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-steps-non-empty) | — |
| [`require-google-cloud-build-timeout`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-timeout) | — |
| [`require-google-cloud-build-timeout-format`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-timeout-format) | — |
| [`require-google-cloud-build-timeout-max`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-timeout-max) | — |
| [`require-google-cloud-build-timeout-positive`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-google-cloud-build-timeout-positive) | — |
| [`require-issue-template-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-issue-template-file) | — |
| [`require-license-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-license-file) | — |
| [`require-license-spdx-identifier`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-license-spdx-identifier) | — |
| [`require-netlify-build-command`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-build-command) | — |
| [`require-netlify-build-command-non-empty`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-build-command-non-empty) | — |
| [`require-netlify-build-publish-directory`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-build-publish-directory) | — |
| [`require-netlify-build-section`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-build-section) | — |
| [`require-netlify-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-config-file) | — |
| [`require-netlify-publish-directory-no-trailing-slash`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-publish-directory-no-trailing-slash) | — |
| [`require-netlify-publish-directory-non-empty`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-publish-directory-non-empty) | — |
| [`require-netlify-publish-relative-path`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-netlify-publish-relative-path) | — |
| [`require-node-version-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-node-version-file) | — |
| [`require-pr-template-checklist-items`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-pr-template-checklist-items) | — |
| [`require-pull-request-template-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-pull-request-template-file) | — |
| [`require-readme-badges`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-readme-badges) | — |
| [`require-readme-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-readme-file) | — |
| [`require-readme-sections`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-readme-sections) | — |
| [`require-release-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-release-config-file) | — |
| [`require-secret-scanning-config`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-secret-scanning-config) | — |
| [`require-security-policy-contact-channel`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-security-policy-contact-channel) | — |
| [`require-security-policy-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-security-policy-file) | — |
| [`require-support-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-support-file) | — |
| [`require-vercel-build-command`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-build-command) | — |
| [`require-vercel-config-file`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-config-file) | — |
| [`require-vercel-config-object`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-config-object) | — |
| [`require-vercel-schema`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-schema) | — |
| [`require-vercel-schema-url`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-schema-url) | — |
| [`require-vercel-valid-json`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-valid-json) | — |
| [`require-vercel-version-value`](https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-vercel-version-value) | — |
