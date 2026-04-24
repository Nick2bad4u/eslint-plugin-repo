import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repo-compliance.configs.gitlab",
            "repo-compliance.configs.strict",
            "repo-compliance.configs.all",
        ],
        description: "require a GitLab CI pipeline definition.",
        messageId: "missingGitLabCiConfigFile",
        messageText:
            "GitLab preset requires .gitlab-ci.yml. Add a GitLab CI pipeline configuration to enforce build and test automation.",
        name: "require-gitlab-ci-config-file",
        recommendation: false,
        requirement: {
            kind: "file",
            path: ".gitlab-ci.yml",
        },
    });

export default rule;
