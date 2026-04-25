import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for requiring an Azure Pipelines configuration file. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repoPlugin.configs.azure",
            "repoPlugin.configs.strict",
            "repoPlugin.configs.all",
        ],
        description: "require an Azure Pipelines configuration file.",
        messageId: "missingAzurePipelinesConfigFile",
        messageText:
            "Azure preset requires azure-pipelines.yml (or azure-pipelines.yaml). Commit the pipeline definition so validation and deployment behavior stays in version control.",
        name: "require-azure-pipelines-config-file",
        recommendation: false,
        requirement: {
            kind: "one-of",
            paths: ["azure-pipelines.yml", "azure-pipelines.yaml"],
        },
    });

export default rule;
