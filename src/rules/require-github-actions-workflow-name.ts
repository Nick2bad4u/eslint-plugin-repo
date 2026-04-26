import { existsSync, readdirSync } from "node:fs";
import * as path from "node:path";
import { arrayJoin, isEmpty, setHas, stringSplit } from "ts-extras";

import {
    getIndentationWidth,
    isBlankOrCommentLine,
    providerRuleTriggerFileNames,
} from "../_internal/config-file-scanner.js";
import {
    normalizeLineEndings,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const workflowExtensions = new Set([".yaml", ".yml"]);

const collectGitHubWorkflowFiles = (
    rootDirectoryPath: string
): readonly string[] => {
    const workflowsDirectoryPath = path.join(
        rootDirectoryPath,
        ".github",
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
 * Rule definition for requiring explicit workflow display names in GitHub
 * Actions files.
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
                const workflowPaths =
                    collectGitHubWorkflowFiles(rootDirectoryPath);

                if (isEmpty(workflowPaths)) {
                    return;
                }

                const missingNames: string[] = [];

                for (const workflowPath of workflowPaths) {
                    const workflowSource = readTextFileIfExists(workflowPath);

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
                    messageId: "missingWorkflowName",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require explicit top-level `name` in GitHub workflow files for clear Actions run labeling.",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.github",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-github-actions-workflow-name"),
        },
        messages: {
            missingWorkflowName:
                "GitHub workflow file(s) are missing a root `name` key: {{workflowFiles}}. Add explicit names for clearer run and UI visibility.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "require-github-actions-workflow-name",
});

export default rule;
