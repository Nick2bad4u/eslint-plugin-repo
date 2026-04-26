import { existsSync } from "node:fs";
import * as path from "node:path";
import { arrayJoin, isEmpty, setHas } from "ts-extras";

import {
    getIndentationWidth,
    isBlankOrCommentLine,
    providerRuleTriggerFileNames,
    splitConfigLines,
} from "../_internal/config-file-scanner.js";
import { readTextFileIfExists } from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const bitbucketPipelinePaths = [
    "bitbucket-pipelines.yml",
    "bitbucket-pipelines.yaml",
] as const;

const findBitbucketPipelinesPath = (
    rootDirectoryPath: string
): null | string => {
    for (const relativePath of bitbucketPipelinePaths) {
        const absolutePath = path.join(rootDirectoryPath, relativePath);

        if (existsSync(absolutePath)) {
            return absolutePath;
        }
    }

    return null;
};

const findStepBlockStartIndexes = (
    lines: readonly string[]
): readonly number[] => {
    const indexes: number[] = [];

    for (const [index, line] of lines.entries()) {
        if (isBlankOrCommentLine(line)) {
            continue;
        }

        if (line.trimStart().startsWith("- step:")) {
            indexes.push(index);
        }
    }

    return indexes;
};

const hasStepNameInBlock = (
    lines: readonly string[],
    blockStartIndex: number,
    blockEndIndex: number
): boolean => {
    const stepStartLine = lines[blockStartIndex];

    if (typeof stepStartLine !== "string") {
        return false;
    }

    if (stepStartLine.includes("name:")) {
        return true;
    }

    const blockIndent = getIndentationWidth(stepStartLine);

    for (const line of lines.slice(blockStartIndex + 1, blockEndIndex)) {
        if (isBlankOrCommentLine(line)) {
            continue;
        }

        if (getIndentationWidth(line) <= blockIndent) {
            break;
        }

        if (line.trimStart().startsWith("name:")) {
            return true;
        }
    }

    return false;
};

const collectStepBlocksMissingNameLineNumbers = (
    yamlSource: string
): readonly number[] => {
    const lines = splitConfigLines(yamlSource);
    const stepBlockStarts = findStepBlockStartIndexes(lines);

    if (isEmpty(stepBlockStarts)) {
        return [];
    }

    const missingLineNumbers: number[] = [];

    for (const [index, blockStartIndex] of stepBlockStarts.entries()) {
        const currentLine = lines[blockStartIndex];

        if (typeof currentLine !== "string") {
            continue;
        }

        const currentIndent = getIndentationWidth(currentLine);
        let blockEndIndex = lines.length;

        for (const nextBlockStartIndex of stepBlockStarts.slice(index + 1)) {
            const nextLine = lines[nextBlockStartIndex];

            if (typeof nextLine !== "string") {
                continue;
            }

            if (getIndentationWidth(nextLine) <= currentIndent) {
                blockEndIndex = nextBlockStartIndex;
                break;
            }
        }

        if (!hasStepNameInBlock(lines, blockStartIndex, blockEndIndex)) {
            missingLineNumbers.push(blockStartIndex + 1);
        }
    }

    return missingLineNumbers;
};

/** Rule definition for requiring Bitbucket pipeline step names. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const lintedFilePath = context.physicalFilename;
        const lintedFileName = path.basename(lintedFilePath);

        if (!setHas(providerRuleTriggerFileNames, lintedFileName)) {
            return {};
        }

        const rootDirectoryPath = path.dirname(lintedFilePath);

        return {
            Program(node) {
                const bitbucketPipelinesPath =
                    findBitbucketPipelinesPath(rootDirectoryPath);

                if (bitbucketPipelinesPath === null) {
                    return;
                }

                const bitbucketPipelinesSource = readTextFileIfExists(
                    bitbucketPipelinesPath
                );

                if (bitbucketPipelinesSource === null) {
                    return;
                }

                const missingLineNumbers =
                    collectStepBlocksMissingNameLineNumbers(
                        bitbucketPipelinesSource
                    );

                if (isEmpty(missingLineNumbers)) {
                    return;
                }

                context.report({
                    data: {
                        lineNumbers: arrayJoin(
                            missingLineNumbers.map(String),
                            ", "
                        ),
                    },
                    messageId: "missingBitbucketStepName",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description: "require a `name` for each Bitbucket pipeline step.",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.bitbucket",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-bitbucket-pipelines-step-name"),
        },
        messages: {
            missingBitbucketStepName:
                "Bitbucket pipeline step(s) at line(s) {{lineNumbers}} are missing `name`. Add step names so pipeline output is readable and triage-friendly.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "require-bitbucket-pipelines-step-name",
});

export default rule;
