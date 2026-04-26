import { existsSync, readdirSync } from "node:fs";
import * as path from "node:path";
import { arrayIncludes, setHas, stringSplit } from "ts-extras";

import { providerRuleTriggerFileNames } from "../_internal/config-file-scanner.js";
import {
    normalizeLineEndings,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const ISSUE_TEMPLATE_DIR = ".github/ISSUE_TEMPLATE";
const ignoredTemplateFileNames = ["config.yml", "config.yaml"] as const;

/**
 * Check whether a GitHub YAML issue template file contains a root-level
 * `labels:` key. GitHub issue forms are YAML documents, not Markdown files with
 * frontmatter, so this intentionally scans top-level YAML keys instead of
 * looking for `---` fences.
 */
const hasLabelsKey = (source: string): boolean => {
    const lines = stringSplit(normalizeLineEndings(source), "\n");

    for (const line of lines) {
        const trimmedLine = line.trim();
        const trimmedStartLine = line.trimStart();
        const indentation = line.length - trimmedStartLine.length;

        if (
            trimmedLine.length === 0 ||
            trimmedLine === "---" ||
            trimmedLine === "..." ||
            trimmedLine.startsWith("#") ||
            indentation > 0
        ) {
            continue;
        }

        if (trimmedStartLine.startsWith("labels:")) {
            return true;
        }
    }

    return false;
};

/** Rule enforcing `labels:` in GitHub YAML issue templates. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const lintedFilePath = context.physicalFilename;
        const lintedFileName = path.basename(lintedFilePath);

        if (!setHas(providerRuleTriggerFileNames, lintedFileName)) {
            return {};
        }

        const rootDirectoryPath = path.dirname(lintedFilePath);
        const templateDir = path.join(rootDirectoryPath, ISSUE_TEMPLATE_DIR);

        if (!existsSync(templateDir)) {
            return {};
        }

        return {
            Program(node): void {
                const entries = (() => {
                    try {
                        return readdirSync(templateDir);
                    } catch {
                        return null;
                    }
                })();

                if (entries === null) {
                    return;
                }

                for (const entry of entries) {
                    if (arrayIncludes(ignoredTemplateFileNames, entry)) {
                        continue;
                    }

                    if (!/\.ya?ml$/iu.test(entry)) {
                        continue;
                    }

                    const templatePath = path.join(templateDir, entry);
                    const templateSource = readTextFileIfExists(templatePath);

                    if (
                        templateSource === null ||
                        !hasLabelsKey(templateSource)
                    ) {
                        context.report({
                            data: {
                                templateFile: path.relative(
                                    rootDirectoryPath,
                                    templatePath
                                ),
                            },
                            messageId: "missingGitHubIssueTemplateLabels",
                            node,
                        });
                    }
                }
            },
        };
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            description:
                "require a `labels:` field in GitHub YAML issue templates to auto-label new issues",
            frozen: false,
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.github",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            ruleId: "",
            ruleNumber: 0,
            url: createRuleDocsUrl("require-github-issue-template-labels"),
        },
        messages: {
            missingGitHubIssueTemplateLabels:
                "{{ templateFile }} does not define a `labels:` field. Add a labels list to automatically categorise issues created from this template.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "require-github-issue-template-labels",
});

export default rule;
