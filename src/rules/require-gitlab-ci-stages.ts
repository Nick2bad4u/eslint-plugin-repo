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

const hasRootStagesKey = (yamlSource: string): boolean => {
    const lines = stringSplit(normalizeLineEndings(yamlSource), "\n");

    for (const line of lines) {
        if (isBlankOrCommentLine(line)) {
            continue;
        }

        if (getIndentationWidth(line) !== 0) {
            continue;
        }

        if (line.trimStart().startsWith("stages:")) {
            return true;
        }
    }

    return false;
};

/** Rule definition for requiring explicit stages in GitLab CI configuration. */
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

                if (hasRootStagesKey(gitlabCiSource)) {
                    return;
                }

                context.report({
                    messageId: "missingGitLabCiStages",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require explicit root-level `stages` in `.gitlab-ci.yml`.",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.gitlab",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-gitlab-ci-stages"),
        },
        messages: {
            missingGitLabCiStages:
                "`.gitlab-ci.yml` is missing a root-level `stages` key. Define explicit stages to make pipeline ordering and intent clear.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-gitlab-ci-stages",
});

export default rule;
