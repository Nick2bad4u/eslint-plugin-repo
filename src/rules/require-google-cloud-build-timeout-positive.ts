import { basename, dirname, relative } from "node:path";
import { isFinite, setHas } from "ts-extras";

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

const isPositiveTimeoutSeconds = (timeoutValue: string): boolean => {
    if (!/^\d+s$/v.test(timeoutValue)) {
        return false;
    }

    const numericPortion = Number.parseInt(timeoutValue.slice(0, -1), 10);

    return isFinite(numericPortion) && numericPortion > 0;
};

/** Rule enforcing positive timeout values in Google Cloud Build config. */
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

                // A missing timeout key is not a positivity violation; the
                // require-google-cloud-build-timeout rule covers existence.
                if (typeof timeoutValue !== "string") {
                    return;
                }

                if (isPositiveTimeoutSeconds(timeoutValue)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                        timeoutValue,
                    },
                    messageId: "nonPositiveGoogleCloudBuildTimeout",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require Google Cloud Build timeout values to be positive second durations",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.googleCloud",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl(
                "require-google-cloud-build-timeout-positive"
            ),
        },
        messages: {
            nonPositiveGoogleCloudBuildTimeout:
                "Google Cloud Build config '{{ configPath }}' has non-positive or invalid timeout '{{ timeoutValue }}'. Use a positive seconds duration (for example `1200s`).",
        },
        schema: [],
        type: "problem",
    },
    name: "require-google-cloud-build-timeout-positive",
});

export default rule;
