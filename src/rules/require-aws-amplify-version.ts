import { basename, dirname, relative } from "node:path";
import { setHas } from "ts-extras";

import {
    hasTopLevelYamlKey,
    providerRuleTriggerFileNames,
} from "../_internal/config-file-scanner.js";
import {
    getAwsAmplifyConfigPath,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

/** Rule enforcing explicit AWS Amplify spec version metadata. */
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

                if (hasTopLevelYamlKey(amplifySource, "version")) {
                    return;
                }

                context.report({
                    data: { configPath: relative(repositoryRoot, configPath) },
                    messageId: "missingAwsAmplifyVersion",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require a top-level `version` in AWS Amplify build specs so specification semantics are explicit",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.aws",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-aws-amplify-version"),
        },
        messages: {
            missingAwsAmplifyVersion:
                "AWS Amplify config '{{ configPath }}' is missing a top-level `version`. Declare spec version explicitly so build semantics stay predictable.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-aws-amplify-version",
});

export default rule;
