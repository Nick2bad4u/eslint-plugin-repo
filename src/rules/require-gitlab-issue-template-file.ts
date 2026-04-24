import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for this repository compliance requirement. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repo-compliance.configs.gitlab",
            "repo-compliance.configs.strict",
            "repo-compliance.configs.all",
        ],
        description: "require at least one GitLab issue template.",
        messageId: "missingGitLabIssueTemplateFile",
        messageText:
            "GitLab preset requires .gitlab/issue_templates/*.md. Add issue templates so bug and feature requests include consistent diagnostic context.",
        name: "require-gitlab-issue-template-file",
        recommendation: false,
        requirement: {
            directory: ".gitlab/issue_templates",
            extensions: [".md"],
            kind: "directory-with-extension",
        },
    });

export default rule;
