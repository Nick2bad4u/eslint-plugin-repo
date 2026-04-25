import { basename, dirname, relative } from "node:path";
import { setHas } from "ts-extras";

import {
    getIndentationWidth,
    isBlankOrCommentLine,
    providerRuleTriggerFileNames,
    splitConfigLines,
} from "../_internal/config-file-scanner.js";
import {
    getAwsAmplifyConfigPath,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

type BlockMetadata = Readonly<{
    indentation: number;
    lineIndex: number;
}>;

const lineStartsArtifactsBlock = (line: string): boolean =>
    !isBlankOrCommentLine(line) && line.trimStart() === "artifacts:";

const lineStartsFilesEntry = (line: string): boolean =>
    !isBlankOrCommentLine(line) && line.trimStart().startsWith("files:");

const findFilesBlockMetadataWithinArtifacts = (
    lines: readonly string[],
    artifactsBlock: BlockMetadata
): BlockMetadata | null => {
    for (const [lineIndex, line] of lines
        .slice(artifactsBlock.lineIndex + 1)
        .entries()) {
        if (isBlankOrCommentLine(line)) {
            continue;
        }

        const nestedIndentation = getIndentationWidth(line);

        if (nestedIndentation <= artifactsBlock.indentation) {
            return null;
        }

        if (!lineStartsFilesEntry(line)) {
            continue;
        }

        return {
            indentation: nestedIndentation,
            lineIndex: artifactsBlock.lineIndex + 1 + lineIndex,
        };
    }

    return null;
};

const hasListEntryWithinBlock = (
    lines: readonly string[],
    block: BlockMetadata
): boolean => {
    for (const line of lines.slice(block.lineIndex + 1)) {
        if (isBlankOrCommentLine(line)) {
            continue;
        }

        const indentation = getIndentationWidth(line);

        if (indentation <= block.indentation) {
            return false;
        }

        if (line.trimStart().startsWith("-")) {
            return true;
        }
    }

    return false;
};

const hasNonEmptyArtifactsFilesEntries = (yamlSource: string): boolean => {
    const lines = splitConfigLines(yamlSource);

    for (const [lineIndex, line] of lines.entries()) {
        if (!lineStartsArtifactsBlock(line)) {
            continue;
        }

        const artifactsBlock: BlockMetadata = {
            indentation: getIndentationWidth(line),
            lineIndex,
        };
        const filesBlock = findFilesBlockMetadataWithinArtifacts(
            lines,
            artifactsBlock
        );

        if (filesBlock === null) {
            continue;
        }

        if (hasListEntryWithinBlock(lines, filesBlock)) {
            return true;
        }
    }

    return false;
};

/** Rule enforcing non-empty AWS Amplify artifacts.files entries. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const triggerFileName = basename(context.physicalFilename);

        if (!setHas(providerRuleTriggerFileNames, triggerFileName)) {
            return {};
        }

        const repositoryRoot = dirname(context.physicalFilename);
        const configPath = getAwsAmplifyConfigPath(repositoryRoot);

        if (configPath === null) {
            return {};
        }

        return {
            Program(node) {
                const amplifySource = readTextFileIfExists(configPath);

                if (amplifySource === null) {
                    return;
                }

                if (hasNonEmptyArtifactsFilesEntries(amplifySource)) {
                    return;
                }

                context.report({
                    data: { configPath: relative(repositoryRoot, configPath) },
                    messageId: "missingAwsAmplifyArtifactsFilesEntries",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require AWS Amplify `artifacts.files` to include at least one file-glob entry",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.aws",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl(
                "require-aws-amplify-artifacts-files-non-empty"
            ),
        },
        messages: {
            missingAwsAmplifyArtifactsFilesEntries:
                "AWS Amplify config '{{ configPath }}' has missing/empty `artifacts.files` entries. Add at least one artifact include pattern.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-aws-amplify-artifacts-files-non-empty",
});

export default rule;
