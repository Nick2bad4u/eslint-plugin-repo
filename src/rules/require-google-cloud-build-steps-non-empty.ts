import { basename, dirname, relative } from "node:path";
import { setHas, stringSplit } from "ts-extras";

import {
    getGoogleCloudBuildConfigPath,
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

const hasNonEmptyStepsList = (yamlSource: string): boolean => {
    const lines = stringSplit(normalizeLineEndings(yamlSource), "\n");

    for (const [lineIndex, line] of lines.entries()) {
        if (isBlankOrCommentLine(line)) {
            continue;
        }

        if (getIndentationWidth(line) !== 0 || line.trimStart() !== "steps:") {
            continue;
        }

        const stepsIndentation = getIndentationWidth(line);

        for (const nestedLine of lines.slice(lineIndex + 1)) {
            if (isBlankOrCommentLine(nestedLine)) {
                continue;
            }

            const nestedIndentation = getIndentationWidth(nestedLine);

            if (nestedIndentation <= stepsIndentation) {
                return false;
            }

            if (nestedLine.trimStart().startsWith("-")) {
                return true;
            }
        }

        return false;
    }

    return false;
};

/** Rule enforcing non-empty Google Cloud Build steps lists. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const triggerFileName = basename(context.physicalFilename);

        if (!setHas(triggerFileNames, triggerFileName)) {
            return {};
        }

        const repositoryRoot = dirname(context.physicalFilename);
        const configPath = getGoogleCloudBuildConfigPath(repositoryRoot);

        if (configPath === null) {
            return {};
        }

        return {
            Program(node) {
                const cloudBuildSource = readTextFileIfExists(configPath);

                if (cloudBuildSource === null) {
                    return;
                }

                if (hasNonEmptyStepsList(cloudBuildSource)) {
                    return;
                }

                context.report({
                    data: { configPath: relative(repositoryRoot, configPath) },
                    messageId: "missingGoogleCloudBuildStepEntries",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require Google Cloud Build `steps` to contain at least one step entry",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.googleCloud",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl(
                "require-google-cloud-build-steps-non-empty"
            ),
        },
        messages: {
            missingGoogleCloudBuildStepEntries:
                "Google Cloud Build config '{{ configPath }}' has missing/empty `steps` entries.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-google-cloud-build-steps-non-empty",
});

export default rule;
