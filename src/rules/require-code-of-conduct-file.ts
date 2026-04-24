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
        description: "require a code of conduct for repository interactions.",
        messageId: "missingCodeOfConductFile",
        messageText:
            "Repository is missing CODE_OF_CONDUCT.md. Add one to define acceptable behavior and reporting channels.",
        name: "require-code-of-conduct-file",
        recommendation: true,
        requirement: {
            kind: "file",
            path: "CODE_OF_CONDUCT.md",
        },
    });

export default rule;
