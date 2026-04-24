# require-license-file

Require a root-level license file.

## Targeted pattern scope

This rule checks the repository root for an explicit license file.

The rule accepts any of these filenames:

- `LICENSE`
- `LICENSE.md`
- `LICENSE.txt`

## What this rule reports

This rule reports repositories that do not declare redistribution terms with an
accepted license file.

## Why this rule exists

If a repository does not publish a license file, consumers cannot easily tell
what reuse, modification, or redistribution terms apply.

That uncertainty slows adoption and creates avoidable legal review work for
downstream users.

## ❌ Incorrect

```ts
// Repository files
// .
// ├── README.md
// ├── eslint.config.mjs
// └── package.json
//
// Missing: LICENSE, LICENSE.md, or LICENSE.txt
```

## ✅ Correct

```ts
// Repository files
// .
// ├── LICENSE
// ├── README.md
// └── package.json
```

```ts
// Repository files
// .
// ├── LICENSE.md
// ├── README.md
// └── package.json
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.recommended,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-license-file": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if the repository is not intended for external reuse and
your organization deliberately manages licensing out-of-band.

> **Rule catalog ID:** R002

## Further reading

- [Choose an open source license](https://choosealicense.com/)
- [GitHub Docs: Licensing a repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)
