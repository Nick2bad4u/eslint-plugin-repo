import { existsSync, readdirSync, readFileSync } from "node:fs";
import * as path from "node:path";
import { setHas, stringSplit } from "ts-extras";

import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const triggerFileNames = new Set([
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.ts",
]);

const workflowExtensions = new Set([".yaml", ".yml"]);

const normalizeLineEndings = (source: string): string =>
    source.replaceAll("\r\n", "\n");

const stripInlineComment = (line: string): string => {
    const commentIndex = line.indexOf("#");

    return commentIndex === -1
        ? line.trim()
        : line.slice(0, commentIndex).trim();
};

const collectForgejoWorkflowFiles = (
    rootDirectoryPath: string
): readonly string[] => {
    const workflowsDirectoryPath = path.join(
        rootDirectoryPath,
        ".forgejo",
        "workflows"
    );

    if (!existsSync(workflowsDirectoryPath)) {
        return [];
    }

    const entries = readdirSync(workflowsDirectoryPath, {
        withFileTypes: true,
    });

    const workflowPaths: string[] = [];

    for (const entry of entries) {
        if (!entry.isFile()) {
            continue;
        }

        if (
            !setHas(workflowExtensions, path.extname(entry.name).toLowerCase())
        ) {
            continue;
        }

        workflowPaths.push(path.join(workflowsDirectoryPath, entry.name));
    }

    return workflowPaths;
};

/**
 * Check whether a workflow file source has at least one `push:` or
 * `pull_request:` trigger in the `on:` block.
 *
 * We look for these trigger keywords at a single level of indentation (i.e., as
 * direct children of the `on:` mapping).
 */
const hasStandardTrigger = (source: string): boolean =>
    stringSplit(normalizeLineEndings(source), "\n").some((line) => {
        const trimmed = stripInlineComment(line);

        return trimmed === "push:" || trimmed === "pull_request:";
    });

/** Rule enforcing standard workflow triggers in Forgejo Actions. */
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
                const workflowFiles =
                    collectForgejoWorkflowFiles(rootDirectoryPath);

                for (const workflowFilePath of workflowFiles) {
                    const source = (() => {
                        try {
                            return readFileSync(workflowFilePath, "utf8");
                        } catch {
                            return null;
                        }
                    })();

                    if (source === null) {
                        continue;
                    }

                    if (!hasStandardTrigger(source)) {
                        context.report({
                            data: {
                                workflowFile: path.relative(
                                    rootDirectoryPath,
                                    workflowFilePath
                                ),
                            },
                            messageId: "missingStandardTrigger",
                            node,
                        });
                    }
                }
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require at least one `push:` or `pull_request:` trigger in every Forgejo Actions workflow for adequate CI coverage",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.codeberg",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl(
                "require-forgejo-actions-workflow-trigger-coverage"
            ),
        },
        messages: {
            missingStandardTrigger:
                "'{{ workflowFile }}' does not include a `push:` or `pull_request:` trigger. Add at least one to ensure CI runs on code changes.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "require-forgejo-actions-workflow-trigger-coverage",
});

export default rule;
