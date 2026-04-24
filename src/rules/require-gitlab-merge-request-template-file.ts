import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for this repository compliance requirement. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repoPlugin.configs.gitlab",
            "repoPlugin.configs.strict",
            "repoPlugin.configs.all",
        ],
        description: "require at least one GitLab merge request template.",
        messageId: "missingGitLabMergeRequestTemplateFile",
        messageText:
            "GitLab preset requires .gitlab/merge_request_templates/*.md. Add merge request templates to standardize change summaries and review checklists.",
        name: "require-gitlab-merge-request-template-file",
        recommendation: false,
        requirement: {
            directory: ".gitlab/merge_request_templates",
            extensions: [".md"],
            kind: "directory-with-extension",
        },
    });

export default rule;
