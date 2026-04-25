import type { UnknownRecord } from "type-fest";

import { basename, dirname, relative } from "node:path";
import { objectHasOwn, setHas } from "ts-extras";

import { providerRuleTriggerFileNames } from "../_internal/config-file-scanner.js";
import {
    getVercelConfigPath,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const isUnknownRecord = (value: unknown): value is Readonly<UnknownRecord> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const hasSchemaProperty = (jsonSource: string): boolean => {
    const parsed = (() => {
        try {
            return JSON.parse(jsonSource) as unknown;
        } catch {
            return null;
        }
    })();

    if (!isUnknownRecord(parsed) || !objectHasOwn(parsed, "$schema")) {
        return false;
    }

    const schemaProperty = parsed.$schema;

    return (
        typeof schemaProperty === "string" && schemaProperty.trim().length > 0
    );
};

/** Rule enforcing schema declaration in Vercel config files. */
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

                if (hasSchemaProperty(vercelSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "missingVercelSchemaProperty",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require `$schema` in Vercel config files so schema validation and editor tooling are consistently available",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.vercel",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-vercel-schema"),
        },
        messages: {
            missingVercelSchemaProperty:
                "Vercel config '{{ configPath }}' is missing a non-empty `$schema` property. Add schema metadata so configuration drift is easier to detect in tooling and review.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-vercel-schema",
});

export default rule;
