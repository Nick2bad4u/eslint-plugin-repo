import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for this repository compliance requirement. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repoPlugin.configs.gitlab",
            "repoPlugin.configs.strict",
            "repoPlugin.configs.all",
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
