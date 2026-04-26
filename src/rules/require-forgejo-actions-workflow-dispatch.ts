import * as path from "node:path";
import { arrayJoin, isEmpty, setHas } from "ts-extras";

import { providerRuleTriggerFileNames } from "../_internal/config-file-scanner.js";
import {
    getForgejoWorkflowPaths,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";
import { hasWorkflowOnEvent } from "../_internal/workflow-on-events.js";

const hasWorkflowDispatchTrigger = (workflowSource: string): boolean =>
    hasWorkflowOnEvent(workflowSource, "workflow_dispatch");

/**
 * Rule definition for requiring manual workflow_dispatch triggers in Forgejo
 * Actions workflows.
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
                    getForgejoWorkflowPaths(rootDirectoryPath);

                if (isEmpty(workflowPaths)) {
                    return;
                }

                const missingWorkflowDispatchPaths: string[] = [];

                for (const workflowPath of workflowPaths) {
                    const workflowSource = readTextFileIfExists(workflowPath);

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
