import { basename, dirname, relative } from "node:path";
import { setHas } from "ts-extras";

import {
    hasTopLevelYamlKey,
    providerRuleTriggerFileNames,
} from "../_internal/config-file-scanner.js";
import {
    getAzurePipelinesConfigPath,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

/** Rule enforcing explicit Azure Pipelines name metadata. */
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

                if (hasTopLevelYamlKey(pipelineSource, "name")) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "missingAzurePipelinesName",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require a top-level `name` in Azure Pipelines configs so pipeline identity is explicit",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.azure",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-azure-pipelines-name"),
        },
        messages: {
            missingAzurePipelinesName:
                "Azure Pipelines config '{{ configPath }}' is missing a top-level `name`. Declare pipeline identity explicitly in version control.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-azure-pipelines-name",
});

export default rule;
