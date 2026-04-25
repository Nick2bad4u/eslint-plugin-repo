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

/**
 * Detect image: entries that lack a pinned tag (i.e. no `:version`), or use
 * `:latest`.
 *
 * Returns line numbers (1-based) where an unpinned image is found.
 */
const unpinnedImageLines = (source: string): readonly number[] => {
    const lines = stringSplit(normalizeLineEndings(source), "\n");
    const problematic: number[] = [];

    for (const [index, line] of lines.entries()) {
        const trimmed = line.trimStart();

        if (!trimmed.startsWith("image:")) {
            continue;
        }

        const value = trimmed
            .slice("image:".length)
            .trim()
            .replaceAll(/["']/gv, "");

        if (value.length === 0 || value.startsWith("{") || value === "name:") {
            continue;
        }

        const colonIndex = value.lastIndexOf(":");

        if (colonIndex === -1 || value.slice(colonIndex + 1) === "latest") {
            problematic.push(index + 1);
        }
    }

    return problematic;
};

/** Rule enforcing pinned image tags in Bitbucket Pipelines. */
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

                const problemLines = unpinnedImageLines(source);

                for (const lineNumber of problemLines) {
                    context.report({
                        data: {
                            configPath: bitbucketPipelinesRelativePath,
                            lineNumber: String(lineNumber),
                        },
                        messageId: "unpinnedImage",
                        node,
                    });
                }
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require pinned (non-latest) Docker image tags in Bitbucket Pipelines for reproducible builds",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.bitbucket",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl(
                "require-bitbucket-pipelines-image-pinned-tag"
            ),
        },
        messages: {
            unpinnedImage:
                "{{ configPath }} line {{ lineNumber }}: `image:` uses an unpinned or `latest` tag. Specify an exact version tag (e.g. `node:20.11-alpine`) to ensure reproducible builds.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-bitbucket-pipelines-image-pinned-tag",
});

export default rule;
