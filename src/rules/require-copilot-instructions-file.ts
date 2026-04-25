import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for this repository compliance requirement. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: ["repoPlugin.configs.ai", "repoPlugin.configs.all"],
        description:
            "require repository AI guidance via `.github/instructions/copilot-instructions.md` or `.github/copilot-instructions.md`.",
        messageId: "missingCopilotInstructionsFile",
        messageText:
            "Repository is missing a Copilot instructions file. Add `.github/instructions/copilot-instructions.md` (preferred for workspace instruction files) or `.github/copilot-instructions.md` to guide AI-assisted development for this repository.",
        name: "require-copilot-instructions-file",
        recommendation: false,
        requirement: {
            kind: "one-of",
            paths: [
                ".github/instructions/copilot-instructions.md",
                ".github/copilot-instructions.md",
            ],
        },
    });

export default rule;
