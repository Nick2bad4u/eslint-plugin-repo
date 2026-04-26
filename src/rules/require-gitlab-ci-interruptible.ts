import * as path from "node:path";
import { setHas, stringSplit } from "ts-extras";

import { stripInlineComment } from "../_internal/config-file-scanner.js";
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

type ParserState = {
    currentJobName: null | string;
    hasInterruptible: boolean;
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
 * Collect all root-level job names (non-reserved keys) from the source and
 * return which ones are missing `interruptible: true`.
 */
const jobsMissingInterruptible = (source: string): readonly string[] => {
    const lines = stringSplit(normalizeLineEndings(source), "\n");
    const missing: string[] = [];
    const state: ParserState = {
        currentJobName: null,
        hasInterruptible: false,
    };

    for (const line of lines) {
        const trimmed = line.trimStart();

        if (trimmed.length === 0 || trimmed.startsWith("#")) {
            continue;
        }

        const indent = line.length - trimmed.length;

        if (indent === 0) {
            if (state.currentJobName !== null && !state.hasInterruptible) {
                missing.push(state.currentJobName);
            }

            state.currentJobName = getRootLevelJobName(trimmed);
            state.hasInterruptible = false;
            continue;
        }

        if (
            state.currentJobName !== null &&
            stripInlineComment(trimmed) === "interruptible: true"
        ) {
            state.hasInterruptible = true;
        }
    }

    if (state.currentJobName !== null && !state.hasInterruptible) {
        missing.push(state.currentJobName);
    }

    return missing;
};

/** Rule enforcing `interruptible: true` on all GitLab CI jobs. */
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

                const missingJobs = jobsMissingInterruptible(source);

                for (const jobName of missingJobs) {
                    context.report({
                        data: {
                            configPath: path
                                .relative(rootDirectoryPath, gitlabCiPath)
                                .replaceAll(path.sep, "/"),
                            jobName,
                        },
                        messageId: "missingInterruptible",
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
                "require `interruptible: true` on all GitLab CI jobs so that newer commits cancel stale pipeline runs",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.gitlab",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-gitlab-ci-interruptible"),
        },
        messages: {
            missingInterruptible:
                "{{ configPath }}: job '{{ jobName }}' is missing `interruptible: true`. Add it so that a newer pipeline can cancel this one, saving CI minutes.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "require-gitlab-ci-interruptible",
});

export default rule;
