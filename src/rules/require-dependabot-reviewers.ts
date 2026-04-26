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

const hasDependabotReviewers = (yamlSource: string): boolean => {
    const lines = stringSplit(normalizeLineEndings(yamlSource), "\n");

    return lines.some(
        (line) =>
            line.trimStart().startsWith("assignees:") ||
            line.trimStart().startsWith("reviewers:")
    );
};

/** Rule enforcing Dependabot reviewer assignment for update PRs. */
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

                if (hasDependabotReviewers(dependabotSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "missingDependabotReviewers",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require reviewers for Dependabot pull requests to enforce human oversight",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.github",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-dependabot-reviewers"),
        },
        messages: {
            missingDependabotReviewers:
                "Dependabot config '{{ configPath }}' is missing `reviewers` entries. Add `reviewers` under update blocks so dependency PRs are automatically routed for review.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-dependabot-reviewers",
});

export default rule;
