import { basename, dirname, relative } from "node:path";
import { setHas } from "ts-extras";

import {
    getIndentationWidth,
    isBlankOrCommentLine,
    providerRuleTriggerFileNames,
    splitConfigLines,
} from "../_internal/config-file-scanner.js";
import {
    getAwsAmplifyConfigPath,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const lineStartsArtifactsBlock = (line: string): boolean =>
    !isBlankOrCommentLine(line) && line.trimStart() === "artifacts:";

const lineStartsBaseDirectoryEntry = (line: string): boolean =>
    !isBlankOrCommentLine(line) &&
    line.trimStart().startsWith("baseDirectory:");

const hasBaseDirectoryWithinBlock = (
    lines: readonly string[],
    artifactsHeaderIndex: number,
    artifactsIndentation: number
): boolean => {
    for (const nestedLine of lines.slice(artifactsHeaderIndex + 1)) {
        if (isBlankOrCommentLine(nestedLine)) {
            continue;
        }

        const nestedIndentation = getIndentationWidth(nestedLine);

        if (nestedIndentation <= artifactsIndentation) {
            return false;
        }

        if (lineStartsBaseDirectoryEntry(nestedLine)) {
            return true;
        }
    }

    return false;
};

const hasArtifactsBaseDirectory = (yamlSource: string): boolean => {
    const lines = splitConfigLines(yamlSource);

    for (const [lineIndex, line] of lines.entries()) {
        if (!lineStartsArtifactsBlock(line)) {
            continue;
        }

        const artifactsIndentation = getIndentationWidth(line);

        if (
            hasBaseDirectoryWithinBlock(lines, lineIndex, artifactsIndentation)
        ) {
            return true;
        }
    }

    return false;
};

/** Rule enforcing an explicit Amplify artifacts.baseDirectory setting. */
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

                if (hasArtifactsBaseDirectory(amplifySource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "missingAwsAmplifyArtifactsBaseDirectory",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require `artifacts.baseDirectory` in AWS Amplify build specs so the deployed output directory is explicit in version control",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.aws",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl(
                "require-aws-amplify-artifacts-base-directory"
            ),
        },
        messages: {
            missingAwsAmplifyArtifactsBaseDirectory:
                "AWS Amplify config '{{ configPath }}' is missing `artifacts.baseDirectory`. Declare the published output directory in the build spec so deployments stay reviewable and reproducible.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-aws-amplify-artifacts-base-directory",
});

export default rule;
