import { basename, dirname, relative } from "node:path";
import { setHas, stringSplit } from "ts-extras";

import {
    getDigitalOceanAppSpecPath,
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

const getTopLevelNameValue = (yamlSource: string): null | string => {
    const nameLine = stringSplit(normalizeLineEndings(yamlSource), "\n").find(
        (line) => {
            const trimmed = line.trim();

            if (trimmed.length === 0 || trimmed.startsWith("#")) {
                return false;
            }

            return !line.startsWith(" ") && trimmed.startsWith("name:");
        }
    );

    if (typeof nameLine !== "string") {
        return null;
    }

    return nameLine
        .slice(nameLine.indexOf(":") + 1)
        .trim()
        .replaceAll(/["']/gv, "");
};

/** Rule enforcing non-empty top-level DigitalOcean app spec name values. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const triggerFileName = basename(context.physicalFilename);

        if (!setHas(triggerFileNames, triggerFileName)) {
            return {};
        }

        const repositoryRoot = dirname(context.physicalFilename);
        const appSpecPath = getDigitalOceanAppSpecPath(repositoryRoot);

        if (appSpecPath === null) {
            return {};
        }

        return {
            Program(node) {
                const appSpecSource = readTextFileIfExists(appSpecPath);

                if (appSpecSource === null) {
                    return;
                }

                const nameValue = getTopLevelNameValue(appSpecSource);

                if (typeof nameValue === "string" && nameValue.length > 0) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, appSpecPath),
                    },
                    messageId: "missingDigitalOceanAppSpecNameValue",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require DigitalOcean app spec `name` keys to contain non-empty values",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.digitalOcean",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-digitalocean-app-spec-name-value"),
        },
        messages: {
            missingDigitalOceanAppSpecNameValue:
                "DigitalOcean app spec '{{ configPath }}' has missing or empty `name` value. Set explicit app identity in repository-managed config.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-digitalocean-app-spec-name-value",
});

export default rule;
