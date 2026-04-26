import { readFileSync } from "node:fs";
import * as path from "node:path";
import { setHas, stringSplit } from "ts-extras";

import {
    getIndentationWidth,
    isBlankOrCommentLine,
} from "../_internal/config-file-scanner.js";
import {
    getGitLabCiConfigPath,
    normalizeLineEndings,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const triggerFileNames = new Set([
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.ts",
]);

const findRootDefaultHeader = (lines: readonly string[]): null | number => {
    for (const [lineIndex, line] of lines.entries()) {
        if (isBlankOrCommentLine(line)) {
            continue;
        }

        if (getIndentationWidth(line) !== 0) {
            continue;
        }

        if (line.trim() === "default:") {
            return lineIndex;
        }
    }

    return null;
};

const hasDefaultTimeout = (yamlSource: string): boolean => {
    const lines = stringSplit(normalizeLineEndings(yamlSource), "\n");
    const defaultHeaderIndex = findRootDefaultHeader(lines);

    if (defaultHeaderIndex === null) {
        return false;
    }

    for (const line of lines.slice(defaultHeaderIndex + 1)) {
        if (isBlankOrCommentLine(line)) {
            continue;
        }

        if (getIndentationWidth(line) === 0) {
            break;
        }

        if (line.trimStart().startsWith("timeout:")) {
            return true;
        }
    }

    return false;
};

/** Rule definition for requiring a GitLab CI `default.timeout` baseline. */
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
                const gitlabCiPath = getGitLabCiConfigPath(rootDirectoryPath);

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

                if (hasDefaultTimeout(gitlabCiSource)) {
                    return;
                }

                context.report({
                    messageId: "missingGitLabDefaultTimeout",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require `default.timeout` in GitLab CI to define a baseline job timeout across the pipeline.",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.gitlab",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-gitlab-ci-default-timeout"),
        },
        messages: {
            missingGitLabDefaultTimeout:
                "`.gitlab-ci.yml` is missing `default.timeout`. Set a baseline timeout to prevent unbounded or unexpectedly long-running jobs.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-gitlab-ci-default-timeout",
});

export default rule;
