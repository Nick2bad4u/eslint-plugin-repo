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
            "Repository is missing automated dependency update configuration. Add either Renovate (renovate.json, .github/renovate.json, .renovaterc) or Dependabot (.github/dependabot.yml) to keep dependencies up to date.",
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
                        ".github/renovate.json",
                        ".github/renovate.json5",
                        ".renovaterc",
                        ".renovaterc.json",
                    ],
                },
                {
                    kind: "one-of",
                    paths: [
                        ".github/dependabot.yml",
                        ".github/dependabot.yaml",
                    ],
                },
            ],
        },
    });

export default rule;
