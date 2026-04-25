import { basename, dirname, relative } from "node:path";
import { setHas } from "ts-extras";

import { providerRuleTriggerFileNames } from "../_internal/config-file-scanner.js";
import {
    getVercelConfigPath,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const isJsonObject = (source: string): boolean => {
    try {
        const parsed = JSON.parse(source) as unknown;

        return (
            typeof parsed === "object" &&
            parsed !== null &&
            !Array.isArray(parsed)
        );
    } catch {
        return false;
    }
};

/** Rule enforcing top-level object shape for vercel.json configs. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const triggerFileName = basename(context.physicalFilename);

        if (!setHas(providerRuleTriggerFileNames, triggerFileName)) {
            return {};
        }

        const repositoryRoot = dirname(context.physicalFilename);
        const configPath = getVercelConfigPath(repositoryRoot);

        if (configPath === null) {
            return {};
        }

        return {
            Program(node) {
                const vercelSource = readTextFileIfExists(configPath);

                if (vercelSource === null) {
                    return;
                }

                if (isJsonObject(vercelSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "nonObjectVercelConfig",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require `vercel.json` to contain a top-level JSON object",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.vercel",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-vercel-config-object"),
        },
        messages: {
            nonObjectVercelConfig:
                "Vercel config '{{ configPath }}' must be a top-level JSON object. Use object-based configuration to keep settings explicit and tooling-compatible.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-vercel-config-object",
});

export default rule;
