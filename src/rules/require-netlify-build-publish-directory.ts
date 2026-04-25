import { basename, dirname, relative } from "node:path";
import { setHas, stringSplit } from "ts-extras";

import {
    getNetlifyConfigPath,
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

const hasBuildPublishDirectory = (tomlSource: string): boolean =>
    stringSplit(normalizeLineEndings(tomlSource), "\n").some((line) => {
        const trimmed = line.trim();

        if (trimmed.length === 0 || trimmed.startsWith("#")) {
            return false;
        }

        return /^publish\s*=\s*\S/v.test(trimmed);
    });

/** Rule enforcing an explicit Netlify publish directory. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const triggerFileName = basename(context.physicalFilename);

        if (!setHas(triggerFileNames, triggerFileName)) {
            return {};
        }

        const repositoryRoot = dirname(context.physicalFilename);
        const configPath = getNetlifyConfigPath(repositoryRoot);

        if (configPath === null) {
            return {};
        }

        return {
            Program(node) {
                const netlifySource = readTextFileIfExists(configPath);

                if (netlifySource === null) {
                    return;
                }

                if (hasBuildPublishDirectory(netlifySource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "missingNetlifyBuildPublishDirectory",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require an explicit Netlify publish directory so the deployed output path is stored in version control",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.netlify",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-netlify-build-publish-directory"),
        },
        messages: {
            missingNetlifyBuildPublishDirectory:
                "Netlify config '{{ configPath }}' is missing `publish = ...`. Declare the deploy output directory in version control instead of relying on dashboard-only settings.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-netlify-build-publish-directory",
});

export default rule;
