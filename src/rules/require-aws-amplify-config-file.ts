import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for requiring an AWS Amplify build spec. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repoPlugin.configs.aws",
            "repoPlugin.configs.strict",
            "repoPlugin.configs.all",
        ],
        description:
            "require an AWS Amplify build specification committed to the repository.",
        messageId: "missingAwsAmplifyConfigFile",
        messageText:
            "AWS preset requires amplify.yml (or amplify.yaml). Commit the Amplify build spec so deployment behavior stays reviewable and reproducible.",
        name: "require-aws-amplify-config-file",
        recommendation: false,
        requirement: {
            kind: "one-of",
            paths: ["amplify.yml", "amplify.yaml"],
        },
    });

export default rule;
