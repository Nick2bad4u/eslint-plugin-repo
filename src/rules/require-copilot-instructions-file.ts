import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for this repository compliance requirement. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: ["repoPlugin.configs.ai", "repoPlugin.configs.all"],
        description:
            "require a GitHub Copilot instructions file to guide AI-assisted development in the repository.",
        messageId: "missingCopilotInstructionsFile",
        messageText:
            "Repository is missing a GitHub Copilot instructions file (.github/copilot-instructions.md). Add it to customise Copilot's suggestions and commit message behaviour for this repository.",
        name: "require-copilot-instructions-file",
        recommendation: false,
        requirement: {
            kind: "one-of",
            paths: [
                ".github/copilot-instructions.md",
                ".github/copilot-commit-message-instructions.md",
            ],
        },
    });

export default rule;
