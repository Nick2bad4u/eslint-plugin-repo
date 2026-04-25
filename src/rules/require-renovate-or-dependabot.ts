import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for this repository compliance requirement. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repoPlugin.configs.strict",
            "repoPlugin.configs.all",
        ],
        description:
            "require either Renovate or Dependabot configuration for automated dependency updates.",
        messageId: "missingDependencyUpdateConfig",
        messageText:
            "Repository is missing automated dependency update configuration. Add either Renovate (for example `renovate.json`, `renovate.config.js`, or `.renovaterc.yml`) or Dependabot (`.github/dependabot.yml` or legacy `.dependabot/config.yml`) to keep dependencies up to date.",
        name: "require-renovate-or-dependabot",
        recommendation: false,
        requirement: {
            kind: "any-of",
            requirements: [
                {
                    kind: "one-of",
                    paths: [
                        "renovate.json",
                        "renovate.json5",
                        "renovate.yml",
                        "renovate.yaml",
                        "renovate.config.js",
                        "renovate.config.cjs",
                        "renovate.config.mjs",
                        ".github/renovate.json",
                        ".github/renovate.json5",
                        ".github/renovate.yml",
                        ".github/renovate.yaml",
                        ".renovaterc",
                        ".renovaterc.json",
                        ".renovaterc.json5",
                        ".renovaterc.yml",
                        ".renovaterc.yaml",
                        ".renovaterc.js",
                        ".renovaterc.cjs",
                        ".renovaterc.mjs",
                    ],
                },
                {
                    kind: "one-of",
                    paths: [
                        ".github/dependabot.yml",
                        ".github/dependabot.yaml",
                        ".dependabot/config.yml",
                        ".dependabot/config.yaml",
                    ],
                },
            ],
        },
    });

export default rule;
