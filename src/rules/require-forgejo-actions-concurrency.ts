import * as path from "node:path";
import { setHas } from "ts-extras";

import { providerRuleTriggerFileNames } from "../_internal/config-file-scanner.js";
import {
    getForgejoWorkflowPaths,
    normalizeLineEndings,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

/**
 * Check whether a workflow file source contains a top-level `concurrency:` key.
 */
const hasConcurrency = (source: string): boolean =>
    /^concurrency\s*:/mu.test(normalizeLineEndings(source));

/** Rule enforcing `concurrency:` in all Forgejo Actions workflow files. */
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

                    if (!hasConcurrency(source)) {
                        context.report({
                            data: {
                                workflowFile: path
                                    .relative(
                                        rootDirectoryPath,
                                        workflowFilePath
                                    )
                                    .replaceAll(path.sep, "/"),
                            },
                            messageId: "missingConcurrency",
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
                "require a `concurrency:` key in all Forgejo Actions workflow files to prevent redundant concurrent runs",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.codeberg",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-forgejo-actions-concurrency"),
        },
        messages: {
            missingConcurrency:
                "'{{ workflowFile }}' is missing a top-level `concurrency:` key. Add one so newer commits can cancel obsolete in-progress runs.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "require-forgejo-actions-concurrency",
});

export default rule;
