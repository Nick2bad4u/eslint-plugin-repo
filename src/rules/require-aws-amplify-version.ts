import { basename, dirname, relative } from "node:path";
import { setHas, stringSplit } from "ts-extras";

import {
    getAwsAmplifyConfigPath,
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

const hasTopLevelVersion = (yamlSource: string): boolean =>
    stringSplit(normalizeLineEndings(yamlSource), "\n").some((line) => {
        const trimmed = line.trim();

        if (trimmed.length === 0 || trimmed.startsWith("#")) {
            return false;
        }

        return !line.startsWith(" ") && trimmed.startsWith("version:");
    });

/** Rule enforcing explicit AWS Amplify spec version metadata. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const triggerFileName = basename(context.physicalFilename);

        if (!setHas(triggerFileNames, triggerFileName)) {
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

                if (hasTopLevelVersion(amplifySource)) {
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
