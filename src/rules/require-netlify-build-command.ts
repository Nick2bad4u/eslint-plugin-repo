import { basename, dirname, relative } from "node:path";
import { setHas } from "ts-extras";

import {
    hasTomlKey,
    providerRuleTriggerFileNames,
} from "../_internal/config-file-scanner.js";
import {
    getNetlifyConfigPath,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

/** Rule enforcing explicit Netlify build command configuration. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const triggerFileName = basename(context.physicalFilename);

        if (!setHas(providerRuleTriggerFileNames, triggerFileName)) {
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

                if (hasTomlKey(netlifySource, "command")) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "missingNetlifyBuildCommand",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require an explicit Netlify build command so CI build behavior is versioned in `netlify.toml`",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.netlify",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-netlify-build-command"),
        },
        messages: {
            missingNetlifyBuildCommand:
                "Netlify config '{{ configPath }}' is missing `command = ...`. Declare the build command in version control to avoid dashboard-only drift.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-netlify-build-command",
});

export default rule;
