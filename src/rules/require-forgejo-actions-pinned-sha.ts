import { existsSync, readdirSync } from "node:fs";
import * as path from "node:path";
import { arrayJoin, isEmpty, setHas, stringSplit } from "ts-extras";

import { providerRuleTriggerFileNames } from "../_internal/config-file-scanner.js";
import {
    normalizeLineEndings,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const workflowExtensions = new Set([".yaml", ".yml"]);

const isCommentLine = (line: string): boolean =>
    line.trimStart().startsWith("#");

const isFullCommitSha = (value: string): boolean => {
    if (value.length !== 40) {
        return false;
    }

    for (const character of value) {
        const isDigit = character >= "0" && character <= "9";
        const isLowerHex = character >= "a" && character <= "f";
        const isUpperHex = character >= "A" && character <= "F";

        if (!isDigit && !isLowerHex && !isUpperHex) {
            return false;
        }
    }

    return true;
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

const getUsesTargetFromLine = (line: string): null | string => {
    const trimmedLine = line.trimStart();

    if (trimmedLine.startsWith("- uses:")) {
        return trimmedLine.slice("- uses:".length).trim();
    }

    if (trimmedLine.startsWith("uses:")) {
        return trimmedLine.slice("uses:".length).trim();
    }

    return null;
};

const normalizeQuotedScalar = (value: string): string => {
    const trimmed = value.trim();

    if (
        (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
        return trimmed.slice(1, -1);
    }

    return trimmed;
};

const stripInlineYamlComment = (value: string): string => {
    const commentIndex = value.indexOf("#");

    if (commentIndex === -1) {
        return value.trim();
    }

    return value.slice(0, commentIndex).trim();
};

const isPinnedUsesTarget = (usesTarget: string): boolean => {
    const normalizedTarget = stripInlineYamlComment(
        normalizeQuotedScalar(usesTarget)
    );

    if (
        normalizedTarget.startsWith("./") ||
        normalizedTarget.startsWith("docker://")
    ) {
        return true;
    }

    const atSignIndex = normalizedTarget.lastIndexOf("@");

    if (atSignIndex === -1) {
        return false;
    }

    const reference = normalizedTarget.slice(atSignIndex + 1);

    return isFullCommitSha(reference);
};

const collectUnpinnedUsesEntries = (
    workflowSource: string
): readonly string[] => {
    const lines = stringSplit(normalizeLineEndings(workflowSource), "\n");
    const unpinnedEntries: string[] = [];

    for (const line of lines) {
        if (isCommentLine(line)) {
            continue;
        }

        const usesTarget = getUsesTargetFromLine(line);

        if (usesTarget === null) {
            continue;
        }

        if (!isPinnedUsesTarget(usesTarget)) {
            unpinnedEntries.push(normalizeQuotedScalar(usesTarget));
        }
    }

    return unpinnedEntries;
};

/**
 * Rule definition for enforcing full-length commit SHA pinning in Forgejo
 * workflow `uses:` references.
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
                    collectForgejoWorkflowFiles(rootDirectoryPath);

                if (isEmpty(workflowPaths)) {
                    return;
                }

                const issues: string[] = [];

                for (const workflowPath of workflowPaths) {
                    const workflowSource = readTextFileIfExists(workflowPath);

                    if (workflowSource === null) {
                        continue;
                    }

                    const unpinnedEntries =
                        collectUnpinnedUsesEntries(workflowSource);

                    if (isEmpty(unpinnedEntries)) {
                        continue;
                    }

                    const relativePath = path
                        .relative(rootDirectoryPath, workflowPath)
                        .replaceAll(path.sep, "/");
                    issues.push(
                        `${relativePath} -> ${arrayJoin(unpinnedEntries, ", ")}`
                    );
                }

                if (isEmpty(issues)) {
                    return;
                }

                context.report({
                    data: {
                        workflowEntries: arrayJoin(issues, "; "),
                    },
                    messageId: "unpinnedForgejoActionsUses",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require Forgejo workflow `uses:` references to pin third-party actions/workflows to full commit SHAs.",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.codeberg",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-forgejo-actions-pinned-sha"),
        },
        messages: {
            unpinnedForgejoActionsUses:
                "Forgejo workflow `uses:` entries are not pinned to full commit SHAs: {{workflowEntries}}. Pin third-party actions/workflows to immutable 40-character SHAs.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-forgejo-actions-pinned-sha",
});

export default rule;
