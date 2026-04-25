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
    const normalizedSource = yamlSource.replaceAll(/\r\n?/gv, "\n");
    const lines = stringSplit(normalizedSource, "\n");

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

                if (dependabotHasSchedule(dependabotSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: ".github/dependabot.yml",
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
            recommended: true,
            repoConfigs: [
                "repoPlugin.configs.recommended",
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
