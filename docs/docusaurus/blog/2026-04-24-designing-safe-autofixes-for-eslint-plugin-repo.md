---
slug: designing-safe-autofixes-for-eslint-plugin-repo
title: Designing Safe Autofixes for eslint-plugin-repo
authors:
  - nick
tags:
  - autofix
  - eslint
  - rule-authoring
---

# Designing Safe Autofixes for eslint-plugin-repo

Autofix quality is a trust problem. A single unsafe fixer can make users disable an otherwise valuable rule.

<!-- truncate -->

## Safety-first autofix principles

- Prefer small, deterministic edits.
- Avoid fixers when intent cannot be inferred with high confidence.
- Use `suggest` when multiple valid fixes exist.

## Practical safeguards

- Keep fixer ranges narrow and syntax-aware.
- Preserve comments and formatting boundaries.
- Test fixer output for parse validity and idempotence.

Safe autofixes improve adoption; risky autofixes undermine it.
