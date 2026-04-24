import { existsSync, readFileSync } from "node:fs";
import * as path from "node:path";
import { setHas, stringSplit } from "ts-extras";

import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const triggerFileNames = new Set([
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.ts",
]);

const gitlabCiPaths = [".gitlab-ci.yml", ".gitlab-ci.yaml"] as const;

const normalizeLineEndings = (source: string): string =>
    source.replaceAll("\r\n", "\n");

const isCommentLine = (line: string): boolean =>
    line.trimStart().startsWith("#");

const getGitLabCiPath = (rootDirectoryPath: string): null | string => {
    for (const relativePath of gitlabCiPaths) {
        const absolutePath = path.join(rootDirectoryPath, relativePath);

        if (existsSync(absolutePath)) {
            return absolutePath;
        }
    }

    return null;
};

/**
 * Returns true if the CI config explicitly supports merge-request pipelines via
 * `merge_request_event` rules or `merge_requests`-based only clauses.
 */
const hasMergeRequestPipelineConfig = (yamlSource: string): boolean => {
    const lines = stringSplit(normalizeLineEndings(yamlSource), "\n");

    for (const line of lines) {
        if (isCommentLine(line)) {
            continue;
        }

        const trimmed = line.trimStart();

        if (trimmed.includes("merge_request_event")) {
            return true;
        }

        if (
            trimmed === "- merge_requests" ||
            trimmed.includes("[merge_requests]") ||
            trimmed.includes(" merge_requests,") ||
            trimmed.endsWith(" merge_requests")
        ) {
            return true;
        }
    }

    return false;
};

/**
 * Rule definition for requiring merge-request pipeline coverage in GitLab CI.
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
                const gitlabCiPath = getGitLabCiPath(rootDirectoryPath);

                if (gitlabCiPath === null) {
                    return;
                }

                const gitlabCiSource = (() => {
                    try {
                        return readFileSync(gitlabCiPath, "utf8");
                    } catch {
                        return null;
                    }
                })();

                if (gitlabCiSource === null) {
                    return;
                }

                if (hasMergeRequestPipelineConfig(gitlabCiSource)) {
                    return;
                }

                context.report({
                    messageId: "missingGitLabMergeRequestPipelineConfig",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require explicit merge-request pipeline configuration in `.gitlab-ci.yml`.",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.gitlab",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-gitlab-ci-merge-request-pipelines"),
        },
        messages: {
            missingGitLabMergeRequestPipelineConfig:
                "`.gitlab-ci.yml` is missing explicit merge-request pipeline configuration. Add `rules`/`workflow: rules` with `merge_request_event` (or `only: [merge_requests]`) so merge requests consistently run CI.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-gitlab-ci-merge-request-pipelines",
});

export default rule;
