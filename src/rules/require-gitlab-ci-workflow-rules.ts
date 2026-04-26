import * as path from "node:path";
import { setHas, stringSplit } from "ts-extras";

import {
    getIndentationWidth,
    isBlankOrCommentLine,
    providerRuleTriggerFileNames,
} from "../_internal/config-file-scanner.js";
import {
    getGitLabCiConfigPath,
    normalizeLineEndings,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const findRootWorkflowHeader = (lines: readonly string[]): null | number => {
    for (const [lineIndex, line] of lines.entries()) {
        if (isBlankOrCommentLine(line)) {
            continue;
        }

        if (getIndentationWidth(line) !== 0) {
            continue;
        }

        if (line.trim() === "workflow:") {
            return lineIndex;
        }
    }

    return null;
};

const hasWorkflowRules = (yamlSource: string): boolean => {
    const lines = stringSplit(normalizeLineEndings(yamlSource), "\n");
    const workflowHeaderIndex = findRootWorkflowHeader(lines);

    if (workflowHeaderIndex === null) {
        return false;
    }

    for (const line of lines.slice(workflowHeaderIndex + 1)) {
        if (isBlankOrCommentLine(line)) {
            continue;
        }

        if (getIndentationWidth(line) === 0) {
            break;
        }

        if (line.trimStart().startsWith("rules:")) {
            return true;
        }
    }

    return false;
};

/** Rule definition for requiring explicit `workflow: rules` in GitLab CI. */
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
                const gitlabCiPath = getGitLabCiConfigPath(rootDirectoryPath);

                if (gitlabCiPath === null) {
                    return;
                }

                const gitlabCiSource = readTextFileIfExists(gitlabCiPath);

                if (gitlabCiSource === null) {
                    return;
                }

                if (hasWorkflowRules(gitlabCiSource)) {
                    return;
                }

                context.report({
                    messageId: "missingGitLabWorkflowRules",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require root-level `workflow: rules` in `.gitlab-ci.yml` to explicitly control pipeline creation.",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.gitlab",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-gitlab-ci-workflow-rules"),
        },
        messages: {
            missingGitLabWorkflowRules:
                "`.gitlab-ci.yml` is missing root-level `workflow: rules`. Define workflow rules explicitly to control pipeline creation and avoid unintended duplicate pipelines.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-gitlab-ci-workflow-rules",
});

export default rule;
