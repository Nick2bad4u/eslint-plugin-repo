import { basename, dirname, relative } from "node:path";
import { setHas, stringSplit } from "ts-extras";

import {
    getAwsAmplifyConfigPath,
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

const lineStartsArtifactsBlock = (line: string): boolean =>
    !isBlankOrCommentLine(line) && line.trimStart() === "artifacts:";

const lineStartsFilesEntry = (line: string): boolean =>
    !isBlankOrCommentLine(line) && line.trimStart().startsWith("files:");

const hasFilesWithinBlock = (
    lines: readonly string[],
    artifactsHeaderIndex: number,
    artifactsIndentation: number
): boolean => {
    for (const nestedLine of lines.slice(artifactsHeaderIndex + 1)) {
        if (isBlankOrCommentLine(nestedLine)) {
            continue;
        }

        const nestedIndentation = getIndentationWidth(nestedLine);

        if (nestedIndentation <= artifactsIndentation) {
            return false;
        }

        if (lineStartsFilesEntry(nestedLine)) {
            return true;
        }
    }

    return false;
};

const hasArtifactsFiles = (yamlSource: string): boolean => {
    const lines = stringSplit(normalizeLineEndings(yamlSource), "\n");

    for (const [lineIndex, line] of lines.entries()) {
        if (!lineStartsArtifactsBlock(line)) {
            continue;
        }

        const artifactsIndentation = getIndentationWidth(line);

        if (hasFilesWithinBlock(lines, lineIndex, artifactsIndentation)) {
            return true;
        }
    }

    return false;
};

/** Rule enforcing explicit AWS Amplify artifact inclusion patterns. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const triggerFileName = basename(context.physicalFilename);

        if (!setHas(triggerFileNames, triggerFileName)) {
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

                if (hasArtifactsFiles(amplifySource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "missingAwsAmplifyArtifactsFiles",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require `artifacts.files` in AWS Amplify build specs so deployed artifact globs are explicit in version control",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.aws",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-aws-amplify-artifacts-files"),
        },
        messages: {
            missingAwsAmplifyArtifactsFiles:
                "AWS Amplify config '{{ configPath }}' is missing `artifacts.files`. Declare explicit artifact inclusion patterns so deployment output remains reviewable and reproducible.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-aws-amplify-artifacts-files",
});

export default rule;
