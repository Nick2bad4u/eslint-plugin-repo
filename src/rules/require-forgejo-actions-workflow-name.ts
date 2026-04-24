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

const getIndentationWidth = (line: string): number => {
    let width = 0;

    for (const character of line) {
        if (character !== " ") {
            break;
        }

        width += 1;
    }

    return width;
};

const isBlankOrCommentLine = (line: string): boolean => {
    const trimmed = line.trim();

    return trimmed.length === 0 || trimmed.startsWith("#");
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

const hasRootWorkflowName = (workflowSource: string): boolean => {
    const lines = stringSplit(normalizeLineEndings(workflowSource), "\n");

    for (const line of lines) {
        if (isBlankOrCommentLine(line)) {
            continue;
        }

        if (getIndentationWidth(line) !== 0) {
            continue;
        }

        if (line.trimStart().startsWith("name:")) {
            return true;
        }
    }

    return false;
};

/**
 * Rule definition for requiring explicit workflow names in Forgejo actions
 * files.
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

                const missingNames: string[] = [];

                for (const workflowPath of workflowPaths) {
                    const workflowSource = (() => {
                        try {
                            return readFileSync(workflowPath, "utf8");
                        } catch {
                            return null;
                        }
                    })();

                    if (workflowSource === null) {
                        continue;
                    }

                    if (hasRootWorkflowName(workflowSource)) {
                        continue;
                    }

                    missingNames.push(
                        path
                            .relative(rootDirectoryPath, workflowPath)
                            .replaceAll(path.sep, "/")
                    );
                }

                if (isEmpty(missingNames)) {
                    return;
                }

                context.report({
                    data: {
                        workflowFiles: arrayJoin(missingNames, ", "),
                    },
                    messageId: "missingForgejoWorkflowName",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require explicit top-level `name` in Forgejo workflow files for clearer run labeling.",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.codeberg",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-forgejo-actions-workflow-name"),
        },
        messages: {
            missingForgejoWorkflowName:
                "Forgejo workflow file(s) are missing a root `name` key: {{workflowFiles}}. Add explicit names for clearer run visibility.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "require-forgejo-actions-workflow-name",
});

export default rule;
