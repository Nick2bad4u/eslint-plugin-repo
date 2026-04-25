import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for requiring a Google Cloud Build config file. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repoPlugin.configs.googleCloud",
            "repoPlugin.configs.strict",
            "repoPlugin.configs.all",
        ],
        description: "require a Google Cloud Build configuration file.",
        messageId: "missingGoogleCloudBuildConfigFile",
        messageText:
            "Google Cloud preset requires cloudbuild.yaml (or cloudbuild.yml). Commit the build config so CI and deployment behavior stays reviewable.",
        name: "require-google-cloud-build-config-file",
        recommendation: false,
        requirement: {
            kind: "one-of",
            paths: ["cloudbuild.yaml", "cloudbuild.yml"],
        },
    });

export default rule;
