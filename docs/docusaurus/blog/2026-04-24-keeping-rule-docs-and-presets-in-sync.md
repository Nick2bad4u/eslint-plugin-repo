---
slug: keeping-rule-docs-and-presets-in-sync
title: Keeping Rule Docs and Presets in Sync
authors: [nick]
tags: [documentation, presets, automation]
---

# Keeping Rule Docs and Presets in Sync

Rule docs and presets can drift if sync workflows are treated as optional.

<!-- truncate -->

## Working model

- Hand-author rule explanations and examples.
- Generate derived indexes/tables with repository scripts.
- Validate links and route stability in CI.

## Why this matters

A plugin can have technically correct rules and still be frustrating to adopt if documentation and preset behavior diverge. Sync automation reduces that risk, but maintainers still need to curate the narrative docs intentionally.
