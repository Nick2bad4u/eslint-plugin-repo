import * as path from "node:path";
import { setHas } from "ts-extras";

import { providerRuleTriggerFileNames } from "../_internal/config-file-scanner.js";
import {
    getForgejoWorkflowPaths,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";
import { hasWorkflowOnEvent } from "../_internal/workflow-on-events.js";

/**
 * Check whether a workflow file source has at least one `push:` or
 * `pull_request:` trigger in the `on:` block.
 *
 * We look for these trigger keywords at a single level of indentation (i.e., as
 * direct children of the `on:` mapping).
 */
const hasStandardTrigger = (source: string): boolean =>
    ["pull_request", "push"].some((eventName) =>
        hasWorkflowOnEvent(source, eventName)
    );

/** Rule enforcing standard workflow triggers in Forgejo Actions. */
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
                const workflowFiles =
                    getForgejoWorkflowPaths(rootDirectoryPath);

                for (const workflowFilePath of workflowFiles) {
                    const source = readTextFileIfExists(workflowFilePath);

                    if (source === null) {
                        continue;
                    }

                    if (!hasStandardTrigger(source)) {
                        context.report({
                            data: {
                                workflowFile: path
                                    .relative(
                                        rootDirectoryPath,
                                        workflowFilePath
                                    )
                                    .replaceAll(path.sep, "/"),
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
