# require-single-codeowners-file

Require exactly one authoritative `CODEOWNERS` file location.

## Targeted pattern scope

This rule checks all recognised CODEOWNERS locations across platforms:

- `.github/CODEOWNERS` — GitHub: highest priority
- `.gitlab/CODEOWNERS` — GitLab: highest priority
- `.bitbucket/CODEOWNERS` — Bitbucket Cloud: supported location
- `CODEOWNERS` — shared root location
- `docs/CODEOWNERS` — GitHub: lowest priority

## What this rule reports

This rule reports repositories that define `CODEOWNERS` in more than one of
those locations.

Each platform applies its own precedence when multiple files exist and only uses
the first one it finds:

**GitHub** (highest → lowest):

1. `.github/CODEOWNERS`
2. `CODEOWNERS`
3. `docs/CODEOWNERS`

**GitLab** (highest → lowest):

1. `.gitlab/CODEOWNERS`
2. `CODEOWNERS`

**Bitbucket Cloud**:

1. `.bitbucket/CODEOWNERS`

## Why this rule exists

Multiple `CODEOWNERS` files create policy ambiguity.

Teams may update a lower-precedence file and expect behavior to change, while
the platform silently keeps using the higher-precedence file. That leads to
incorrect review routing and surprise ownership gaps.

## ❌ Incorrect

```ts
// Repository files
// .
// ├── CODEOWNERS
// └── .github/
//     └── CODEOWNERS
//
// GitHub will use .github/CODEOWNERS and silently ignore root CODEOWNERS.
```

```ts
// Repository files
// .
// ├── CODEOWNERS
// └── .gitlab/
//     └── CODEOWNERS
//
// GitLab will use .gitlab/CODEOWNERS and silently ignore root CODEOWNERS.
```

```ts
// Repository files
// .
// ├── CODEOWNERS
// └── .bitbucket/
//     └── CODEOWNERS
//
// Bitbucket Cloud uses .bitbucket/CODEOWNERS; the extra root file is ambiguity.
```

## ✅ Correct

```ts
// Repository files
// .
// ├── .github/
// │   └── CODEOWNERS
// └── README.md
```

```ts
// Repository files
// .
// ├── .gitlab/
// │   └── CODEOWNERS
// └── README.md
```

```ts
// Repository files
// .
// ├── .bitbucket/
// │   └── CODEOWNERS
// └── README.md
```

```ts
// Repository files
// .
// ├── CODEOWNERS
// └── README.md
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.strict,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-single-codeowners-file": "error",
    },
  },
];
```

## When not to use it

Disable this rule if your repository intentionally maintains separate CODEOWNERS
files for different CI/CD platforms — for example, a monorepo mirrored to both
GitHub, GitLab, and Bitbucket Cloud with platform-specific ownership policies
stored in `.github/CODEOWNERS`, `.gitlab/CODEOWNERS`, and
`.bitbucket/CODEOWNERS` respectively. In that scenario, the files serve
different runtimes and coexistence is deliberate.

Disable it for all other multi-file cases only after documenting the intended
precedence behavior for your team.

> **Rule catalog ID:** R116

## Further reading

- [GitHub Docs: About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [GitLab Docs: Code Owners](https://docs.gitlab.com/user/project/codeowners/)
- [Bitbucket Cloud Docs: Set up and use code owners](https://support.atlassian.com/bitbucket-cloud/docs/set-up-and-use-code-owners/)
