import * as path from "node:path";
import { arrayJoin, isEmpty, setHas, stringSplit } from "ts-extras";

import {
    getIndentationWidth,
    isBlankOrCommentLine,
} from "../_internal/config-file-scanner.js";
import {
    getForgejoWorkflowPaths,
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
                    getForgejoWorkflowPaths(rootDirectoryPath);

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
