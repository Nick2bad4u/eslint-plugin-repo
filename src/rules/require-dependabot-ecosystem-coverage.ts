import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import {
    arrayIncludes,
    isDefined,
    isEmpty,
    setHas,
    stringSplit,
} from "ts-extras";

import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const triggerFileNames = new Set([
    "eslint.config.cjs",
    "eslint.config.js",
    "eslint.config.mjs",
    "package.json",
]);

/**
 * Default ecosystems to require when none are specified. An empty array means
 * "just require at least one update entry exists".
 */
const defaultRequiredEcosystems: readonly string[] = [];

const extractEcosystems = (yamlSource: string): readonly string[] => {
    const normalizedSource = yamlSource.replaceAll(/\r\n?/gv, "\n");
    const lines = stringSplit(normalizedSource, "\n");
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

/**
 * Rule enforcing that the Dependabot configuration covers required package
 * ecosystems.
 */
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
                const ecosystems = extractEcosystems(dependabotSource);
                const requiredEcosystems = defaultRequiredEcosystems;

                if (isEmpty(ecosystems)) {
                    context.report({
                        data: { configPath: ".github/dependabot.yml" },
                        messageId: "noUpdateEntries",
                        node,
                    });

                    return;
                }

                for (const required of requiredEcosystems) {
                    const lower = required.toLowerCase();

                    if (!arrayIncludes(ecosystems, lower)) {
                        context.report({
                            data: {
                                configPath: ".github/dependabot.yml",
                                ecosystem: required,
                            },
                            messageId: "missingEcosystem",
                            node,
                        });
                    }
                }
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require Dependabot to contain at least one update entry and cover any built-in required ecosystems",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-dependabot-ecosystem-coverage"),
        },
        messages: {
            missingEcosystem:
                "Dependabot config '{{ configPath }}' does not include an update entry for the '{{ ecosystem }}' ecosystem. Add a `- package-ecosystem: {{ ecosystem }}` block to keep those dependencies updated.",
            noUpdateEntries:
                "Dependabot config '{{ configPath }}' does not contain any `updates` entries. Add at least one `- package-ecosystem:` block to enable automated dependency updates.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-dependabot-ecosystem-coverage",
});

export default rule;
