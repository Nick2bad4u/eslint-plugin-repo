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

const stripInlineComment = (line: string): string => {
    const commentStartIndex = line.indexOf("#");

    return commentStartIndex === -1 ? line : line.slice(0, commentStartIndex);
};

const normalizeScalar = (value: string): string => {
    const trimmedValue = value.trim();

    if (
        (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) ||
        (trimmedValue.startsWith("'") && trimmedValue.endsWith("'"))
    ) {
        return trimmedValue.slice(1, -1);
    }

    return trimmedValue;
};

const collectForgejoWorkflowFiles = (rootDirectoryPath: string): string[] => {
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

const hasWriteAllPermissions = (workflowSource: string): boolean => {
    const lines = stringSplit(workflowSource.replaceAll("\r\n", "\n"), "\n");

    for (const rawLine of lines) {
        const line = stripInlineComment(rawLine).trim();

        if (!line.startsWith("permissions:")) {
            continue;
        }

        const permissionsValue = normalizeScalar(
            line.slice("permissions:".length).trim()
        );

        if (permissionsValue === "write-all") {
            return true;
        }
    }

    return false;
};

/** Rule definition for this repository compliance requirement. */
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

                const violatingWorkflowPaths: string[] = [];

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

                    if (!hasWriteAllPermissions(workflowSource)) {
                        continue;
                    }

                    violatingWorkflowPaths.push(
                        path
                            .relative(rootDirectoryPath, workflowPath)
                            .replaceAll(path.sep, "/")
                    );
                }

                if (isEmpty(violatingWorkflowPaths)) {
                    return;
                }

                context.report({
                    data: {
                        workflowList: arrayJoin(violatingWorkflowPaths, ", "),
                    },
                    messageId: "noWriteAllPermissions",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require Forgejo Actions workflows to avoid `permissions: write-all` in favor of least-privilege scoped permissions.",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.codeberg",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl(
                "require-forgejo-actions-no-write-all-permissions"
            ),
        },
        messages: {
            noWriteAllPermissions:
                "Forgejo workflow file(s) use `permissions: write-all`: {{workflowList}}. Use least-privilege scoped permissions instead.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-forgejo-actions-no-write-all-permissions",
});

export default rule;
