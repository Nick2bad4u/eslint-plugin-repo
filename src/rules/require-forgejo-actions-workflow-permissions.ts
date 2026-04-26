import { existsSync, readdirSync } from "node:fs";
import * as path from "node:path";
import { arrayJoin, isEmpty, setHas, stringSplit } from "ts-extras";

import { providerRuleTriggerFileNames } from "../_internal/config-file-scanner.js";
import { readTextFileIfExists } from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const workflowExtensions = new Set([".yaml", ".yml"]);

const collectWorkflowFiles = (rootDirectoryPath: string): readonly string[] => {
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

/** Returns true if the YAML source contains any `permissions:` key. */
const hasPermissionsKey = (yamlSource: string): boolean => {
    const lines = stringSplit(yamlSource.replaceAll("\r\n", "\n"), "\n");

    for (const line of lines) {
        const trimmedStart = line.trimStart();

        if (trimmedStart.startsWith("#")) {
            continue;
        }

        if (trimmedStart.startsWith("permissions:")) {
            return true;
        }
    }

    return false;
};

/** Rule definition for enforcing explicit Forgejo Actions token permissions. */
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
                const workflowPaths = collectWorkflowFiles(rootDirectoryPath);

                if (isEmpty(workflowPaths)) {
                    return;
                }

                const missingPermissionsWorkflowPaths = workflowPaths.filter(
                    (workflowPath) => {
                        const workflowSource =
                            readTextFileIfExists(workflowPath);

                        return (
                            workflowSource !== null &&
                            !hasPermissionsKey(workflowSource)
                        );
                    }
                );

                if (isEmpty(missingPermissionsWorkflowPaths)) {
                    return;
                }

                const workflowList = arrayJoin(
                    missingPermissionsWorkflowPaths.map((workflowPath) =>
                        path
                            .relative(rootDirectoryPath, workflowPath)
                            .replaceAll(path.sep, "/")
                    ),
                    ", "
                );

                context.report({
                    data: {
                        workflowList,
                    },
                    messageId: "missingWorkflowPermissions",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require explicit `permissions` in each Forgejo Actions workflow to enforce least privilege for the default token.",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.strict",
                "repoPlugin.configs.codeberg",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl(
                "require-forgejo-actions-workflow-permissions"
            ),
        },
        messages: {
            missingWorkflowPermissions:
                "Forgejo workflow file(s) are missing an explicit permissions block: {{workflowList}}. Add workflow-level or job-level `permissions` to enforce least-privilege token access.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-forgejo-actions-workflow-permissions",
});

export default rule;
