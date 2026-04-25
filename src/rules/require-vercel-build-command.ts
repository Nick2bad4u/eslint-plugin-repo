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

const hasExplicitBuildCommand = (jsonSource: string): boolean => {
    const parsed = (() => {
        try {
            return JSON.parse(jsonSource) as unknown;
        } catch {
            return null;
        }
    })();

    if (!isUnknownRecord(parsed) || !objectHasOwn(parsed, "buildCommand")) {
        return false;
    }

    const buildCommand = parsed.buildCommand;

    return typeof buildCommand === "string" && buildCommand.trim().length > 0;
};

/** Rule enforcing explicit Vercel build command configuration. */
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

                if (hasExplicitBuildCommand(vercelSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "missingVercelBuildCommand",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require `buildCommand` in Vercel config so project build behavior is explicit and repository-driven",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.vercel",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-vercel-build-command"),
        },
        messages: {
            missingVercelBuildCommand:
                "Vercel config '{{ configPath }}' is missing a non-empty `buildCommand`. Declare build behavior in version control instead of relying on dashboard or auto-detected defaults.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-vercel-build-command",
});

export default rule;
