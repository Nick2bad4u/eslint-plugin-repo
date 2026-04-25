# require-readme-sections

Require specific sections in the README file.

## Targeted pattern scope

This rule reads `README.md`, `README`, `readme.md`, or `README.rst` and checks for
the presence of required headings (H1 or H2 level).

## What this rule reports

This rule reports when one or more of the configured required section headings is
missing from the README.

## Why this rule exists

A README without an installation guide and usage examples leaves contributors and
consumers without the information they need to use the project. Requiring these sections
as a lint rule means gaps are caught automatically during CI rather than discovered
by confused first-time users.

## ❌ Incorrect

```markdown
# my-library

A useful library.

### API Reference

Describes functions.
```

With default options, this README is non-compliant because it contains no
`Installation` or `Usage` heading.

## ✅ Correct

```markdown
# my-library

A useful library.

## Installation

Run `npm install my-library`.

## Usage

Import and call `foo()` from `my-library`.
```

## Behavior and migration notes

The rule accepts an options object with a `requiredSections` array. Heading matching
is **case-insensitive** and heading level is not checked. The default required sections
are `["Installation", "Usage"]`.

```ts
interface Options {
  requiredSections?: string[]; // default: ["Installation", "Usage"]
}
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.strict,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-readme-sections": [
        "warn",
        { requiredSections: ["Installation", "Usage", "Contributing"] },
      ],
    },
  },
];
```

## When not to use it

Disable or configure this rule if your project type (e.g. internal tooling,
documentation-only repo) does not require installation or usage sections, or
if your README follows a different structure convention.

> **Rule catalog ID:** R048

## Further reading

- [Make a README](https://www.makeareadme.com/)
- [Awesome README](https://github.com/matiassingers/awesome-readme)
