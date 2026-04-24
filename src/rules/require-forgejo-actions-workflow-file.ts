import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for this repository compliance requirement. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repo-compliance.configs.codeberg",
            "repo-compliance.configs.strict",
            "repo-compliance.configs.all",
        ],
        description: "require at least one Forgejo/Codeberg Actions workflow.",
        messageId: "missingForgejoActionsWorkflowFile",
        messageText:
            "Codeberg preset requires at least one workflow in .forgejo/workflows/ (*.yml or *.yaml). Add Forgejo Actions automation for CI quality gates.",
        name: "require-forgejo-actions-workflow-file",
        recommendation: false,
        requirement: {
            directory: ".forgejo/workflows",
            extensions: [".yml", ".yaml"],
            kind: "directory-with-extension",
        },
    });

export default rule;
