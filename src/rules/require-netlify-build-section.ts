import { basename, dirname, relative } from "node:path";
import { setHas } from "ts-extras";

import {
    hasTomlTableSection,
    providerRuleTriggerFileNames,
} from "../_internal/config-file-scanner.js";
import {
    getNetlifyConfigPath,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

/** Rule enforcing explicit [build] section in Netlify config. */
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

                if (hasTomlTableSection(netlifySource, "build")) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "missingNetlifyBuildSection",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require a `[build]` section in Netlify config so deploy build policy is defined in a canonical block",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.netlify",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-netlify-build-section"),
        },
        messages: {
            missingNetlifyBuildSection:
                "Netlify config '{{ configPath }}' is missing a `[build]` section. Define build settings in a canonical build block so deploy policy is explicit and reviewable.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-netlify-build-section",
});

export default rule;
