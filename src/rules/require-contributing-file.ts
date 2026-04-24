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
        description: "require contribution guidelines at the repository root.",
        messageId: "missingContributingFile",
        messageText:
            "Repository is missing CONTRIBUTING.md. Add contribution guidelines so pull requests follow consistent standards.",
        name: "require-contributing-file",
        recommendation: true,
        requirement: {
            kind: "file",
            path: "CONTRIBUTING.md",
        },
    });

export default rule;
