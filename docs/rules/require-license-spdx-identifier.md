# require-license-spdx-identifier

Require an SPDX license identifier in the `LICENSE` file.

## Targeted pattern scope

This rule looks for a file named `LICENSE`, `LICENSE.md`, or `LICENSE.txt` in the
repository root and checks whether the first five lines contain either an
`SPDX-License-Identifier:` tag or a well-known SPDX identifier string (e.g.
`MIT License`, `Apache License`, `GNU General Public License`).

## What this rule reports

This rule reports when the `LICENSE` file does not contain a recognisable SPDX
license identifier in its opening lines.

## Why this rule exists

Machine-readable SPDX identifiers allow tooling (dependency scanners, SBOM generators,
legal compliance checks) to identify a project's license automatically. Without one,
automated tools must fall back to heuristic matching which is error-prone. Adding
`SPDX-License-Identifier: MIT` (or the appropriate identifier) costs nothing and
eliminates ambiguity for consumers, auditors, and automated compliance pipelines.

## ❌ Incorrect

```txt
Copyright 2024 My Organisation

Permission is hereby granted, free of charge, to any person obtaining a copy...
(no SPDX identifier present)
```

## ✅ Correct

```txt
SPDX-License-Identifier: MIT

Copyright 2024 My Organisation

Permission is hereby granted...
```

Or a standard heading recognised by this rule:

```txt
MIT License

Copyright (c) 2024 My Organisation
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.recommended,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-license-spdx-identifier": "warn",
    },
  },
];
```

## When not to use it

Disable this rule if your project uses a custom, proprietary, or non-SPDX license
where machine-readable identifiers are not applicable.

> **Rule catalog ID:** R045

## Further reading

- [SPDX License List](https://spdx.org/licenses/)
- [REUSE specification](https://reuse.software/spec/)
