import { basename, dirname, relative } from "node:path";
import { setHas, stringSplit } from "ts-extras";

import { providerRuleTriggerFileNames } from "../_internal/config-file-scanner.js";
import {
    getDependabotConfigPath,
    normalizeLineEndings,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

/**
 * Check whether a dependabot.yml uses at least one supported grouping strategy:
 * - `groups:` inside updates entries
 * - `multi-ecosystem-groups:` at the top level
 */
const dependabotHasGroupingStrategy = (yamlSource: string): boolean =>
    stringSplit(normalizeLineEndings(yamlSource), "\n").some((line) => {
        const trimmed = line.trimStart();

        return (
            trimmed.startsWith("groups:") ||
            trimmed.startsWith("multi-ecosystem-groups:")
        );
    });

/** Rule enforcing the use of dependency grouping in Dependabot configurations. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const triggerFileName = basename(context.physicalFilename);

        if (!setHas(providerRuleTriggerFileNames, triggerFileName)) {
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

                if (dependabotHasGroupingStrategy(dependabotSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "missingDependabotGrouping",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require dependency grouping in Dependabot configurations to reduce pull request noise",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.dependabot",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-dependabot-grouping"),
        },
        messages: {
            missingDependabotGrouping:
                "Dependabot config '{{ configPath }}' does not use a supported grouping strategy. Add `groups:` in an update entry, or define `multi-ecosystem-groups:` at the top level to reduce the number of individual dependency PRs.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "require-dependabot-grouping",
});

export default rule;
