import { basename, dirname, relative } from "node:path";
import { setHas } from "ts-extras";

import {
    getTopLevelYamlKeyValue,
    providerRuleTriggerFileNames,
} from "../_internal/config-file-scanner.js";
import {
    getAwsAmplifyConfigPath,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

/** Rule enforcing supported top-level AWS Amplify spec version value. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const triggerFileName = basename(context.physicalFilename);

        if (!setHas(providerRuleTriggerFileNames, triggerFileName)) {
            return {};
        }

        const repositoryRoot = dirname(context.physicalFilename);
        const configPath = getAwsAmplifyConfigPath(repositoryRoot);

        if (configPath === null) {
            return {};
        }

        return {
            Program(node) {
                const amplifySource = readTextFileIfExists(configPath);

                if (amplifySource === null) {
                    return;
                }

                const versionValue = getTopLevelYamlKeyValue(
                    amplifySource,
                    "version"
                );

                if (versionValue === "1") {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                        versionValue: versionValue ?? "<missing>",
                    },
                    messageId: "invalidAwsAmplifyVersionValue",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require AWS Amplify build specs to use supported top-level `version: 1`",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.aws",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-aws-amplify-version-value"),
        },
        messages: {
            invalidAwsAmplifyVersionValue:
                "AWS Amplify config '{{ configPath }}' has unsupported `version` value '{{ versionValue }}'. Use top-level `version: 1`.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-aws-amplify-version-value",
});

export default rule;
