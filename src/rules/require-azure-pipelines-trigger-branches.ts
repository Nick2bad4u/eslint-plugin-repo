import { basename, dirname, relative } from "node:path";
import { setHas } from "ts-extras";

import {
    getIndentationWidth,
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

type TriggerBlockMetadata = Readonly<{
    inlineValue: string;
    lineIndex: number;
}>;

const isTopLevelTriggerLine = (line: string): boolean =>
    !isBlankOrCommentLine(line) &&
    getIndentationWidth(line) === 0 &&
    line.trimStart().startsWith("trigger:");

const findTopLevelTriggerBlockMetadata = (
    lines: readonly string[]
): null | TriggerBlockMetadata => {
    for (const [lineIndex, line] of lines.entries()) {
        if (!isTopLevelTriggerLine(line)) {
            continue;
        }

        return {
            inlineValue: line.trimStart().slice("trigger:".length).trim(),
            lineIndex,
        };
    }

    return null;
};

const hasBranchesWithinTriggerBlock = (
    lines: readonly string[],
    lineIndex: number
): boolean => {
    const triggerLine = lines[lineIndex];

    if (typeof triggerLine !== "string") {
        return false;
    }

    const triggerIndentation = getIndentationWidth(triggerLine);

    for (const nestedLine of lines.slice(lineIndex + 1)) {
        if (isBlankOrCommentLine(nestedLine)) {
            continue;
        }

        const nestedIndentation = getIndentationWidth(nestedLine);

        if (nestedIndentation <= triggerIndentation) {
            return false;
        }

        if (nestedLine.trimStart().startsWith("branches:")) {
            return true;
        }
    }

    return false;
};

const hasTriggerBranchesFilter = (yamlSource: string): boolean => {
    const lines = splitConfigLines(yamlSource);
    const triggerBlockMetadata = findTopLevelTriggerBlockMetadata(lines);

    if (triggerBlockMetadata === null) {
        return false;
    }

    if (
        triggerBlockMetadata.inlineValue.length > 0 &&
        triggerBlockMetadata.inlineValue.toLowerCase() !== "none"
    ) {
        return true;
    }

    return hasBranchesWithinTriggerBlock(lines, triggerBlockMetadata.lineIndex);
};

/** Rule enforcing explicit Azure Pipelines push trigger branch filters. */
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

                if (hasTriggerBranchesFilter(pipelineSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "missingAzurePipelinesTriggerBranches",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require explicit Azure Pipelines push trigger branch filters so CI scope is reviewable",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.azure",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-azure-pipelines-trigger-branches"),
        },
        messages: {
            missingAzurePipelinesTriggerBranches:
                "Azure Pipelines config '{{ configPath }}' is missing explicit push trigger branch filters. Define `trigger.branches` (or a non-`none` inline trigger value).",
        },
        schema: [],
        type: "problem",
    },
    name: "require-azure-pipelines-trigger-branches",
});

export default rule;
