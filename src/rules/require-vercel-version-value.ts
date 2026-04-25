import type { UnknownRecord } from "type-fest";

import { basename, dirname, relative } from "node:path";
import { objectHasOwn, setHas } from "ts-extras";

import {
    getVercelConfigPath,
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

const isUnknownRecord = (value: unknown): value is Readonly<UnknownRecord> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const hasVersionTwo = (jsonSource: string): boolean => {
    const parsed = (() => {
        try {
            return JSON.parse(jsonSource) as unknown;
        } catch {
            return null;
        }
    })();

    if (!isUnknownRecord(parsed) || !objectHasOwn(parsed, "version")) {
        return false;
    }

    return parsed.version === 2;
};

/** Rule enforcing Vercel config version value. */
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

                if (hasVersionTwo(vercelSource)) {
                    return;
                }

                context.report({
                    data: { configPath: relative(repositoryRoot, configPath) },
                    messageId: "invalidVercelVersionValue",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description: "require `vercel.json` to use top-level `version: 2`",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.vercel",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-vercel-version-value"),
        },
        messages: {
            invalidVercelVersionValue:
                "Vercel config '{{ configPath }}' must declare `version: 2`.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-vercel-version-value",
});

export default rule;
