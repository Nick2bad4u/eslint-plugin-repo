import { basename, dirname, relative } from "node:path";
import { setHas, stringSplit } from "ts-extras";

import {
    getAzurePipelinesConfigPath,
    normalizeLineEndings,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const triggerFileNames = new Set([
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.ts",
    "package.json",
]);

const isBlankOrCommentLine = (line: string): boolean => {
    const trimmed = line.trim();

    return trimmed.length === 0 || trimmed.startsWith("#");
};

const getIndentationWidth = (line: string): number => {
    let width = 0;

    for (const character of line) {
        if (character !== " ") {
            break;
        }

        width += 1;
    }

    return width;
};

const hasPullRequestTrigger = (yamlSource: string): boolean => {
    const lines = stringSplit(normalizeLineEndings(yamlSource), "\n");

    for (const line of lines) {
        if (isBlankOrCommentLine(line)) {
            continue;
        }

        if (getIndentationWidth(line) !== 0) {
            continue;
        }

        const trimmed = line.trimStart();

        if (!trimmed.startsWith("pr:")) {
            continue;
        }

        const value = trimmed
            .slice("pr:".length)
            .trim()
            .replaceAll(/["']/gv, "")
            .toLowerCase();

        return value !== "none";
    }

    return false;
};

/** Rule enforcing Azure Pipelines pull-request validation coverage. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const triggerFileName = basename(context.physicalFilename);

        if (!setHas(triggerFileNames, triggerFileName)) {
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
