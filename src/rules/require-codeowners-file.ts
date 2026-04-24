import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for this repository compliance requirement. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repoPlugin.configs.strict",
            "repoPlugin.configs.github",
            "repoPlugin.configs.gitlab",
            "repoPlugin.configs.codeberg",
            "repoPlugin.configs.all",
        ],
        description:
            "require a CODEOWNERS file for deterministic review ownership.",
        messageId: "missingCodeownersFile",
        messageText:
            "Repository is missing CODEOWNERS. Add CODEOWNERS (root, .github, or docs) so review ownership is explicit and enforceable.",
        name: "require-codeowners-file",
        recommendation: false,
        requirement: {
            kind: "one-of",
            paths: [
                "CODEOWNERS",
                ".github/CODEOWNERS",
                "docs/CODEOWNERS",
            ],
        },
    });

export default rule;
