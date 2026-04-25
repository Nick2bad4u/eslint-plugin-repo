import { basename, dirname, relative } from "node:path";
import { setHas } from "ts-extras";

import {
    isBlankOrCommentLine,
    providerRuleTriggerFileNames,
    splitConfigLines,
} from "../_internal/config-file-scanner.js";
import {
    getAzurePipelinesConfigPath,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const executionKeys = new Set([
    "jobs:",
    "stages:",
    "steps:",
]);

const hasTopLevelExecutionPlan = (yamlSource: string): boolean =>
    splitConfigLines(yamlSource).some((line) => {
        if (isBlankOrCommentLine(line)) {
            return false;
        }

        const trimmed = line.trim();

        return !line.startsWith(" ") && setHas(executionKeys, trimmed);
    });

/** Rule enforcing Azure Pipelines execution plan declaration. */
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

                if (hasTopLevelExecutionPlan(pipelineSource)) {
                    return;
                }

                context.report({
                    data: { configPath: relative(repositoryRoot, configPath) },
                    messageId: "missingAzurePipelinesExecutionPlan",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require a top-level Azure Pipelines execution plan (`jobs`, `stages`, or `steps`)",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.azure",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-azure-pipelines-execution-plan"),
        },
        messages: {
            missingAzurePipelinesExecutionPlan:
                "Azure Pipelines config '{{ configPath }}' is missing a top-level execution plan (`jobs`, `stages`, or `steps`). Declare what the pipeline runs so CI behavior is explicit.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-azure-pipelines-execution-plan",
});

export default rule;
