import { basename, dirname, relative } from "node:path";
import { isEmpty, setHas, stringSplit } from "ts-extras";

import {
    getDependabotConfigPath,
    normalizeLineEndings,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const triggerFileNames = new Set([
    "eslint.config.cjs",
    "eslint.config.js",
    "eslint.config.mjs",
    "package.json",
]);

const extractEcosystems = (yamlSource: string): readonly string[] => {
    const lines = stringSplit(normalizeLineEndings(yamlSource), "\n");
    const ecosystems: string[] = [];

    for (const line of lines) {
        const trimmed = line.trimStart();

        if (trimmed.startsWith("- package-ecosystem:")) {
            const value = trimmed
                .slice("- package-ecosystem:".length)
                .trim()
                .replaceAll(/["']/gv, "");

            if (value.length > 0) {
                ecosystems.push(value.toLowerCase());
            }
        }
    }

    return ecosystems;
};

/** Rule enforcing that Dependabot declares at least one update entry. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const triggerFileName = basename(context.physicalFilename);

        if (!setHas(triggerFileNames, triggerFileName)) {
            return {};
        }

        const repositoryRoot = dirname(context.physicalFilename);
        const configPath = getDependabotConfigPath(repositoryRoot);

        if (configPath === null) {
            return {};
        }

        return {
            Program: (node): void => {
                const dependabotSource = readTextFileIfExists(configPath);

                if (dependabotSource === null) {
                    return;
                }

                const ecosystems = extractEcosystems(dependabotSource);
                const relativeConfigPath = relative(repositoryRoot, configPath);

                if (isEmpty(ecosystems)) {
                    context.report({
                        data: { configPath: relativeConfigPath },
                        messageId: "missingDependabotUpdateEntries",
                        node,
                    });
                }
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require Dependabot to contain at least one update entry",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-dependabot-update-entries"),
        },
        messages: {
            missingDependabotUpdateEntries:
                "Dependabot config '{{ configPath }}' does not contain any `updates` entries. Add at least one `- package-ecosystem:` block to enable automated dependency updates.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-dependabot-update-entries",
});

export default rule;
