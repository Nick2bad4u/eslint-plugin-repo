import * as path from "node:path";
import { setHas } from "ts-extras";

import {
    getRepositoryReadmePath,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const triggerFileNames = new Set([
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.ts",
    "package.json",
]);

/** Detects markdown image syntax used for badges: `![alt](url)` */
const BADGE_PATTERN = /!\[.*?\]\(https?:\/\//iu;

/** Rule enforcing presence of at least one badge in the README. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const lintedFilePath = context.physicalFilename;
        const lintedFileName = path.basename(lintedFilePath);

        if (!setHas(triggerFileNames, lintedFileName)) {
            return {};
        }

        const rootDirectoryPath = path.dirname(lintedFilePath);
        const readmePath = getRepositoryReadmePath(rootDirectoryPath);

        if (readmePath === null) {
            return {};
        }

        return {
            Program(node): void {
                const readmeSource = readTextFileIfExists(readmePath);

                if (readmeSource === null || readmeSource.trim().length === 0) {
                    return;
                }

                if (BADGE_PATTERN.test(readmeSource)) {
                    return;
                }

                context.report({
                    data: {
                        readmePath: path.relative(
                            rootDirectoryPath,
                            readmePath
                        ),
                    },
                    messageId: "missingReadmeBadges",
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
                "require at least one status badge (build, coverage, etc.) in the README file",
            frozen: false,
            recommended: false,
            repoConfigs: ["repoPlugin.configs.all"],
            requiresTypeChecking: false,
            ruleId: "",
            ruleNumber: 0,
            url: createRuleDocsUrl("require-readme-badges"),
        },
        messages: {
            missingReadmeBadges:
                "{{ readmePath }} does not contain any badges. Add at least one status badge (e.g. build status, coverage, npm version) to give visitors a quick quality signal.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "require-readme-badges",
});

export default rule;
