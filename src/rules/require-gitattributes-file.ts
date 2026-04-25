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
            "require a .gitattributes file at the repository root to normalise line endings and diff attributes.",
        messageId: "missingGitAttributesFile",
        messageText:
            "Repository is missing a .gitattributes file. Add .gitattributes at the root to normalise line endings (CRLF/LF) and configure diff/merge attributes for binary files.",
        name: "require-gitattributes-file",
        recommendation: true,
        requirement: {
            kind: "file",
            path: ".gitattributes",
        },
    });

export default rule;
