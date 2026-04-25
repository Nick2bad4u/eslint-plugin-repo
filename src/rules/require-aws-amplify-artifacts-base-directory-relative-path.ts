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

const getBaseDirectoryValue = (yamlSource: string): null | string => {
    const lineWithBaseDirectory = stringSplit(
        normalizeLineEndings(yamlSource),
        "\n"
    ).find((line) => {
        const trimmed = line.trim();

        if (trimmed.length === 0 || trimmed.startsWith("#")) {
            return false;
        }

        return trimmed.startsWith("baseDirectory:");
    });

    if (typeof lineWithBaseDirectory !== "string") {
        return null;
    }

    return lineWithBaseDirectory
        .slice(lineWithBaseDirectory.indexOf(":") + 1)
        .trim()
        .replaceAll(/["']/gv, "");
};

/** Rule enforcing relative baseDirectory values in AWS Amplify artifacts config. */
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

                const baseDirectoryValue = getBaseDirectoryValue(amplifySource);

                if (
                    typeof baseDirectoryValue !== "string" ||
                    !baseDirectoryValue.startsWith("/")
                ) {
                    return;
                }

                context.report({
                    data: {
                        baseDirectoryValue,
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId:
                        "absoluteAwsAmplifyArtifactsBaseDirectoryRelativePath",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require AWS Amplify `artifacts.baseDirectory` to be repository-relative instead of absolute",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.aws",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl(
                "require-aws-amplify-artifacts-base-directory-relative-path"
            ),
        },
        messages: {
            absoluteAwsAmplifyArtifactsBaseDirectoryRelativePath:
                "AWS Amplify config '{{ configPath }}' uses absolute artifacts.baseDirectory '{{ baseDirectoryValue }}'. Use a repository-relative build output directory.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-aws-amplify-artifacts-base-directory-relative-path",
});

export default rule;
