/**
 * @packageDocumentation
 * Synchronize or validate presets documentation tables from canonical rule metadata.
 */
// @ts-check

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import builtPlugin from "../dist/plugin.js";
import { generateReadmeRulesSectionFromRules } from "./sync-readme-rules-table.mjs";

/**
 * @typedef {Readonly<{
 *     meta?: {
 *         docs?: {
 *             repoConfigs?: readonly string[] | string;
 *             url?: string;
 *         };
 *         fixable?: string;
 *         hasSuggestions?: boolean;
 *     };
 * }>} RuleModule
 */

/** @typedef {Readonly<Record<string, RuleModule>>} RulesMap */

/**
 * @typedef {"ai"
 *     | "all"
 *     | "bitbucket"
 *     | "codeberg"
 *     | "github"
 *     | "gitlab"
 *     | "recommended"
 *     | "strict"} PresetConfigName
 */

const matrixSectionHeading = "## Rule matrix";
const presetRulesSectionHeading = "## Rules in this preset";
const presetsDocsDirectoryPath = "docs/rules/presets";

/**
 * @param {string} markdown
 *
 * @returns {"\n" | "\r\n"}
 */
const detectLineEnding = (markdown) =>
    markdown.includes("\r\n") ? "\r\n" : "\n";

/**
 * @param {string} markdown
 * @param {"\n" | "\r\n"} lineEnding
 *
 * @returns {string}
 */
const normalizeMarkdownLineEndings = (markdown, lineEnding) =>
    markdown.replaceAll(/\r?\n/gv, lineEnding);

/** @type {Readonly<Record<PresetConfigName, string>>} */
const presetDocSlugByConfigName = {
    ai: "ai",
    all: "all",
    bitbucket: "bitbucket",
    codeberg: "codeberg",
    github: "github",
    gitlab: "gitlab",
    recommended: "recommended",
    strict: "strict",
};

/** @type {readonly PresetConfigName[]} */
const standardPresetConfigNames = [
    "ai",
    "all",
    "recommended",
    "strict",
    "github",
    "gitlab",
    "codeberg",
    "bitbucket",
];

/**
 * @param {unknown} value
 *
 * @returns {value is Readonly<Record<string, unknown>>}
 */
const isUnknownRecord = (value) =>
    typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * @param {readonly string[]} values
 *
 * @returns {readonly string[]}
 */
const sortStrings = (values) =>
    [...values].toSorted((left, right) => left.localeCompare(right));

/**
 * @param {string} configRuleKey
 *
 * @returns {null | string}
 */
const toPluginRuleName = (configRuleKey) => {
    if (!configRuleKey.startsWith("repo-compliance/")) {
        return null;
    }

    return configRuleKey.slice("repo-compliance/".length);
};

/**
 * @param {PresetConfigName} presetConfigName
 *
 * @returns {readonly string[]}
 */
const collectPresetRuleNames = (presetConfigName) => {
    const presetConfig = builtPlugin.configs[presetConfigName];

    if (!isUnknownRecord(presetConfig)) {
        throw new TypeError(
            `Missing preset config '${presetConfigName}' in built plugin.`
        );
    }

    const rules = presetConfig["rules"];

    if (!isUnknownRecord(rules)) {
        return [];
    }

    const names = Object.keys(rules)
        .map(toPluginRuleName)
        .filter((name) => typeof name === "string");

    return sortStrings(names);
};

/**
 * @param {RuleModule} ruleModule
 *
 * @returns {"—" | "💡" | "🔧" | "🔧 💡"}
 */
const getRuleFixIndicator = (ruleModule) => {
    const fixable = ruleModule.meta?.fixable === "code";
    const hasSuggestions = ruleModule.meta?.hasSuggestions === true;

    if (fixable && hasSuggestions) {
        return "🔧 💡";
    }

    if (fixable) {
        return "🔧";
    }

    if (hasSuggestions) {
        return "💡";
    }

    return "—";
};

/**
 * @param {string} ruleName
 *
 * @returns {RuleModule}
 */
const getRuleModuleByName = (ruleName) => {
    const candidate = builtPlugin.rules[ruleName];

    if (!isUnknownRecord(candidate)) {
        throw new TypeError(`Rule '${ruleName}' is missing from built plugin.`);
    }

    return /** @type {RuleModule} */ (candidate);
};

/**
 * @param {string} ruleName
 *
 * @returns {string}
 */
const toPresetRuleTableRow = (ruleName) => {
    const ruleModule = getRuleModuleByName(ruleName);
    const docsUrl = ruleModule.meta?.docs?.url;

    if (typeof docsUrl !== "string" || docsUrl.trim().length === 0) {
        throw new TypeError(`Rule '${ruleName}' is missing meta.docs.url.`);
    }

    const fixIndicator = getRuleFixIndicator(ruleModule);

    return `| [\`${ruleName}\`](${docsUrl}) | ${fixIndicator} |`;
};

/**
 * @param {readonly string[]} ruleNames
 *
 * @returns {string}
 */
const createPresetRulesTable = (ruleNames) => {
    if (ruleNames.length === 0) {
        return [
            "| Rule | Fix |",
            "| --- | :-: |",
            "| — | — |",
        ].join("\n");
    }

    const rows = ruleNames.map(toPresetRuleTableRow);

    return [
        "| Rule | Fix |",
        "| --- | :-: |",
        ...rows,
    ].join("\n");
};

/**
 * @param {PresetConfigName} presetConfigName
 *
 * @returns {string}
 */
const generatePresetRulesSection = (presetConfigName) => {
    const ruleNames = collectPresetRuleNames(presetConfigName);

    return [
        presetRulesSectionHeading,
        "",
        "- `Fix` legend:",
        "  - `🔧` = autofixable",
        "  - `💡` = suggestions available",
        "  - `—` = report only",
        "",
        createPresetRulesTable(ruleNames),
        "",
    ].join("\n");
};

/**
 * @param {string} markdown
 * @param {string} heading
 * @param {string} replacement
 *
 * @returns {string}
 */
const replaceSection = (markdown, heading, replacement) => {
    const startOffset = markdown.indexOf(heading);

    if (startOffset < 0) {
        return `${markdown.trimEnd()}\n\n${replacement}`;
    }

    const nextHeadingOffset = markdown.indexOf(
        "\n## ",
        startOffset + heading.length
    );
    const endOffset =
        nextHeadingOffset < 0 ? markdown.length : nextHeadingOffset;

    return `${markdown.slice(0, startOffset)}${replacement}${markdown.slice(endOffset)}`;
};

/**
 * @param {string} markdown
 * @param {string} heading
 *
 * @returns {string}
 */
const removeSection = (markdown, heading) => {
    const startOffset = markdown.indexOf(heading);

    if (startOffset < 0) {
        return markdown;
    }

    const nextHeadingOffset = markdown.indexOf(
        "\n## ",
        startOffset + heading.length
    );
    const endOffset =
        nextHeadingOffset < 0 ? markdown.length : nextHeadingOffset;

    return `${markdown.slice(0, startOffset).trimEnd()}${markdown.slice(endOffset)}`;
};

/**
 * @param {PresetConfigName} presetConfigName
 * @param {boolean} writeChanges
 *
 * @returns {Promise<boolean>}
 */
const syncPresetDoc = async (presetConfigName, writeChanges) => {
    const presetDocSlug = presetDocSlugByConfigName[presetConfigName];
    const workspaceRoot = resolve(fileURLToPath(import.meta.url), "../..");
    const presetDocPath = resolve(
        workspaceRoot,
        presetsDocsDirectoryPath,
        `${presetDocSlug}.md`
    );
    const currentMarkdown = await readFile(presetDocPath, "utf8");
    const lineEnding = detectLineEnding(currentMarkdown);
    const generatedRulesSection = generatePresetRulesSection(presetConfigName);

    const rulesSectionMarkdown = normalizeMarkdownLineEndings(
        generatedRulesSection,
        lineEnding
    );

    const markdownWithRulesSection = replaceSection(
        currentMarkdown,
        presetRulesSectionHeading,
        rulesSectionMarkdown
    );

    if (markdownWithRulesSection === currentMarkdown) {
        return false;
    }

    if (!writeChanges) {
        return true;
    }

    await writeFile(presetDocPath, markdownWithRulesSection, "utf8");

    return true;
};

/**
 * @param {{ writeChanges: boolean }} input
 *
 * @returns {Promise<{ changed: boolean }>}
 */
export const syncPresetsRulesMatrix = async ({ writeChanges }) => {
    const workspaceRoot = resolve(fileURLToPath(import.meta.url), "../..");
    const indexPath = resolve(
        workspaceRoot,
        presetsDocsDirectoryPath,
        "index.md"
    );
    const currentIndexMarkdown = await readFile(indexPath, "utf8");
    const lineEnding = detectLineEnding(currentIndexMarkdown);
    const generatedRulesSection = generateReadmeRulesSectionFromRules(
        /** @type {RulesMap} */ (builtPlugin.rules)
    ).replace(/^## Rules$/mv, matrixSectionHeading);

    const indexWithRulesSection = replaceSection(
        currentIndexMarkdown,
        matrixSectionHeading,
        normalizeMarkdownLineEndings(generatedRulesSection, lineEnding)
    );

    const changedPresetDocs = await Promise.all(
        standardPresetConfigNames.map((presetName) =>
            syncPresetDoc(presetName, writeChanges)
        )
    );

    const changedIndex = indexWithRulesSection !== currentIndexMarkdown;
    const changed = changedIndex || changedPresetDocs.some(Boolean);

    if (!changed) {
        return {
            changed: false,
        };
    }

    if (!writeChanges) {
        return {
            changed: true,
        };
    }

    await writeFile(indexPath, indexWithRulesSection, "utf8");

    return {
        changed: true,
    };
};

const runCli = async () => {
    const writeChanges = process.argv.includes("--write");
    const result = await syncPresetsRulesMatrix({ writeChanges });

    if (!result.changed) {
        console.log("Preset docs matrix is already synchronized.");
        return;
    }

    if (writeChanges) {
        console.log("Preset docs matrix synchronized from plugin metadata.");
        return;
    }

    console.error(
        "Preset docs matrix is out of sync. Run: npm run sync:presets-rules-matrix:write"
    );
    process.exitCode = 1;
};

if (
    typeof process.argv[1] === "string" &&
    import.meta.url === pathToFileURL(process.argv[1]).href
) {
    await runCli();
}

export {
    collectPresetRuleNames,
    createPresetRulesTable,
    generatePresetRulesSection,
    replaceSection,
    removeSection,
};
