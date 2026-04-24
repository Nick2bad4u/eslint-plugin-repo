import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for this repository compliance requirement. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repo-compliance.configs.strict",
            "repo-compliance.configs.github",
            "repo-compliance.configs.gitlab",
            "repo-compliance.configs.codeberg",
            "repo-compliance.configs.all",
        ],
        description:
            "require at least one issue template for structured issue reports.",
        messageId: "missingIssueTemplateFile",
        messageText:
            "Repository is missing issue templates. Add .github/ISSUE_TEMPLATE/*.md or .gitlab/issue_templates/*.md to collect actionable reports.",
        name: "require-issue-template-file",
        recommendation: false,
        requirement: {
            directory: ".github/ISSUE_TEMPLATE",
            extensions: [
                ".md",
                ".yml",
                ".yaml",
            ],
            kind: "directory-with-extension",
        },
    });

export default rule;
