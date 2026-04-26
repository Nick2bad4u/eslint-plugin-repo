import * as path from "node:path";
import { setHas, stringSplit } from "ts-extras";

import { providerRuleTriggerFileNames } from "../_internal/config-file-scanner.js";
import {
    getRepositoryReadmePath,
    normalizeLineEndings,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

/**
 * Default required sections that a well-maintained project README should have.
 */
const defaultRequiredSections = ["Installation", "Usage"] as const;

const extractHeadings = (source: string): readonly string[] => {
    const lines = stringSplit(normalizeLineEndings(source), "\n");
    const headings: string[] = [];
    let inFencedCodeBlock = false;

    for (const line of lines) {
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith("```") || trimmedLine.startsWith("~~~")) {
            inFencedCodeBlock = !inFencedCodeBlock;
            continue;
        }

        if (inFencedCodeBlock) {
            continue;
        }

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

        if (!setHas(providerRuleTriggerFileNames, lintedFileName)) {
            return {};
        }

        const rootDirectoryPath = path.dirname(lintedFilePath);
        const readmePath = getRepositoryReadmePath(rootDirectoryPath);

        if (readmePath === null) {
            return {};
        }

        const requiredSections = defaultRequiredSections;

        return {
            Program(node): void {
                const readmeSource = readTextFileIfExists(readmePath);

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
