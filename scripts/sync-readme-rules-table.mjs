/**
 * @packageDocumentation
 * Synchronize or validate the README rules matrix from canonical rule metadata.
 */
// @ts-nocheck

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import builtPlugin from "../dist/plugin.js";
import {
    configMetadataByName,
    configNamesByReadmeOrder,
    configReferenceToName,
} from "../src/_internal/config-references.js";

const rulesSectionHeading = "## Rules";

/** @typedef {import("../src/_internal/config-references.js").ConfigName} PresetName */

/**
 * @typedef {Readonly<{
 *     meta?: {
 *         docs?: {
 *             repoConfigs?: readonly string[] | string;
 *             url?: string;
 *             description?: string;
 *         };
 *         fixable?: string;
 *         hasSuggestions?: boolean;
 *     };
 * }>} ReadmeRuleModule
 */

const presetOrder = [...configNamesByReadmeOrder];
const presetNameSet = new Set(presetOrder);

const normalizeRulesSectionMarkdown = (markdown) =>
    markdown
        .replaceAll("\r\n", "\n")
        .split("\n")
        .map((line) => line.trimEnd())
        .join("\n")
        .trim();

const extractReadmeRulesSection = (markdown) => {
    const startOffset = markdown.indexOf(rulesSectionHeading);

    if (startOffset < 0) {
        throw new Error("README.md is missing the '## Rules' section heading.");
    }

    const nextHeadingOffset = markdown.indexOf(
        "\n## ",
        startOffset + rulesSectionHeading.length
    );

    return markdown.slice(
        startOffset,
        nextHeadingOffset < 0 ? markdown.length : nextHeadingOffset
    );
};

const normalizeRepoConfigName = (reference) => {
    if (Object.hasOwn(configReferenceToName, reference)) {
        return configReferenceToName[
            /** @type {keyof typeof configReferenceToName} */ (reference)
        ];
    }

    return presetNameSet.has(/** @type {PresetName} */ (reference))
        ? /** @type {PresetName} */ (reference)
        : null;
};

const normalizeRepoConfigNames = (repoConfigs) => {
    const references = Array.isArray(repoConfigs) ? repoConfigs : [repoConfigs];

    /** @type {PresetName[]} */
    const names = [];

    for (const reference of references) {
        if (typeof reference !== "string") {
            continue;
        }

        const normalized = normalizeRepoConfigName(reference);

        if (normalized !== null && !names.includes(normalized)) {
            names.push(normalized);
        }
    }

    return names;
};

const getFixIndicator = (ruleModule) => {
    const fixable = ruleModule.meta?.fixable === "code";
    const suggestions = ruleModule.meta?.hasSuggestions === true;

    if (fixable && suggestions) return "🔧 💡";
    if (fixable) return "🔧";
    if (suggestions) return "💡";
    return "—";
};

const createRuleRow = (ruleName, ruleModule) => {
    const docsUrl = ruleModule.meta?.docs?.url ?? "#";
    const description = ruleModule.meta?.docs?.description ?? "—";
    const presetNames = normalizeRepoConfigNames(
        ruleModule.meta?.docs?.repoConfigs
    );

    const presetCells = presetOrder
        .map((presetName) => {
            if (!presetNames.includes(presetName)) {
                return "—";
            }

            const icon = configMetadataByName[presetName].icon;
            return `${icon} ✅`;
        })
        .join(" | ");

    return `| [\`${ruleName}\`](${docsUrl}) | ${description} | ${presetCells} | ${getFixIndicator(ruleModule)} |`;
};

/**
 * @param {Readonly<Record<string, ReadmeRuleModule>>} rules
 */
const generateReadmeRulesSectionFromRules = (rules) => {
    const header = [
        rulesSectionHeading,
        "",
        "| Rule | Description | " +
            presetOrder
                .map((presetName) => configMetadataByName[presetName].icon)
                .join(" | ") +
            " | Fix |",
        "| --- | --- | " +
            presetOrder.map(() => ":-:").join(" | ") +
            " | :-: |",
    ];

    const rows = Object.entries(rules)
        .toSorted(([left], [right]) => left.localeCompare(right))
        .map(([ruleName, ruleModule]) => createRuleRow(ruleName, ruleModule));

    return [
        ...header,
        ...rows,
        "",
    ].join("\n");
};

const syncReadmeRulesTable = async ({ writeChanges }) => {
    const readmePath = resolve(
        fileURLToPath(new URL("../README.md", import.meta.url))
    );
    const readme = await readFile(readmePath, "utf8");
    const currentSection = extractReadmeRulesSection(readme);
    const generatedSection = generateReadmeRulesSectionFromRules(
        /** @type {Readonly<Record<string, ReadmeRuleModule>>} */ (
            builtPlugin.rules
        )
    );

    if (
        normalizeRulesSectionMarkdown(currentSection) ===
        normalizeRulesSectionMarkdown(generatedSection)
    ) {
        return { changed: false };
    }

    if (!writeChanges) {
        throw new Error(
            "README rules section is out of date. Run npm run sync:readme-rules-table"
        );
    }

    const updatedReadme = readme.replace(currentSection, generatedSection);
    await writeFile(readmePath, updatedReadme, "utf8");

    return { changed: true };
};

if (import.meta.url === new URL(process.argv[1], "file:///").href) {
    const writeChanges = process.argv.includes("--write");
    await syncReadmeRulesTable({ writeChanges });
}

export {
    extractReadmeRulesSection,
    generateReadmeRulesSectionFromRules,
    normalizeRulesSectionMarkdown,
    syncReadmeRulesTable,
};
