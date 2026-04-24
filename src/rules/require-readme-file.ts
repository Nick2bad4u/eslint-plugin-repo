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
