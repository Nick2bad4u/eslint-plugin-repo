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

type PrBlockMetadata = Readonly<{
    lineIndex: number;
    sameLineValue: string;
}>;

const isTopLevelPrLine = (line: string): boolean =>
    !isBlankOrCommentLine(line) &&
    getIndentationWidth(line) === 0 &&
    line.trimStart().startsWith("pr:");

const findTopLevelPrBlockMetadata = (
    lines: readonly string[]
): null | PrBlockMetadata => {
    for (const [lineIndex, line] of lines.entries()) {
        if (!isTopLevelPrLine(line)) {
            continue;
        }

        return {
            lineIndex,
            sameLineValue: line.trimStart().slice("pr:".length).trim(),
        };
    }

    return null;
};

const hasBranchesWithinPrBlock = (
    lines: readonly string[],
    lineIndex: number
): boolean => {
    const prLine = lines[lineIndex];

    if (typeof prLine !== "string") {
        return false;
    }

    const prIndentation = getIndentationWidth(prLine);

    for (const nestedLine of lines.slice(lineIndex + 1)) {
        if (isBlankOrCommentLine(nestedLine)) {
            continue;
        }

        const nestedIndentation = getIndentationWidth(nestedLine);

        if (nestedIndentation <= prIndentation) {
            return false;
        }

        if (nestedLine.trimStart().startsWith("branches:")) {
            return true;
        }
    }

    return false;
};

const hasPrBranchesFilter = (yamlSource: string): boolean => {
    const lines = stringSplit(normalizeLineEndings(yamlSource), "\n");
    const prBlockMetadata = findTopLevelPrBlockMetadata(lines);

    if (prBlockMetadata === null) {
        return false;
    }

    if (
        prBlockMetadata.sameLineValue.length > 0 &&
        prBlockMetadata.sameLineValue.toLowerCase() !== "none"
    ) {
        return true;
    }

    return hasBranchesWithinPrBlock(lines, prBlockMetadata.lineIndex);
};

/** Rule enforcing explicit Azure Pipelines PR branch filters. */
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

                if (hasPrBranchesFilter(pipelineSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "missingAzurePipelinesPrBranches",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require explicit Azure Pipelines pull-request branch filters to keep PR validation scope versioned",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.azure",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-azure-pipelines-pr-branches"),
        },
        messages: {
            missingAzurePipelinesPrBranches:
                "Azure Pipelines config '{{ configPath }}' is missing explicit PR branch filters. Define `pr.branches` (or an inline PR trigger value) so pull-request validation scope is reviewable.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-azure-pipelines-pr-branches",
});

export default rule;
