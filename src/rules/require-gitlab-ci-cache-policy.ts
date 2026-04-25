import * as path from "node:path";
import { setHas, stringSplit } from "ts-extras";

import {
    getGitLabCiConfigPath,
    normalizeLineEndings,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const triggerFileNames = new Set([
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.ts",
]);

const isCacheBlockMissingPolicy = (
    lines: readonly string[],
    cacheLineIndex: number,
    cacheIndent: number
): boolean => {
    for (const subsequent of lines.slice(cacheLineIndex + 1)) {
        const subTrimmed = subsequent.trimStart();

        if (subTrimmed.length === 0 || subTrimmed.startsWith("#")) {
            continue;
        }

        const subIndent = subsequent.length - subTrimmed.length;

        if (subIndent <= cacheIndent) {
            return true;
        }

        if (subTrimmed.startsWith("policy:")) {
            return false;
        }
    }

    return true;
};

/**
 * Detect if a GitLab CI config has a `cache:` key that lacks a `policy:` entry.
 *
 * Strategy: scan all `cache:` lines. For each one, scan subsequent indented
 * lines. If we exit the cache block without seeing `policy:`, report it.
 */
const cacheBlocksLackingPolicy = (source: string): readonly number[] => {
    const lines = stringSplit(normalizeLineEndings(source), "\n");
    const problemLines: number[] = [];

    for (const [index, line] of lines.entries()) {
        const trimmed = line.trimStart();

        if (!trimmed.startsWith("cache:")) {
            continue;
        }

        const cacheIndent = line.length - trimmed.length;

        if (isCacheBlockMissingPolicy(lines, index, cacheIndent)) {
            problemLines.push(index + 1);
        }
    }

    return problemLines;
};

/** Rule enforcing an explicit `policy:` in every GitLab CI `cache:` block. */
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
                const gitlabCiPath = getGitLabCiConfigPath(rootDirectoryPath);

                if (gitlabCiPath === null) {
                    return;
                }

                const source = readTextFileIfExists(gitlabCiPath);

                if (source === null) {
                    return;
                }

                const problemLines = cacheBlocksLackingPolicy(source);

                for (const lineNumber of problemLines) {
                    context.report({
                        data: {
                            configPath: path
                                .relative(rootDirectoryPath, gitlabCiPath)
                                .replaceAll(path.sep, "/"),
                            lineNumber: String(lineNumber),
                        },
                        messageId: "missingCachePolicy",
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
                "require an explicit `policy:` in every GitLab CI `cache:` block to prevent unnecessary cache uploads",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.gitlab",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-gitlab-ci-cache-policy"),
        },
        messages: {
            missingCachePolicy:
                "{{ configPath }} line {{ lineNumber }}: `cache:` block is missing an explicit `policy:`. Add `policy: pull-push` (or `pull`) to control when the cache is saved.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "require-gitlab-ci-cache-policy",
});

export default rule;
