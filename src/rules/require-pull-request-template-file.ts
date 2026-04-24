import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

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
            "require a pull request template for consistent review context.",
        messageId: "missingPullRequestTemplateFile",
        messageText:
            "Repository is missing a pull request template. Add .github/pull_request_template.md (or PULL_REQUEST_TEMPLATE.md) to standardize PR quality.",
        name: "require-pull-request-template-file",
        recommendation: false,
        requirement: {
            kind: "one-of",
            paths: [
                ".github/pull_request_template.md",
                "PULL_REQUEST_TEMPLATE.md",
                "docs/PULL_REQUEST_TEMPLATE.md",
                ".gitlab/merge_request_templates/default.md",
            ],
        },
    });

export default rule;
