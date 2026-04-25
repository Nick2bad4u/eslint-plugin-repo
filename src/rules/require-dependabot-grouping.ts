import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { isDefined, setHas, stringSplit } from "ts-extras";

import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const triggerFileNames = new Set([
    "eslint.config.cjs",
    "eslint.config.js",
    "eslint.config.mjs",
    "package.json",
]);

/**
 * Check whether a dependabot.yml has at least one `groups:` section inside an
 * update entry.
 */
const dependabotHasGroups = (yamlSource: string): boolean =>
    stringSplit(yamlSource.replaceAll(/\r\n?/gv, "\n"), "\n").some((line) =>
        line.trimStart().startsWith("groups:")
    );

/** Rule enforcing the use of dependency grouping in Dependabot configurations. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const triggerFileName = basename(context.physicalFilename);

        if (!setHas(triggerFileNames, triggerFileName)) {
            return {};
        }

        const repositoryRoot = dirname(context.physicalFilename);
        const dependabotYmlPath = join(
            repositoryRoot,
            ".github",
            "dependabot.yml"
        );
        const dependabotYamlPath = join(
            repositoryRoot,
            ".github",
            "dependabot.yaml"
        );

        let configPath = "";

        if (existsSync(dependabotYmlPath)) {
            configPath = dependabotYmlPath;
        } else if (existsSync(dependabotYamlPath)) {
            configPath = dependabotYamlPath;
        }

        if (!isDefined(configPath) || configPath === "") {
            return {};
        }

        return {
            Program: (node): void => {
                const dependabotSource = readFileSync(configPath, "utf8");

                if (dependabotHasGroups(dependabotSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: ".github/dependabot.yml",
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
