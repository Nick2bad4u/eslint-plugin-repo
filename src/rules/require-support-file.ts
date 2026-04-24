import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for this repository compliance requirement. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repoPlugin.configs.recommended",
            "repoPlugin.configs.strict",
            "repoPlugin.configs.github",
            "repoPlugin.configs.gitlab",
            "repoPlugin.configs.bitbucket",
            "repoPlugin.configs.codeberg",
            "repoPlugin.configs.all",
        ],
        description: "require support and help channels documentation.",
        messageId: "missingSupportFile",
        messageText:
            "Repository is missing SUPPORT.md. Add support channels so users know where to ask questions and request help.",
        name: "require-support-file",
        recommendation: true,
        requirement: {
            kind: "file",
            path: "SUPPORT.md",
        },
    });

export default rule;
