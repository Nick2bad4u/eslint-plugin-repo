# eslint-plugin-repo

ESLint plugin for enforcing repository-compliance standards across hosting providers such as GitHub, GitLab, Bitbucket, and Codeberg/Forgejo.

## Installation

```sh
npm install --save-dev eslint-plugin-repo typescript
```

## Quick start (Flat Config)

```js
import plugin from "eslint-plugin-repo";

export default [plugin.configs.recommended];
```

## Presets

- `repo-compliance.configs.recommended` — cross-provider baseline repository hygiene.
- `repo-compliance.configs.strict` — recommended plus stronger policy checks.
- `repo-compliance.configs.github` — GitHub-specific repository requirements.
- `repo-compliance.configs.gitlab` — GitLab-specific repository requirements.
- `repo-compliance.configs.bitbucket` — Bitbucket-specific repository requirements.
- `repo-compliance.configs.codeberg` — Codeberg/Forgejo-specific repository requirements.
- `repo-compliance.configs.all` — union of all current rules.

See detailed preset pages under [`docs/rules/presets`](./docs/rules/presets/).

## Rules

This section is synchronized from rule metadata.

| Rule | Description | ✅ | 🔒 | 🐙 | 🦊 | 🗻 | 🪣 | 🧩 | Fix |
| ---- | ----------- | - | -- | -- | -- | -- | -- | -- | --- |

## Contributing

- Run quality gates before opening a PR:
  - `npm run lint:all:fix:quiet`
  - `npm run typecheck`
  - `npm test`
- Keep docs and tests aligned with rule behavior.

## License

[MIT](./LICENSE)
