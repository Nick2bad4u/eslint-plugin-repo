import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for this repository compliance requirement. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: ["repoPlugin.configs.all"],
        description:
            "require an intentional GitHub secret scanning path-exclusion configuration.",
        messageId: "missingSecretScanningConfig",
        messageText:
            "Repository is missing `.github/secret_scanning.yml`. Enable this opt-in rule only when the repository intentionally excludes paths from secret scanning, then document the narrowest necessary `paths-ignore` entries in that file.",
        name: "require-secret-scanning-config",
        recommendation: false,
        requirement: {
            kind: "file",
            path: ".github/secret_scanning.yml",
        },
    });

export default rule;
