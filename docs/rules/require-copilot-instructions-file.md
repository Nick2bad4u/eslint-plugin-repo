# require-copilot-instructions-file

Require repository AI guidance via a Copilot instructions file.

## Targeted pattern scope

This rule checks for the presence of either:

- `.github/instructions/copilot-instructions.md` (preferred in repositories that
  use VS Code workspace instruction files)
- `.github/copilot-instructions.md` (native GitHub Copilot repository
  instructions)

At least one must exist.

## What this rule reports

This rule reports when neither supported Copilot instructions file is found.

## Why this rule exists

GitHub Copilot respects repository-level custom instructions, and this repository
also uses VS Code workspace instruction files under `.github/instructions/`.
Without a repository-scoped guidance file, AI suggestions default to generic
patterns that may conflict with the project's established conventions,
architecture, and maintenance boundaries. Providing these instructions upfront
improves AI suggestion quality and reduces review friction.

## ❌ Incorrect

```txt
// No repository-level Copilot instructions file exists
.github/
  CODEOWNERS
  dependabot.yml
src/
```

## ✅ Correct

```markdown
<!-- .github/instructions/copilot-instructions.md -->
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

Disable this rule if your team does not use GitHub Copilot, or if AI guidance is
managed entirely outside the repository and a repository-level instruction file
is intentionally absent.

> **Rule catalog ID:** R041

## Further reading

- [GitHub Docs: Adding repository instructions for GitHub Copilot](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot)
- [VS Code agent instructions and `.github/instructions/`](https://code.visualstudio.com/docs/copilot/copilot-customization)
