import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { isDefined, setHas, stringSplit } from "ts-extras";

import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const triggerFileNames = new Set([
    "eslint.config.cjs",
    "eslint.config.js",
    "eslint.config.mjs",
]);

const hasDependabotReviewers = (yamlSource: string): boolean => {
    const normalizedSource = yamlSource.replaceAll(/\r\n?/gv, "\n");
    const lines = stringSplit(normalizedSource, "\n");

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

                if (hasDependabotReviewers(dependabotSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: ".github/dependabot.yml",
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
