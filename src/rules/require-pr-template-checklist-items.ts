import { existsSync, readFileSync } from "node:fs";
import * as path from "node:path";
import { setHas } from "ts-extras";

import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const triggerFileNames = new Set([
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.ts",
    "package.json",
]);

/** Known PR/MR template locations across providers. */
const PR_TEMPLATE_PATHS = [
    ".github/pull_request_template.md",
    ".github/PULL_REQUEST_TEMPLATE.md",
    ".github/pull_request_template.txt",
    ".gitlab/merge_request_templates/Default.md",
    ".gitlab/merge_request_templates/default.md",
    "docs/pull_request_template.md",
    "pull_request_template.md",
    "PULL_REQUEST_TEMPLATE.md",
];

/** Matches a markdown task-list checkbox: `- [ ] ` or `* [ ] `. */
const CHECKBOX_PATTERN = /^[*-]\s+\[\s\]/mu;

const getPRTemplatePath = (rootDirectoryPath: string): null | string => {
    for (const relativePath of PR_TEMPLATE_PATHS) {
        const absolutePath = path.join(rootDirectoryPath, relativePath);

        if (existsSync(absolutePath)) {
            return absolutePath;
        }
    }

    return null;
};

/** Rule enforcing at least one checklist item in the PR/MR template. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const lintedFilePath = context.physicalFilename;
        const lintedFileName = path.basename(lintedFilePath);

        if (!setHas(triggerFileNames, lintedFileName)) {
            return {};
        }

        const rootDirectoryPath = path.dirname(lintedFilePath);
        const templatePath = getPRTemplatePath(rootDirectoryPath);

        if (templatePath === null) {
            return {};
        }

        return {
            Program(node): void {
                const templateSource = (() => {
                    try {
                        return readFileSync(templatePath, "utf8");
                    } catch {
                        return null;
                    }
                })();

                if (
                    templateSource === null ||
                    templateSource.trim().length === 0
                ) {
                    return;
                }

                if (CHECKBOX_PATTERN.test(templateSource)) {
                    return;
                }

                context.report({
                    data: {
                        templatePath: path.relative(
                            rootDirectoryPath,
                            templatePath
                        ),
                    },
                    messageId: "missingPRTemplateChecklistItems",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            description:
                "require at least one checklist item (`- [ ]`) in the pull request / merge request template",
            frozen: false,
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            ruleId: "",
            ruleNumber: 0,
            url: createRuleDocsUrl("require-pr-template-checklist-items"),
        },
        messages: {
            missingPRTemplateChecklistItems:
                "{{ templatePath }} does not contain any checklist items (`- [ ]`). Add action items to guide reviewers and contributors through the contribution process.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "require-pr-template-checklist-items",
});

export default rule;
