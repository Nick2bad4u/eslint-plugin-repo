import { basename, dirname, relative } from "node:path";
import { setHas } from "ts-extras";

import { providerRuleTriggerFileNames } from "../_internal/config-file-scanner.js";
import {
    getVercelConfigPath,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const isValidJsonDocument = (source: string): boolean => {
    try {
        JSON.parse(source);

        return true;
    } catch {
        return false;
    }
};

/** Rule enforcing valid JSON syntax in vercel.json. */
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

                if (isValidJsonDocument(vercelSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "invalidVercelJson",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require `vercel.json` to be valid JSON so deployment configuration is parseable and reviewable",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.vercel",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-vercel-valid-json"),
        },
        messages: {
            invalidVercelJson:
                "Vercel config '{{ configPath }}' is not valid JSON. Fix syntax errors so deployment configuration can be parsed reliably.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-vercel-valid-json",
});

export default rule;
