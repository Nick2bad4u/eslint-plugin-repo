---
sidebar_position: 3
---

# Typed Paths Inventory

Typed paths are route and documentation identifiers intentionally kept predictable so links remain stable across refactors.

## Why this matters

- Stable IDs reduce broken links in generated docs and sidebars.
- Predictable pathing keeps docs scripts and rule metadata helpers simpler.
- Consistent routes reduce churn for external links and release notes.

## Path domains in this repository

- `docs/rules/**`: user-facing rule reference documentation.
- `docs/docusaurus/site-docs/**`: hand-authored maintainer and architecture docs.
- `docs/docusaurus/site-docs/developer/api/**`: generated API docs from TypeDoc.

## Practical guidance

- Prefer additive paths over renaming existing paths.
- If a rename is unavoidable, update all internal links in the same change.
- Keep sidebar links route-based and verify with a docs build.
