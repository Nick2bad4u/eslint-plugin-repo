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

const hasRootTimeout = (yamlSource: string): boolean =>
    stringSplit(normalizeLineEndings(yamlSource), "\n").some((line) => {
        if (isBlankOrCommentLine(line)) {
            return false;
        }

        if (getIndentationWidth(line) !== 0) {
            return false;
        }

        return line.trimStart().startsWith("timeout:");
    });

/** Rule enforcing an explicit Cloud Build timeout. */
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

                if (hasRootTimeout(cloudBuildSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "missingGoogleCloudBuildTimeout",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require a root `timeout` in Google Cloud Build configs to keep build duration budgets explicit",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.googleCloud",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-google-cloud-build-timeout"),
        },
        messages: {
            missingGoogleCloudBuildTimeout:
                "Google Cloud Build config '{{ configPath }}' is missing a root `timeout`. Set an explicit timeout so long-running builds fail predictably instead of consuming unbounded CI time.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-google-cloud-build-timeout",
});

export default rule;
