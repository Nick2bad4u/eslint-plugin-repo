---
title: Presets
description: Provider and policy presets for repository compliance.
---

# Presets

| Preset | Key | Purpose |
| --- | --- | --- |
| ✅ Recommended | `repo-compliance.configs.recommended` | Baseline repository policy checks |
| 🔒 Strict | `repo-compliance.configs.strict` | Recommended plus stronger policy requirements |
| 🐙 GitHub | `repo-compliance.configs.github` | GitHub repository hygiene and automation |
| 🦊 GitLab | `repo-compliance.configs.gitlab` | GitLab merge-request and CI hygiene |
| 🗻 Codeberg | `repo-compliance.configs.codeberg` | Forgejo/Codeberg workflow hygiene |
| 🪣 Bitbucket | `repo-compliance.configs.bitbucket` | Bitbucket pipelines policy checks |
| 🧩 All | `repo-compliance.configs.all` | All available rules |

## Rule matrix

| Rule | recommended | strict | github | gitlab | codeberg | bitbucket | all |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: |