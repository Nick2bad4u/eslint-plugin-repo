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

const VALID_INTERVALS = new Set([
    "daily",
    "monthly",
    "weekly",
]);

/**
 * Check whether every `updates` entry in a dependabot.yml has a
 * `schedule.interval` value.
 */
const dependabotHasSchedule = (yamlSource: string): boolean => {
    const lines = stringSplit(normalizeLineEndings(yamlSource), "\n");

    let hasUpdates = false;

    for (const line of lines) {
        const trimmed = line.trimStart();

        if (trimmed.startsWith("- package-ecosystem:")) {
            hasUpdates = true;
        }

        if (trimmed.startsWith("interval:")) {
            const value = trimmed
                .slice("interval:".length)
                .trim()
                .replaceAll(/["']/gv, "")
                .toLowerCase();

            if (setHas(VALID_INTERVALS, value)) {
                return true;
            }
        }
    }

    return !hasUpdates;
};

/** Rule enforcing a schedule interval in Dependabot update configurations. */
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

                if (dependabotHasSchedule(dependabotSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "missingDependabotSchedule",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require a schedule interval in Dependabot update configurations to control update frequency",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.strict",
                "repoPlugin.configs.github",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-dependabot-schedule"),
        },
        messages: {
            missingDependabotSchedule:
                "Dependabot config '{{ configPath }}' is missing a `schedule.interval` in one or more update blocks. Add `schedule: interval: weekly` (or `daily`/`monthly`) to each update entry to control when Dependabot checks for updates.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-dependabot-schedule",
});

export default rule;
