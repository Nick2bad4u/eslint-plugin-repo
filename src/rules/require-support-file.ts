import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repo-compliance.configs.recommended",
            "repo-compliance.configs.strict",
            "repo-compliance.configs.github",
            "repo-compliance.configs.gitlab",
            "repo-compliance.configs.bitbucket",
            "repo-compliance.configs.codeberg",
            "repo-compliance.configs.all",
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
