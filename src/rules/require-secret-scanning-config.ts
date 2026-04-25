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
            "Repository is missing a GitHub secret scanning configuration surface. Add `.github/secret_scanning.yml`, `.github/secret-scanning.yml`, or a `.github/secret-scanning/*.yml` custom-pattern file to define repository-specific secret detection patterns.",
        name: "require-secret-scanning-config",
        recommendation: false,
        requirement: {
            kind: "any-of",
            requirements: [
                {
                    kind: "one-of",
                    paths: [
                        ".github/secret_scanning.yml",
                        ".github/secret_scanning.yaml",
                        ".github/secret-scanning.yml",
                        ".github/secret-scanning.yaml",
                    ],
                },
                {
                    directory: ".github/secret-scanning",
                    extensions: [".yml", ".yaml"],
                    kind: "directory-with-extension",
                },
            ],
        },
    });

export default rule;
