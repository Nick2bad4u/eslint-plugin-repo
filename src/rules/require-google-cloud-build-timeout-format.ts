import { basename, dirname, relative } from "node:path";
import { setHas } from "ts-extras";

import {
    getTopLevelYamlKeyValue,
    providerRuleTriggerFileNames,
} from "../_internal/config-file-scanner.js";
import {
    getGoogleCloudBuildConfigPath,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const timeoutValuePattern = /^\d+s$/v;

/** Rule enforcing valid Google Cloud Build timeout value format. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const triggerFileName = basename(context.physicalFilename);

        if (!setHas(providerRuleTriggerFileNames, triggerFileName)) {
            return {};
        }

        const repositoryRoot = dirname(context.physicalFilename);
        const configPath = getGoogleCloudBuildConfigPath(repositoryRoot);

        if (configPath === null) {
            return {};
        }

        return {
            Program(node) {
                const cloudBuildSource = readTextFileIfExists(configPath);

                if (cloudBuildSource === null) {
                    return;
                }

                const timeoutValue = getTopLevelYamlKeyValue(
                    cloudBuildSource,
                    "timeout"
                );

                // A missing timeout key is not a format violation; the
                // require-google-cloud-build-timeout rule covers existence.
                if (typeof timeoutValue !== "string") {
                    return;
                }

                if (timeoutValuePattern.test(timeoutValue)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                        timeoutValue,
                    },
                    messageId: "invalidGoogleCloudBuildTimeoutFormat",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require Google Cloud Build timeout values to use explicit seconds format (e.g. `1200s`)",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.googleCloud",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-google-cloud-build-timeout-format"),
        },
        messages: {
            invalidGoogleCloudBuildTimeoutFormat:
                "Google Cloud Build config '{{ configPath }}' has invalid timeout value '{{ timeoutValue }}'. Use an explicit seconds duration like `1200s`.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-google-cloud-build-timeout-format",
});

export default rule;
