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
            "require a .gitignore file at the repository root to exclude untracked files from version control.",
        messageId: "missingGitIgnoreFile",
        messageText:
            "Repository is missing a .gitignore file. Add .gitignore at the root to prevent build artefacts, local configuration, and dependency directories from being committed.",
        name: "require-gitignore-file",
        recommendation: true,
        requirement: {
            kind: "file",
            path: ".gitignore",
        },
    });

export default rule;
