# require-copilot-instructions-file

Require a GitHub Copilot instructions file in the `.github/` directory.

## Targeted pattern scope

This rule checks for the presence of either `.github/copilot-instructions.md` or
`.github/copilot-commit-message-instructions.md`. At least one must exist.

## What this rule reports

This rule reports when neither Copilot instructions file is found.

## Why this rule exists

GitHub Copilot respects a repository-level `.github/copilot-instructions.md` file
that gives the AI contextual guidance about the codebase: preferred patterns,
conventions, off-limits areas, and domain terminology. Without it, Copilot suggestions
default to generic patterns that may conflict with the project's established conventions
or architectural decisions. Providing these instructions upfront improves AI suggestion
quality and reduces review friction.

## ❌ Incorrect

```txt
// .github directory does not contain any Copilot instructions file
.github/
  CODEOWNERS
  dependabot.yml
src/
```

## ✅ Correct

```markdown
<!-- .github/copilot-instructions.md -->
## Repository conventions

- Use `const` for all variable declarations unless mutation is required.
- All async functions must handle errors with try/catch or `.catch()`.
- Follow the existing naming conventions in `src/rules/`.
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.ai,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-copilot-instructions-file": "warn",
    },
  },
];
```

## When not to use it

Disable this rule if your team does not use GitHub Copilot, or if Copilot instructions
are managed at the organisation level and a repository-level file is intentionally absent.

> **Rule catalog ID:** R041

## Further reading

- [GitHub Docs: Adding repository instructions for GitHub Copilot](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot)
