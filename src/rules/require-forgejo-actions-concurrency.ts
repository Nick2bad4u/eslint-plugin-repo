import { existsSync, readdirSync, readFileSync } from "node:fs";
import * as path from "node:path";
import { setHas } from "ts-extras";

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
 * Check whether a workflow file source contains a top-level `concurrency:` key.
 */
const hasConcurrency = (source: string): boolean =>
    /^concurrency\s*:/mu.test(normalizeLineEndings(source));

/** Rule enforcing `concurrency:` in all Forgejo Actions workflow files. */
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

                    if (!hasConcurrency(source)) {
                        context.report({
                            data: {
                                workflowFile: path.relative(
                                    rootDirectoryPath,
                                    workflowFilePath
                                ),
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
