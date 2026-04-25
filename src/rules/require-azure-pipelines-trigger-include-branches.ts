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

const isTopLevelTriggerLine = (line: string): boolean =>
    !isBlankOrCommentLine(line) &&
    getIndentationWidth(line) === 0 &&
    line.trimStart() === "trigger:";

const findTopLevelTriggerLineIndex = (
    lines: readonly string[]
): null | number => {
    for (const [lineIndex, line] of lines.entries()) {
        if (isTopLevelTriggerLine(line)) {
            return lineIndex;
        }
    }

    return null;
};

type BranchesBlockMetadata = Readonly<{
    branchesIndentation: number;
    lineIndex: number;
}>;

const findBranchesBlockMetadata = (
    nestedLines: readonly string[],
    triggerIndentation: number
): BranchesBlockMetadata | null => {
    for (const [lineIndex, nestedLine] of nestedLines.entries()) {
        if (isBlankOrCommentLine(nestedLine)) {
            continue;
        }

        const nestedIndentation = getIndentationWidth(nestedLine);

        if (nestedIndentation <= triggerIndentation) {
            return null;
        }

        if (nestedLine.trimStart() === "branches:") {
            return {
                branchesIndentation: nestedIndentation,
                lineIndex,
            };
        }
    }

    return null;
};

const hasIncludeEntryUnderBranches = (
    nestedLines: readonly string[],
    branchesIndentation: number
): boolean => {
    let inIncludeBlock = false;
    let includeIndentation = 0;

    for (const nestedLine of nestedLines) {
        if (isBlankOrCommentLine(nestedLine)) {
            continue;
        }

        const nestedIndentation = getIndentationWidth(nestedLine);

        if (nestedIndentation <= branchesIndentation) {
            return false;
        }

        const nestedTrimmed = nestedLine.trimStart();

        if (!inIncludeBlock) {
            if (nestedTrimmed === "include:") {
                inIncludeBlock = true;
                includeIndentation = nestedIndentation;
            }

            continue;
        }

        if (nestedIndentation <= includeIndentation) {
            return false;
        }

        if (nestedTrimmed.startsWith("-")) {
            return true;
        }
    }

    return false;
};

const hasTriggerIncludeBranches = (yamlSource: string): boolean => {
    const lines = stringSplit(normalizeLineEndings(yamlSource), "\n");
    const triggerLineIndex = findTopLevelTriggerLineIndex(lines);

    if (triggerLineIndex === null) {
        return false;
    }

    const triggerLine = lines[triggerLineIndex];

    if (typeof triggerLine !== "string") {
        return false;
    }

    const triggerIndentation = getIndentationWidth(triggerLine);
    const nestedLines = lines.slice(triggerLineIndex + 1);
    const branchesBlockMetadata = findBranchesBlockMetadata(
        nestedLines,
        triggerIndentation
    );

    if (branchesBlockMetadata === null) {
        return false;
    }

    return hasIncludeEntryUnderBranches(
        nestedLines.slice(branchesBlockMetadata.lineIndex + 1),
        branchesBlockMetadata.branchesIndentation
    );
};

/** Rule enforcing non-empty Azure trigger include branch lists. */
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

                if (hasTriggerIncludeBranches(pipelineSource)) {
                    return;
                }

                context.report({
                    data: { configPath: relative(repositoryRoot, configPath) },
                    messageId: "missingAzurePipelinesTriggerIncludeBranches",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require Azure Pipelines `trigger.branches.include` to contain at least one branch entry",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.azure",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl(
                "require-azure-pipelines-trigger-include-branches"
            ),
        },
        messages: {
            missingAzurePipelinesTriggerIncludeBranches:
                "Azure Pipelines config '{{ configPath }}' is missing non-empty `trigger.branches.include` entries.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-azure-pipelines-trigger-include-branches",
});

export default rule;
