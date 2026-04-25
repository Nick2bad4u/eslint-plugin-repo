import { basename, dirname, relative } from "node:path";
import { setHas } from "ts-extras";

import {
    getTomlKeyValue,
    providerRuleTriggerFileNames,
} from "../_internal/config-file-scanner.js";
import {
    getNetlifyConfigPath,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

/** Rule enforcing non-empty Netlify publish directory values. */
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

                const publishValue = getTomlKeyValue(netlifySource, "publish");

                if (
                    typeof publishValue === "string" &&
                    publishValue.length > 0
                ) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "missingOrEmptyNetlifyPublishDirectory",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require Netlify `publish` directory values to be present and non-empty",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.netlify",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl(
                "require-netlify-publish-directory-non-empty"
            ),
        },
        messages: {
            missingOrEmptyNetlifyPublishDirectory:
                "Netlify config '{{ configPath }}' is missing a non-empty `publish` directory value. Define deploy output directory explicitly.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-netlify-publish-directory-non-empty",
});

export default rule;
