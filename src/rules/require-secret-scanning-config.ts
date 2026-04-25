import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for this repository compliance requirement. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repoPlugin.configs.github",
            "repoPlugin.configs.strict",
            "repoPlugin.configs.all",
        ],
        description:
            "require a GitHub secret scanning configuration file to define custom detection patterns.",
        messageId: "missingSecretScanningConfig",
        messageText:
            "Repository is missing a GitHub secret scanning configuration file (.github/secret_scanning.yml). Add it to define custom secret detection patterns and exclude paths from scanning.",
        name: "require-secret-scanning-config",
        recommendation: false,
        requirement: {
            kind: "one-of",
            paths: [
                ".github/secret_scanning.yml",
                ".github/secret_scanning.yaml",
            ],
        },
    });

export default rule;
