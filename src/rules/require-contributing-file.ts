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
