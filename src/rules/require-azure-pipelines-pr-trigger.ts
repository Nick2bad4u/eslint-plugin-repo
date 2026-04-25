import { basename, dirname, relative } from "node:path";
import { setHas } from "ts-extras";

import {
    getTopLevelYamlKeyValue,
    providerRuleTriggerFileNames,
} from "../_internal/config-file-scanner.js";
import {
    getAzurePipelinesConfigPath,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const hasPullRequestTrigger = (yamlSource: string): boolean => {
    const value = getTopLevelYamlKeyValue(yamlSource, "pr");

    return value !== null && value.toLowerCase() !== "none";
};

/** Rule enforcing Azure Pipelines pull-request validation coverage. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const triggerFileName = basename(context.physicalFilename);

        if (!setHas(providerRuleTriggerFileNames, triggerFileName)) {
            return {};
        }

        const repositoryRoot = dirname(context.physicalFilename);
        const configPath = getAzurePipelinesConfigPath(repositoryRoot);

        if (configPath === null) {
            return {};
        }

        return {
            Program(node) {
                const pipelineSource = readTextFileIfExists(configPath);

                if (pipelineSource === null) {
                    return;
                }

                if (hasPullRequestTrigger(pipelineSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "missingAzurePipelinesPrTrigger",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require an explicit `pr:` trigger in Azure Pipelines so pull requests are validated before merge",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.azure",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-azure-pipelines-pr-trigger"),
        },
        messages: {
            missingAzurePipelinesPrTrigger:
                "Azure Pipelines config '{{ configPath }}' is missing an explicit `pr:` trigger. Add pull-request validation so changes are checked before merge.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-azure-pipelines-pr-trigger",
});

export default rule;
