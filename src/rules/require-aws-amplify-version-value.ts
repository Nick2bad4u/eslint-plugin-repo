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

const getTopLevelVersionValue = (yamlSource: string): null | string => {
    const versionLine = stringSplit(
        normalizeLineEndings(yamlSource),
        "\n"
    ).find((line) => {
        const trimmed = line.trim();

        if (trimmed.length === 0 || trimmed.startsWith("#")) {
            return false;
        }

        return !line.startsWith(" ") && trimmed.startsWith("version:");
    });

    if (typeof versionLine !== "string") {
        return null;
    }

    return versionLine
        .slice(versionLine.indexOf(":") + 1)
        .trim()
        .replaceAll(/["']/gv, "");
};

/** Rule enforcing supported top-level AWS Amplify spec version value. */
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

                const versionValue = getTopLevelVersionValue(amplifySource);

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
