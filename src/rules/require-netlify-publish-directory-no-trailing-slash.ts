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

const hasTrailingSlash = (publishValue: string): boolean =>
    publishValue.length > 1 && publishValue.endsWith("/");

/** Rule enforcing canonical Netlify publish directory path style. */
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
                    typeof publishValue !== "string" ||
                    !hasTrailingSlash(publishValue)
                ) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                        publishValue,
                    },
                    messageId: "netlifyPublishDirectoryTrailingSlash",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require Netlify `publish` directory values to omit trailing slashes",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.netlify",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl(
                "require-netlify-publish-directory-no-trailing-slash"
            ),
        },
        messages: {
            netlifyPublishDirectoryTrailingSlash:
                "Netlify config '{{ configPath }}' uses publish value '{{ publishValue }}' with trailing slash. Use canonical directory path without trailing slash.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-netlify-publish-directory-no-trailing-slash",
});

export default rule;
