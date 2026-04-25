import { basename, dirname, relative } from "node:path";
import { setHas } from "ts-extras";

import {
    hasTopLevelYamlKey,
    providerRuleTriggerFileNames,
} from "../_internal/config-file-scanner.js";
import {
    getGoogleCloudBuildConfigPath,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

/** Rule enforcing an explicit Cloud Build timeout. */
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

                if (hasTopLevelYamlKey(cloudBuildSource, "timeout")) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "missingGoogleCloudBuildTimeout",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require a root `timeout` in Google Cloud Build configs to keep build duration budgets explicit",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.googleCloud",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-google-cloud-build-timeout"),
        },
        messages: {
            missingGoogleCloudBuildTimeout:
                "Google Cloud Build config '{{ configPath }}' is missing a root `timeout`. Set an explicit timeout so long-running builds fail predictably instead of consuming unbounded CI time.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-google-cloud-build-timeout",
});

export default rule;
