import type { UnknownRecord } from "type-fest";

import { basename, dirname, relative } from "node:path";
import { objectHasOwn, setHas } from "ts-extras";

import {
    getVercelConfigPath,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const expectedSchemaFragment = "vercel.json";

const triggerFileNames = new Set([
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.ts",
    "package.json",
]);

const isUnknownRecord = (value: unknown): value is Readonly<UnknownRecord> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const hasVercelSchemaUrl = (jsonSource: string): boolean => {
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

    const schemaValue = parsed.$schema;

    return (
        typeof schemaValue === "string" &&
        schemaValue.trim().length > 0 &&
        schemaValue.includes(expectedSchemaFragment)
    );
};

/** Rule enforcing meaningful Vercel schema URL metadata. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const triggerFileName = basename(context.physicalFilename);

        if (!setHas(triggerFileNames, triggerFileName)) {
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

                if (hasVercelSchemaUrl(vercelSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "missingVercelSchemaUrl",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require Vercel `$schema` values to point to a vercel.json schema URL",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.vercel",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-vercel-schema-url"),
        },
        messages: {
            missingVercelSchemaUrl:
                "Vercel config '{{ configPath }}' is missing a vercel.json schema URL in `$schema`. Use schema metadata that references vercel.json for reliable validation tooling.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-vercel-schema-url",
});

export default rule;
