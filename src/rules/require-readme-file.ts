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
        description: "require a README file at the repository root.",
        messageId: "missingReadmeFile",
        messageText:
            "Repository is missing a README file. Add README.md (or README) at the root to document usage and contribution expectations.",
        name: "require-readme-file",
        recommendation: true,
        requirement: {
            kind: "one-of",
            paths: ["README.md", "README"],
        },
    });

export default rule;
