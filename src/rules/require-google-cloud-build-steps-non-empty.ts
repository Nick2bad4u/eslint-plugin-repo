import { basename, dirname, relative } from "node:path";
import { setHas, stringSplit } from "ts-extras";

import {
    getIndentationWidth,
    isBlankOrCommentLine,
} from "../_internal/config-file-scanner.js";
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

/**
 * Returns the index of the root-level `steps:` key in `lines`, or -1 if not
 * found.
 */
const findRootStepsIndex = (lines: readonly string[]): number =>
    lines.findIndex(
        (line) =>
            !isBlankOrCommentLine(line) &&
            getIndentationWidth(line) === 0 &&
            line.trimStart() === "steps:"
    );

/**
 * Returns true when at least one list item (`-`) exists directly inside the
 * block starting after `afterIndex`. Stops scanning as soon as a non-indented
 * line is encountered (i.e., leaves the block).
 */
const hasNestedListItem = (
    lines: readonly string[],
    afterIndex: number
): boolean => {
    for (const nestedLine of lines.slice(afterIndex + 1)) {
        if (isBlankOrCommentLine(nestedLine)) {
            continue;
        }

        if (getIndentationWidth(nestedLine) === 0) {
            return false;
        }

        if (nestedLine.trimStart().startsWith("-")) {
            return true;
        }
    }

    return false;
};

const hasNonEmptyStepsList = (yamlSource: string): boolean => {
    const lines = stringSplit(normalizeLineEndings(yamlSource), "\n");
    const stepsIndex = findRootStepsIndex(lines);

    return stepsIndex !== -1 && hasNestedListItem(lines, stepsIndex);
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
