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

const hasCiTrigger = (yamlSource: string): boolean => {
    const value = getTopLevelYamlKeyValue(yamlSource, "trigger");

    return value !== null && value.toLowerCase() !== "none";
};

/** Rule enforcing Azure Pipelines CI trigger coverage. */
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

                if (hasCiTrigger(pipelineSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "missingAzurePipelinesTrigger",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require an explicit `trigger:` in Azure Pipelines so push-based CI coverage is not accidentally disabled",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.azure",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-azure-pipelines-trigger"),
        },
        messages: {
            missingAzurePipelinesTrigger:
                "Azure Pipelines config '{{ configPath }}' is missing an explicit `trigger:` (or sets `trigger: none`). Declare CI trigger coverage so push validation behavior is versioned and reviewable.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-azure-pipelines-trigger",
});

export default rule;
