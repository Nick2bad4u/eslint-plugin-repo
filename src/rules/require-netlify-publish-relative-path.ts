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

const getPublishValue = (tomlSource: string): null | string => {
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

const isAbsolutePath = (value: string): boolean => value.startsWith("/");

/** Rule enforcing relative Netlify publish directory values. */
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

                const publishValue = getPublishValue(netlifySource);

                if (typeof publishValue !== "string") {
                    return;
                }

                if (!isAbsolutePath(publishValue)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                        publishValue,
                    },
                    messageId: "absoluteNetlifyPublishPath",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require Netlify publish directories to be relative paths so deploy output location remains repository-relative",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.netlify",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-netlify-publish-relative-path"),
        },
        messages: {
            absoluteNetlifyPublishPath:
                "Netlify config '{{ configPath }}' uses absolute publish path '{{ publishValue }}'. Use a relative publish directory path so deploy output is repository-relative.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-netlify-publish-relative-path",
});

export default rule;
