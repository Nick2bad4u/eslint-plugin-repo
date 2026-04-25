import { existsSync, readFileSync } from "node:fs";
import * as path from "node:path";
import { setHas, stringSplit } from "ts-extras";

import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const triggerFileNames = new Set([
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.ts",
    "package.json",
]);

const README_PATHS = [
    "README.md",
    "README",
    "README.txt",
];

/**
 * Default required sections that a well-maintained project README should have.
 */
const defaultRequiredSections = ["Installation", "Usage"] as const;

const getReadmePath = (rootDirectoryPath: string): null | string => {
    for (const relativePath of README_PATHS) {
        const absolutePath = path.join(rootDirectoryPath, relativePath);

        if (existsSync(absolutePath)) {
            return absolutePath;
        }
    }

    return null;
};

const normalizeLineEndings = (source: string): string =>
    source.replaceAll(/\r\n?/gv, "\n");

const extractHeadings = (source: string): readonly string[] => {
    const lines = stringSplit(normalizeLineEndings(source), "\n");
    const headings: string[] = [];

    for (const line of lines) {
        const trimmedLine = line.trim();

        if (!trimmedLine.startsWith("#")) {
            continue;
        }

        const headingText = trimmedLine.replace(/^#{1,6}\s*/u, "").trim();

        if (headingText.length > 0) {
            headings.push(headingText);
        }
    }

    return headings;
};

const findMissingSections = (
    headings: readonly string[],
    requiredSections: readonly string[]
): readonly string[] => {
    const lowerHeadings = headings.map((h) => h.toLowerCase());

    return requiredSections.filter(
        (section) =>
            !lowerHeadings.some((h) => h.includes(section.toLowerCase()))
    );
};

/** Rule enforcing required sections in the README. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const lintedFilePath = context.physicalFilename;
        const lintedFileName = path.basename(lintedFilePath);

        if (!setHas(triggerFileNames, lintedFileName)) {
            return {};
        }

        const rootDirectoryPath = path.dirname(lintedFilePath);
        const readmePath = getReadmePath(rootDirectoryPath);

        if (readmePath === null) {
            return {};
        }

        const requiredSections = defaultRequiredSections;

        return {
            Program(node): void {
                const readmeSource = (() => {
                    try {
                        return readFileSync(readmePath, "utf8");
                    } catch {
                        return null;
                    }
                })();

                if (readmeSource === null || readmeSource.trim().length === 0) {
                    return;
                }

                const headings = extractHeadings(readmeSource);
                const missingSections = findMissingSections(
                    headings,
                    requiredSections
                );

                for (const section of missingSections) {
                    context.report({
                        data: {
                            readmePath: path.relative(
                                rootDirectoryPath,
                                readmePath
                            ),
                            section,
                        },
                        messageId: "missingReadmeSection",
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
                "require installation and usage sections (headings) in the README file",
            frozen: false,
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            ruleId: "",
            ruleNumber: 0,
            url: createRuleDocsUrl("require-readme-sections"),
        },
        messages: {
            missingReadmeSection:
                "{{ readmePath }} is missing a '{{ section }}' section. Add a ## {{ section }} heading to improve documentation coverage.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "require-readme-sections",
});

export default rule;
