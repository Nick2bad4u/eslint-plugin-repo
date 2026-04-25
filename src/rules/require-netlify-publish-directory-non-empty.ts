import { basename, dirname, relative } from "node:path";
import { setHas, stringSplit } from "ts-extras";

import {
    getNetlifyConfigPath,
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

const getPublishDirectoryValue = (tomlSource: string): null | string => {
    const publishLine = stringSplit(
        normalizeLineEndings(tomlSource),
        "\n"
    ).find((line) => {
        const trimmed = line.trim();

        if (trimmed.length === 0 || trimmed.startsWith("#")) {
            return false;
        }

        return /^publish\s*=\s*\S/v.test(trimmed);
    });

    if (typeof publishLine !== "string") {
        return null;
    }

    return publishLine
        .slice(publishLine.indexOf("=") + 1)
        .trim()
        .replaceAll(/["']/gv, "");
};

/** Rule enforcing non-empty Netlify publish directory values. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const triggerFileName = basename(context.physicalFilename);

        if (!setHas(triggerFileNames, triggerFileName)) {
            return {};
        }

        const repositoryRoot = dirname(context.physicalFilename);
        const configPath = getNetlifyConfigPath(repositoryRoot);

        if (configPath === null) {
            return {};
        }

        return {
            Program(node) {
                const netlifySource = readTextFileIfExists(configPath);

                if (netlifySource === null) {
                    return;
                }

                const publishValue = getPublishDirectoryValue(netlifySource);

                if (
                    typeof publishValue === "string" &&
                    publishValue.length > 0
                ) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "missingOrEmptyNetlifyPublishDirectory",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require Netlify `publish` directory values to be present and non-empty",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.netlify",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl(
                "require-netlify-publish-directory-non-empty"
            ),
        },
        messages: {
            missingOrEmptyNetlifyPublishDirectory:
                "Netlify config '{{ configPath }}' is missing a non-empty `publish` directory value. Define deploy output directory explicitly.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-netlify-publish-directory-non-empty",
});

export default rule;
