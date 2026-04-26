import { existsSync } from "node:fs";
import * as path from "node:path";
import { setHas, stringSplit } from "ts-extras";

import { providerRuleTriggerFileNames } from "../_internal/config-file-scanner.js";
import {
    normalizeLineEndings,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const bitbucketPipelinesPaths = [
    "bitbucket-pipelines.yml",
    "bitbucket-pipelines.yaml",
] as const;

const isCommentLine = (line: string): boolean =>
    line.trimStart().startsWith("#");

/**
 * Returns true if the YAML source contains a `pull-requests:` pipeline section.
 */
const hasPullRequestsPipeline = (yamlSource: string): boolean => {
    const lines = stringSplit(normalizeLineEndings(yamlSource), "\n");

    for (const line of lines) {
        if (isCommentLine(line)) {
            continue;
        }

        const trimmed = line.trimStart();
        if (
            trimmed === "pull-requests:" ||
            trimmed.startsWith("pull-requests: ")
        ) {
            return true;
        }
    }

    return false;
};

const getBitbucketPipelinesPath = (
    rootDirectoryPath: string
): null | string => {
    for (const relativePath of bitbucketPipelinesPaths) {
        const absolutePath = path.join(rootDirectoryPath, relativePath);

        if (existsSync(absolutePath)) {
            return absolutePath;
        }
    }

    return null;
};

/**
 * Rule definition for enforcing pull-request pipeline coverage in Bitbucket.
 */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const lintedFilePath = context.physicalFilename;
        const lintedFileName = path.basename(lintedFilePath);

        if (!setHas(providerRuleTriggerFileNames, lintedFileName)) {
            return {};
        }

        const rootDirectoryPath = path.dirname(lintedFilePath);

        return {
            Program(node) {
                const pipelinesPath =
                    getBitbucketPipelinesPath(rootDirectoryPath);

                if (pipelinesPath === null) {
                    return;
                }

                const pipelinesSource = readTextFileIfExists(pipelinesPath);

                if (pipelinesSource === null) {
                    return;
                }

                if (hasPullRequestsPipeline(pipelinesSource)) {
                    return;
                }

                context.report({
                    messageId: "missingBitbucketPullRequestsPipeline",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require a `pull-requests:` pipeline section in Bitbucket Pipelines for PR validation coverage.",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.bitbucket",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-bitbucket-pipelines-pull-requests"),
        },
        messages: {
            missingBitbucketPullRequestsPipeline:
                "`bitbucket-pipelines.yml` is missing a `pull-requests:` section. Add pull-request pipelines so CI runs on PR updates before merge.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-bitbucket-pipelines-pull-requests",
});

export default rule;
