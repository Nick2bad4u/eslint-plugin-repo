import { existsSync, readFileSync } from "node:fs";
import * as path from "node:path";
import { arrayFirst, isEmpty, setHas, stringSplit } from "ts-extras";

import { normalizeLineEndings } from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const triggerFileNames = new Set([
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.ts",
    "package.json",
]);

const CODEOWNERS_PATHS = [
    "CODEOWNERS",
    ".github/CODEOWNERS",
    ".gitlab/CODEOWNERS",
    "docs/CODEOWNERS",
];

const getCODEOWNERSPath = (rootDirectoryPath: string): null | string => {
    for (const relativePath of CODEOWNERS_PATHS) {
        const absolutePath = path.join(rootDirectoryPath, relativePath);

        if (existsSync(absolutePath)) {
            return absolutePath;
        }
    }

    return null;
};

type PatternIssue = Readonly<{
    lineNumber: number;
    pattern: string;
    reason: string;
}>;

const analyzeCodeownersPatterns = (source: string): readonly PatternIssue[] => {
    const lines = stringSplit(normalizeLineEndings(source), "\n");
    const issues: PatternIssue[] = [];

    for (const [lineIndex, rawLine] of lines.entries()) {
        const line = rawLine.trim();

        if (line.length === 0 || line.startsWith("#")) {
            continue;
        }

        const parts = stringSplit(line.replaceAll("\t", " "), " ").filter(
            (part) => part.length > 0
        );
        const pattern = arrayFirst(parts) ?? "";
        const owners = parts.slice(1);

        if (pattern === "") {
            continue;
        }

        if (isEmpty(owners)) {
            issues.push({
                lineNumber: lineIndex + 1,
                pattern,
                reason: "Pattern has no owners assigned.",
            });
        }
    }

    return issues;
};

/** Rule enforcing reviewable patterns in CODEOWNERS. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const lintedFilePath = context.physicalFilename;
        const lintedFileName = path.basename(lintedFilePath);

        if (!setHas(triggerFileNames, lintedFileName)) {
            return {};
        }

        const rootDirectoryPath = path.dirname(lintedFilePath);
        const codeownersPath = getCODEOWNERSPath(rootDirectoryPath);

        if (codeownersPath === null) {
            return {};
        }

        return {
            Program(node): void {
                const codeownersSource = (() => {
                    try {
                        return readFileSync(codeownersPath, "utf8");
                    } catch {
                        return null;
                    }
                })();

                if (
                    codeownersSource === null ||
                    codeownersSource.trim().length === 0
                ) {
                    return;
                }

                const issues = analyzeCodeownersPatterns(codeownersSource);

                for (const issue of issues) {
                    context.report({
                        data: {
                            codeownersPath: path.relative(
                                rootDirectoryPath,
                                codeownersPath
                            ),
                            lineNumber: String(issue.lineNumber),
                            pattern: issue.pattern,
                            reason: issue.reason,
                        },
                        messageId: "unownedPattern",
                        node,
                    });
                }
            },
        };
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            description:
                "require all CODEOWNERS patterns to have at least one owner assigned",
            frozen: false,
            recommended: true,
            repoConfigs: [
                "repoPlugin.configs.recommended",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.github",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            ruleId: "",
            ruleNumber: 0,
            url: createRuleDocsUrl("require-codeowners-reviewable-patterns"),
        },
        messages: {
            unownedPattern:
                "{{ codeownersPath }} line {{ lineNumber }}: pattern '{{ pattern }}' has no owners. {{ reason }}",
        },
        schema: [],
        type: "problem",
    },
    name: "require-codeowners-reviewable-patterns",
});

export default rule;
