---
sidebar_position: 3
---

# ADR 0002: Generated API docs boundary and workflow

## Status

Accepted

## Context

The docs site mixes hand-authored docs with generated API references. Hand-editing generated output creates drift and is routinely overwritten.

## Decision

Treat `site-docs/developer/api/**` as generated output only.

- Author explanatory content in hand-authored files outside generated subtrees.
- Regenerate API docs via repository scripts whenever API-facing source changes.
- Keep sidebars resilient by linking API index docs rather than hardcoding generated page IDs.

## Consequences

### Positive

- Lower maintenance burden and cleaner diffs.
- Fewer accidental edits that disappear on rebuild.
- Better CI consistency between local and hosted docs outputs.

### Negative

- Contributors must run generation scripts before previewing full API navigation.

## Follow-up

Document this boundary in contributor docs and PR templates where docs/API changes are common.
