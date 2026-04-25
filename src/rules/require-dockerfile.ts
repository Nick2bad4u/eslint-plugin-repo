import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for requiring a repository-root Dockerfile. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repoPlugin.configs.docker",
            "repoPlugin.configs.strict",
            "repoPlugin.configs.all",
        ],
        description: "require a repository-root Dockerfile.",
        messageId: "missingDockerfile",
        messageText:
            "Docker preset requires a repository-root Dockerfile. Commit the image build definition so container packaging stays reviewable and reproducible.",
        name: "require-dockerfile",
        recommendation: false,
        requirement: {
            kind: "file",
            path: "Dockerfile",
        },
    });

export default rule;
