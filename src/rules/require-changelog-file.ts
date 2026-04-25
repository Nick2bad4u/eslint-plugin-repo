import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for this repository compliance requirement. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repoPlugin.configs.recommended",
            "repoPlugin.configs.strict",
            "repoPlugin.configs.all",
        ],
        description:
            "require a CHANGELOG file at the repository root to track release history.",
        messageId: "missingChangelogFile",
        messageText:
            "Repository is missing a CHANGELOG file. Add CHANGELOG.md (or CHANGELOG.txt) at the root to document release history and changes between versions.",
        name: "require-changelog-file",
        recommendation: true,
        requirement: {
            kind: "one-of",
            paths: [
                "CHANGELOG.md",
                "CHANGELOG",
                "CHANGELOG.txt",
                "HISTORY.md",
                "HISTORY",
                "RELEASES.md",
                "RELEASES",
            ],
        },
    });

export default rule;
