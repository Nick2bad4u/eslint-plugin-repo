import * as path from "node:path";
import { setHas, stringSplit } from "ts-extras";

import {
    getGitLabCiConfigPath,
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

/**
 * Reserved top-level GitLab CI keys that are not job definitions.
 */
const GITLAB_RESERVED_KEYS = new Set([
    "after_script",
    "before_script",
    "cache",
    "default",
    "image",
    "include",
    "services",
    "stages",
    "variables",
    "workflow",
]);

type NeedsParserState = {
    currentJobName: null | string;
    hasNeeds: boolean;
};

const stripInlineComment = (line: string): string => {
    const commentIndex = line.indexOf("#");

    return commentIndex === -1
        ? line.trim()
        : line.slice(0, commentIndex).trim();
};

const getRootLevelJobName = (trimmedLine: string): null | string => {
    if (!trimmedLine.endsWith(":")) {
        return null;
    }

    const key = trimmedLine.slice(0, -1).trim();

    if (key === "" || setHas(GITLAB_RESERVED_KEYS, key)) {
        return null;
    }

    return key;
};

/**
 * Collect all root-level job names (non-reserved keys) that lack a `needs:`
 * directive. Jobs with `needs:` participate in the DAG pipeline execution
 * model, improving parallel execution efficiency.
 */
const jobsMissingNeeds = (source: string): readonly string[] => {
    const lines = stringSplit(normalizeLineEndings(source), "\n");
    const missing: string[] = [];
    const state: NeedsParserState = { currentJobName: null, hasNeeds: false };

    for (const line of lines) {
        const trimmed = line.trimStart();

        if (trimmed.length === 0 || trimmed.startsWith("#")) {
            continue;
        }

        const indent = line.length - trimmed.length;

        if (indent === 0) {
            if (state.currentJobName !== null && !state.hasNeeds) {
                missing.push(state.currentJobName);
            }

            state.currentJobName = getRootLevelJobName(trimmed);
            state.hasNeeds = false;
            continue;
        }

        if (
            state.currentJobName !== null &&
            stripInlineComment(trimmed).startsWith("needs:")
        ) {
            state.hasNeeds = true;
        }
    }

    if (state.currentJobName !== null && !state.hasNeeds) {
        missing.push(state.currentJobName);
    }

    return missing;
};

/** Rule enforcing `needs:` in all GitLab CI jobs to enable DAG execution. */
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
                const gitlabCiPath = getGitLabCiConfigPath(rootDirectoryPath);

                if (gitlabCiPath === null) {
                    return;
                }

                const source = readTextFileIfExists(gitlabCiPath);

                if (source === null) {
                    return;
                }

                const missingJobs = jobsMissingNeeds(source);

                for (const jobName of missingJobs) {
                    context.report({
                        data: {
                            configPath: path
                                .relative(rootDirectoryPath, gitlabCiPath)
                                .replaceAll(path.sep, "/"),
                            jobName,
                        },
                        messageId: "missingNeeds",
                        node,
                    });
                }
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require `needs:` in all GitLab CI jobs to enable DAG execution and improve pipeline parallelism",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.gitlab",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-gitlab-ci-needs-dag"),
        },
        messages: {
            missingNeeds:
                "{{ configPath }}: job '{{ jobName }}' is missing a `needs:` directive. Add `needs: []` (or list of dependencies) to let GitLab run this job as soon as its dependencies complete.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "require-gitlab-ci-needs-dag",
});

export default rule;
