import { existsSync, readFileSync } from "node:fs";
import * as path from "node:path";
import { setHas, stringSplit } from "ts-extras";

import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const triggerFileNames = new Set([
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.ts",
]);

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

const normalizeLineEndings = (source: string): string =>
    source.replaceAll("\r\n", "\n");

const stripInlineComment = (line: string): string => {
    const commentIndex = line.indexOf("#");

    return commentIndex === -1
        ? line.trim()
        : line.slice(0, commentIndex).trim();
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

        if (!setHas(triggerFileNames, lintedFileName)) {
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

                const source = (() => {
                    try {
                        return readFileSync(pipelinesPath, "utf8");
                    } catch {
                        return null;
                    }
                })();

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
