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

const getBuildCommandValue = (tomlSource: string): null | string => {
    const commandLine = stringSplit(
        normalizeLineEndings(tomlSource),
        "\n"
    ).find((line) => {
        const trimmed = line.trim();

        if (trimmed.length === 0 || trimmed.startsWith("#")) {
            return false;
        }

        return /^command\s*=\s*\S/v.test(trimmed);
    });

    if (typeof commandLine !== "string") {
        return null;
    }

    return commandLine
        .slice(commandLine.indexOf("=") + 1)
        .trim()
        .replaceAll(/["']/gv, "");
};

/** Rule enforcing non-empty Netlify build command values. */
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

                const buildCommandValue = getBuildCommandValue(netlifySource);

                if (
                    typeof buildCommandValue === "string" &&
                    buildCommandValue.trim().length > 0
                ) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "missingOrEmptyNetlifyBuildCommand",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require Netlify `build.command` to be present and non-empty",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.netlify",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-netlify-build-command-non-empty"),
        },
        messages: {
            missingOrEmptyNetlifyBuildCommand:
                "Netlify config '{{ configPath }}' is missing a non-empty build command. Define an explicit command to keep build behavior stable and reviewable.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-netlify-build-command-non-empty",
});

export default rule;
