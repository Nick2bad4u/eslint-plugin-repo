import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for this repository compliance requirement. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repo-compliance.configs.bitbucket",
            "repo-compliance.configs.strict",
            "repo-compliance.configs.all",
        ],
        description: "require a Bitbucket Pipelines configuration.",
        messageId: "missingBitbucketPipelinesConfigFile",
        messageText:
            "Bitbucket preset requires bitbucket-pipelines.yml. Add a pipeline configuration so pull requests and branch builds are automatically validated.",
        name: "require-bitbucket-pipelines-config-file",
        recommendation: false,
        requirement: {
            kind: "file",
            path: "bitbucket-pipelines.yml",
        },
    });

export default rule;
