import { readFileSync } from "node:fs";
import * as path from "node:path";
import { arrayJoin, isEmpty, setHas, stringSplit } from "ts-extras";

import {
    getIndentationWidth,
    isBlankOrCommentLine,
} from "../_internal/config-file-scanner.js";
import {
    getForgejoWorkflowPaths,
    normalizeLineEndings,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const triggerFileNames = new Set([
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.ts",
]);

const findJobsSectionStart = (lines: readonly string[]): null | number => {
    for (const [lineIndex, line] of lines.entries()) {
        if (isBlankOrCommentLine(line)) {
            continue;
        }

        if (line.trim() === "jobs:") {
            return lineIndex;
        }
    }

    return null;
};

type JobBlock = Readonly<{
    lines: readonly string[];
    name: string;
}>;

const isJobsSectionTerminator = (line: string, jobsIndent: number): boolean =>
    getIndentationWidth(line) <= jobsIndent;

const tryGetJobHeaderName = (line: string): null | string => {
    const indent = getIndentationWidth(line);
    const trimmed = line.trimStart();

    if (indent !== 2 || trimmed.startsWith("- ") || !trimmed.endsWith(":")) {
        return null;
    }

    return trimmed.slice(0, -1).trim();
};

const collectJobBlocks = (lines: readonly string[]): readonly JobBlock[] => {
    const jobsStartIndex = findJobsSectionStart(lines);

    if (jobsStartIndex === null) {
        return [];
    }

    const jobsIndent = getIndentationWidth(lines[jobsStartIndex] ?? "");
    const jobHeaders: Readonly<{ index: number; name: string }>[] = [];

    for (const [offset, line] of lines.slice(jobsStartIndex + 1).entries()) {
        if (isBlankOrCommentLine(line)) {
            continue;
        }

        if (isJobsSectionTerminator(line, jobsIndent)) {
            break;
        }

        const jobName = tryGetJobHeaderName(line);

        if (jobName !== null) {
            jobHeaders.push({
                index: jobsStartIndex + 1 + offset,
                name: jobName,
            });
        }
    }

    return jobHeaders.map(({ index, name }, headerIndex) => {
        const nextHeader = jobHeaders[headerIndex + 1];
        const endIndex = nextHeader?.index ?? lines.length;

        return {
            lines: lines.slice(index + 1, endIndex),
            name,
        };
    });
};

const hasTimeoutMinutes = (jobBlock: JobBlock): boolean =>
    jobBlock.lines.some(
        (line) =>
            !isBlankOrCommentLine(line) &&
            line.trimStart().startsWith("timeout-minutes:")
    );

const isReusableWorkflowJob = (jobBlock: JobBlock): boolean =>
    jobBlock.lines.some(
        (line) =>
            !isBlankOrCommentLine(line) && line.trimStart().startsWith("uses:")
    );

const collectMissingTimeoutJobs = (
    workflowSource: string
): readonly string[] => {
    const lines = stringSplit(normalizeLineEndings(workflowSource), "\n");
    const blocks = collectJobBlocks(lines);

    if (isEmpty(blocks)) {
        return [];
    }

    const missing: string[] = [];

    for (const block of blocks) {
        if (isReusableWorkflowJob(block)) {
            continue;
        }

        if (!hasTimeoutMinutes(block)) {
            missing.push(block.name);
        }
    }

    return missing;
};

/**
 * Rule definition for requiring explicit `timeout-minutes` on Forgejo Actions
 * jobs.
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

                const issues: string[] = [];

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

                    const missingJobs =
                        collectMissingTimeoutJobs(workflowSource);

                    if (isEmpty(missingJobs)) {
                        continue;
                    }

                    const relativePath = path
                        .relative(rootDirectoryPath, workflowPath)
                        .replaceAll(path.sep, "/");
                    issues.push(
                        `${relativePath} -> ${arrayJoin(missingJobs, ", ")}`
                    );
                }

                if (isEmpty(issues)) {
                    return;
                }

                context.report({
                    data: {
                        workflowJobs: arrayJoin(issues, "; "),
                    },
                    messageId: "missingJobTimeoutMinutes",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require explicit `timeout-minutes` for Forgejo workflow jobs to prevent runaway workflow execution.",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.codeberg",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl(
                "require-forgejo-actions-job-timeout-minutes"
            ),
        },
        messages: {
            missingJobTimeoutMinutes:
                "Forgejo workflow jobs are missing `timeout-minutes`: {{workflowJobs}}. Add explicit timeouts to fail fast and prevent long-running stuck jobs.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-forgejo-actions-job-timeout-minutes",
});

export default rule;
