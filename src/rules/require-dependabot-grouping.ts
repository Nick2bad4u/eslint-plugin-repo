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
 * Check whether a dependabot.yml has at least one `groups:` section inside an
 * update entry.
 */
const dependabotHasGroups = (yamlSource: string): boolean =>
    stringSplit(normalizeLineEndings(yamlSource), "\n").some((line) =>
        line.trimStart().startsWith("groups:")
    );

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

                if (dependabotHasGroups(dependabotSource)) {
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
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-dependabot-grouping"),
        },
        messages: {
            missingDependabotGrouping:
                "Dependabot config '{{ configPath }}' does not use `groups` to batch dependency updates. Add a `groups:` section to at least one update entry to reduce the number of individual dependency PRs.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "require-dependabot-grouping",
});

export default rule;
