import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for this repository compliance requirement. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repoPlugin.configs.strict",
            "repoPlugin.configs.github",
            "repoPlugin.configs.gitlab",
            "repoPlugin.configs.codeberg",
            "repoPlugin.configs.all",
        ],
        description:
            "require a pull request template for consistent review context.",
        messageId: "missingPullRequestTemplateFile",
        messageText:
            "Repository is missing a pull request template. Add .github/pull_request_template.md, .github/PULL_REQUEST_TEMPLATE/*.md, or PULL_REQUEST_TEMPLATE.md to standardize PR quality.",
        name: "require-pull-request-template-file",
        recommendation: false,
        requirement: {
            kind: "any-of",
            requirements: [
                {
                    kind: "one-of",
                    paths: [
                        ".github/pull_request_template.md",
                        "PULL_REQUEST_TEMPLATE.md",
                        "docs/PULL_REQUEST_TEMPLATE.md",
                        ".gitlab/merge_request_templates/default.md",
                    ],
                },
                {
                    directory: ".github/PULL_REQUEST_TEMPLATE",
                    extensions: [".md"],
                    kind: "directory-with-extension",
                },
            ],
        },
    });

export default rule;
