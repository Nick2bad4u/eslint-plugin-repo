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

const hasBuildCommands = (yamlSource: string): boolean => {
    const lines = stringSplit(normalizeLineEndings(yamlSource), "\n");

    for (const [lineIndex, line] of lines.entries()) {
        if (isBlankOrCommentLine(line) || line.trimStart() !== "build:") {
            continue;
        }

        const buildIndentation = getIndentationWidth(line);

        for (const nestedLine of lines.slice(lineIndex + 1)) {
            if (isBlankOrCommentLine(nestedLine)) {
                continue;
            }

            const nestedIndentation = getIndentationWidth(nestedLine);

            if (nestedIndentation <= buildIndentation) {
                break;
            }

            if (nestedLine.trimStart().startsWith("commands:")) {
                return true;
            }
        }
    }

    return false;
};

/** Rule enforcing explicit AWS Amplify build commands. */
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

                if (hasBuildCommands(amplifySource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "missingAwsAmplifyBuildCommands",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require a `build.commands` section in AWS Amplify specs so build execution steps are committed and reviewable",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.aws",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-aws-amplify-build-commands"),
        },
        messages: {
            missingAwsAmplifyBuildCommands:
                "AWS Amplify config '{{ configPath }}' is missing `build.commands`. Define explicit build commands so deployment builds are deterministic and reviewable.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-aws-amplify-build-commands",
});

export default rule;
