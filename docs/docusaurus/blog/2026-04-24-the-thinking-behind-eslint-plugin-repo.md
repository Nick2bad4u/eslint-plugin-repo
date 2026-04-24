---
slug: the-thinking-behind-eslint-plugin-repo
title: The Thinking Behind eslint-plugin-repo
authors: [nick]
tags: [architecture, linting, governance]
---

# The Thinking Behind eslint-plugin-repo

`eslint-plugin-repo` exists to move repository governance checks closer to the developer feedback loop.

Instead of relying only on CI failures after a PR opens, these rules surface policy drift during local linting.

<!-- truncate -->

## Core philosophy

- Keep rules explicit and narrowly scoped.
- Prefer actionable diagnostics over vague policy errors.
- Treat autofix as an assistive capability, not a silent rewrite mechanism.

## Why Docusaurus is part of the architecture

A rule plugin without durable docs quickly becomes difficult to adopt. The docs site is intentionally split:

- **Rule docs** for consumers.
- **Developer docs** for maintainers.
- **Generated API docs** for type and surface reference.

That split keeps onboarding and long-term maintenance practical.
