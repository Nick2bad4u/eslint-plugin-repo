import { existsSync, readdirSync, readFileSync } from "node:fs";
import * as path from "node:path";
import { arrayIncludes, setHas, stringSplit } from "ts-extras";

import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const triggerFileNames = new Set([
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.ts",
    "package.json",
]);

const ISSUE_TEMPLATE_DIR = ".github/ISSUE_TEMPLATE";
const ignoredTemplateFileNames = ["config.yml", "config.yaml"] as const;

/**
 * Check whether a YAML issue template file contains a `labels:` key in its YAML
 * frontmatter.
 */
const hasLabelsKey = (source: string): boolean => {
    const lines = stringSplit(source.replaceAll(/\r\n?/gv, "\n"), "\n");

    let inFrontmatter = false;

    for (const line of lines) {
        const trimmed = line.trim();

        if (!inFrontmatter) {
            if (trimmed === "---") {
                inFrontmatter = true;
            }

            continue;
        }

        if (trimmed === "---") {
            break;
        }

        if (/^labels\s*:/u.test(trimmed)) {
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

        if (!setHas(triggerFileNames, lintedFileName)) {
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
                    const templateSource = (() => {
                        try {
                            return readFileSync(templatePath, "utf8");
                        } catch {
                            return null;
                        }
                    })();

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
                            messageId: "missingIssueTemplateLabels",
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
            url: createRuleDocsUrl("require-issue-template-labels"),
        },
        messages: {
            missingIssueTemplateLabels:
                "{{ templateFile }} does not define a `labels:` field. Add a labels list to automatically categorise issues created from this template.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "require-issue-template-labels",
});

export default rule;
