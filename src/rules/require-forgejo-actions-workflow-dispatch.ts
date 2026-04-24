import { existsSync, readdirSync, readFileSync } from "node:fs";
import * as path from "node:path";
import { arrayJoin, isEmpty, setHas, stringSplit } from "ts-extras";

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
    const commentStartIndex = line.indexOf("#");

    return commentStartIndex === -1 ? line : line.slice(0, commentStartIndex);
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

const hasWorkflowDispatchTrigger = (workflowSource: string): boolean => {
    const lines = stringSplit(normalizeLineEndings(workflowSource), "\n");

    for (const line of lines) {
        const strippedLine = stripInlineComment(line).trim();

        if (strippedLine.length === 0) {
            continue;
        }

        if (
            strippedLine === "workflow_dispatch" ||
            strippedLine === "- workflow_dispatch" ||
            strippedLine.startsWith("workflow_dispatch:")
        ) {
            return true;
        }

        if (
            strippedLine.startsWith("on:") &&
            strippedLine.includes("workflow_dispatch")
        ) {
            return true;
        }
    }

    return false;
};

/**
 * Rule definition for requiring manual workflow_dispatch triggers in Forgejo
 * Actions workflows.
 */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const lintedFilePath = context.physicalFilename;
        const lintedFileName = path.basename(lintedFilePath);

        if (!setHas(triggerFileNames, lintedFileName)) {
            return {};
        }

        const rootDirectoryPath = path.dirname(lintedFilePath);

        return {
            Program(node) {
                const workflowPaths =
                    collectForgejoWorkflowFiles(rootDirectoryPath);

                if (isEmpty(workflowPaths)) {
                    return;
                }

                const missingWorkflowDispatchPaths: string[] = [];

                for (const workflowPath of workflowPaths) {
                    let workflowSource: null | string = null;

                    try {
                        workflowSource = readFileSync(workflowPath, "utf8");
                    } catch {
                        // Ignore unreadable workflow files and keep scanning.
                    }

                    if (workflowSource === null) {
                        continue;
                    }

                    if (hasWorkflowDispatchTrigger(workflowSource)) {
                        continue;
                    }

                    missingWorkflowDispatchPaths.push(
                        path
                            .relative(rootDirectoryPath, workflowPath)
                            .replaceAll(path.sep, "/")
                    );
                }

                if (isEmpty(missingWorkflowDispatchPaths)) {
                    return;
                }

                context.report({
                    data: {
                        files: arrayJoin(missingWorkflowDispatchPaths, ", "),
                    },
                    messageId: "missingWorkflowDispatch",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require workflow_dispatch trigger in Forgejo Actions workflows so maintainers can execute workflows manually when needed.",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.codeberg",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-forgejo-actions-workflow-dispatch"),
        },
        messages: {
            missingWorkflowDispatch:
                "Forgejo workflow file(s) are missing a workflow_dispatch trigger: {{files}}.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "require-forgejo-actions-workflow-dispatch",
});

export default rule;
