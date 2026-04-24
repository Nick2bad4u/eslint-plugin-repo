---
slug: type-aware-linting-without-surprises
title: Type-Aware Linting Without Surprises
authors:
  - nick
tags:
  - typescript
  - typed-rules
  - performance
---

# Type-Aware Linting Without Surprises

Type-aware rules are powerful, but they can be expensive or confusing when not designed carefully.

<!-- truncate -->

## Design constraints

- Keep type-checker calls targeted.
- Avoid repeated expensive lookups in hot paths.
- Fail gracefully when parser services are unavailable.

## UX contract

If a rule requires type information, documentation should state it and explain setup expectations.

Maintainers should optimize for predictable behavior and reliable performance over clever but fragile analysis.
