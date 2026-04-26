import { existsSync } from "node:fs";
import * as path from "node:path";
import { setHas, stringSplit } from "ts-extras";

import {
    providerRuleTriggerFileNames,
    stripInlineComment,
} from "../_internal/config-file-scanner.js";
import {
    normalizeLineEndings,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const bitbucketPipelinesRelativePath = "bitbucket-pipelines.yml";

const getBitbucketPipelinesPath = (
    rootDirectoryPath: string
): null | string => {
    const candidatePath = path.join(
        rootDirectoryPath,
        bitbucketPipelinesRelativePath
    );

    return existsSync(candidatePath) ? candidatePath : null;
};

/**
 * Check whether the Bitbucket Pipelines config has a `clone: depth:` entry.
 * Without it, Bitbucket performs a full clone which can be very slow for large
 * repositories.
 */
const hasCloneDepth = (source: string): boolean =>
    stringSplit(normalizeLineEndings(source), "\n").some((line) =>
        stripInlineComment(line).startsWith("depth:")
    );

/** Rule enforcing a `clone.depth` setting in Bitbucket Pipelines. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const lintedFilePath = context.physicalFilename;
        const lintedFileName = path.basename(lintedFilePath);

        if (!setHas(providerRuleTriggerFileNames, lintedFileName)) {
            return {};
        }

        const rootDirectoryPath = path.dirname(lintedFilePath);

        return {
            Program(node): void {
                const pipelinesPath =
                    getBitbucketPipelinesPath(rootDirectoryPath);

                if (pipelinesPath === null) {
                    return;
                }

                const source = readTextFileIfExists(pipelinesPath);

                if (source === null) {
                    return;
                }

                if (hasCloneDepth(source)) {
                    return;
                }

                context.report({
                    data: { configPath: bitbucketPipelinesRelativePath },
                    messageId: "missingCloneDepth",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require a `clone.depth` setting in Bitbucket Pipelines to limit clone history for faster builds",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.bitbucket",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-bitbucket-pipelines-clone-depth"),
        },
        messages: {
            missingCloneDepth:
                "{{ configPath }} is missing a `clone: depth:` setting. Add `clone:\\n  depth: 1` (or a suitable number) to speed up pipeline checkout times.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "require-bitbucket-pipelines-clone-depth",
});

export default rule;
