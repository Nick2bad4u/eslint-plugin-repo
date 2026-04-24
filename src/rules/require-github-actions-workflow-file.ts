import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for this repository compliance requirement. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repo-compliance.configs.github",
            "repo-compliance.configs.strict",
            "repo-compliance.configs.all",
        ],
        description: "require at least one GitHub Actions workflow.",
        messageId: "missingGitHubActionsWorkflowFile",
        messageText:
            "GitHub preset requires at least one workflow in .github/workflows/ (*.yml or *.yaml). Add CI automation for validation and release quality gates.",
        name: "require-github-actions-workflow-file",
        recommendation: false,
        requirement: {
            directory: ".github/workflows",
            extensions: [".yml", ".yaml"],
            kind: "directory-with-extension",
        },
    });

export default rule;
