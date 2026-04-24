/**
 * @packageDocumentation
 * Synchronize or validate preset matrix/rule tables from canonical plugin metadata.
 */
// @ts-nocheck

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import builtPlugin from "../dist/plugin.js";

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
 * }>} PresetsRuleModule
 */

/**
 * @typedef {"all"
 *     | "bitbucket"
 *     | "codeberg"
 *     | "github"
 *     | "gitlab"
 *     | "recommended"
 *     | "strict"} PresetConfigName
 */

const matrixSectionHeading = "## Rule matrix";
const presetRulesSectionHeading = "## Rules in this preset";

/** @type {readonly PresetConfigName[]} */
const presetNames = [
    "recommended",
    "strict",
    "github",
    "gitlab",
    "codeberg",
    "bitbucket",
    "all",
];

/** @type {Readonly<Record<PresetConfigName, string>>} */
const presetDocSlugByConfigName = {
    all: "all",
    bitbucket: "bitbucket",
    codeberg: "codeberg",
    github: "github",
    gitlab: "gitlab",
    recommended: "recommended",
    strict: "strict",
};

const detectLineEnding = (markdown) =>
    markdown.includes("\r\n") ? "\r\n" : "\n";

const normalizeMarkdownLineEndings = (markdown, lineEnding) =>
    markdown.replaceAll(/\r?\n/gv, lineEnding);

const isUnknownRecord = (value) =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const toPluginRuleName = (configRuleKey) => {
    if (!configRuleKey.startsWith("repo-compliance/")) {
        return null;
    }

    return configRuleKey.slice("repo-compliance/".length);
};

const sortStrings = (values) =>
    [...values].toSorted((left, right) => left.localeCompare(right));

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

    return sortStrings(
        Object.keys(rules)
            .map(toPluginRuleName)
            .filter((value) => typeof value === "string")
    );
};

const getRuleModuleByName = (ruleName) => {
    const candidate = builtPlugin.rules[ruleName];

    if (!isUnknownRecord(candidate)) {
        throw new TypeError(`Rule '${ruleName}' is missing from built plugin.`);
    }

    return /** @type {PresetsRuleModule} */ (candidate);
};

const getRuleFixIndicator = (ruleModule) => {
    const fixable = ruleModule.meta?.fixable === "code";
    const hasSuggestions = ruleModule.meta?.hasSuggestions === true;

    if (fixable && hasSuggestions) return "🔧 💡";
    if (fixable) return "🔧";
    if (hasSuggestions) return "💡";

    return "—";
};

const createPresetRulesTable = (ruleNames) => {
    if (ruleNames.length === 0) {
        return [
            "| Rule | Fix |",
            "| --- | :-: |",
            "| — | — |",
        ].join("\n");
    }

    const rows = ruleNames.map((ruleName) => {
        const ruleModule = getRuleModuleByName(ruleName);
        const docsUrl = ruleModule.meta?.docs?.url ?? "#";

        return `| [\`${ruleName}\`](${docsUrl}) | ${getRuleFixIndicator(ruleModule)} |`;
    });

    return [
        "| Rule | Fix |",
        "| --- | :-: |",
        ...rows,
    ].join("\n");
};

const generatePresetRulesSection = (presetConfigName) => {
    const presetRuleNames = collectPresetRuleNames(presetConfigName);

    return [
        presetRulesSectionHeading,
        "",
        "- `Fix` legend:",
        "  - `🔧` = autofixable",
        "  - `💡` = suggestions available",
        "  - `—` = report only",
        "",
        createPresetRulesTable(presetRuleNames),
        "",
    ].join("\n");
};

const generatePresetsRulesMatrixSectionFromRules = (rules) => {
    const normalizedRules =
        /** @type {Readonly<Record<string, PresetsRuleModule>>} */ (rules);
    const allRuleNames = sortStrings(Object.keys(normalizedRules));

    const matrixHeader = [
        matrixSectionHeading,
        "",
        "| Rule | " + presetNames.join(" | ") + " |",
        "| --- | " + presetNames.map(() => ":-:").join(" | ") + " |",
    ];

    const matrixRows = allRuleNames.map((ruleName) => {
        const docs = normalizedRules[ruleName]?.meta?.docs;
        const references = Array.isArray(docs?.repoConfigs)
            ? docs?.repoConfigs
            : [docs?.repoConfigs];

        const referenceSet = new Set(
            references.filter((reference) => typeof reference === "string")
        );

        const cells = presetNames.map((presetName) =>
            referenceSet.has(`repo-compliance.configs.${presetName}`)
                ? "✅"
                : "—"
        );

        const docsUrl = docs?.url ?? "#";

        return `| [\`${ruleName}\`](${docsUrl}) | ${cells.join(" | ")} |`;
    });

    return [
        ...matrixHeader,
        ...matrixRows,
        "",
    ].join("\n");
};

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

const syncPresetDoc = async (presetConfigName, writeChanges) => {
    const docsFilePath = resolve(
        fileURLToPath(
            new URL(
                `../docs/rules/presets/${presetDocSlugByConfigName[presetConfigName]}.md`,
                import.meta.url
            )
        )
    );

    const currentMarkdown = await readFile(docsFilePath, "utf8");
    const lineEnding = detectLineEnding(currentMarkdown);
    const generatedSection = normalizeMarkdownLineEndings(
        generatePresetRulesSection(presetConfigName),
        lineEnding
    );
    const updatedMarkdown = replaceSection(
        currentMarkdown,
        presetRulesSectionHeading,
        generatedSection
    );

    if (updatedMarkdown === currentMarkdown) {
        return false;
    }

    if (!writeChanges) {
        throw new Error(
            `Preset doc '${presetConfigName}' is out of date. Run npm run sync:presets-rules-matrix`
        );
    }

    await writeFile(docsFilePath, updatedMarkdown, "utf8");

    return true;
};

const syncPresetsRulesMatrix = async ({ writeChanges }) => {
    const indexPath = resolve(
        fileURLToPath(
            new URL("../docs/rules/presets/index.md", import.meta.url)
        )
    );
    const indexMarkdown = await readFile(indexPath, "utf8");
    const lineEnding = detectLineEnding(indexMarkdown);
    const generatedMatrixSection = normalizeMarkdownLineEndings(
        generatePresetsRulesMatrixSectionFromRules(
            /** @type {Readonly<Record<string, PresetsRuleModule>>} */ (
                builtPlugin.rules
            )
        ),
        lineEnding
    );

    const updatedIndexMarkdown = replaceSection(
        indexMarkdown,
        matrixSectionHeading,
        generatedMatrixSection
    );

    const changedPresetDocs = await Promise.all(
        presetNames.map((presetName) => syncPresetDoc(presetName, writeChanges))
    );

    const indexChanged = updatedIndexMarkdown !== indexMarkdown;

    if (indexChanged) {
        if (!writeChanges) {
            throw new Error(
                "Preset matrix index is out of date. Run npm run sync:presets-rules-matrix"
            );
        }

        await writeFile(indexPath, updatedIndexMarkdown, "utf8");
    }

    return {
        changed: indexChanged || changedPresetDocs.some(Boolean),
    };
};

if (import.meta.url === new URL(process.argv[1], "file:///").href) {
    const writeChanges = process.argv.includes("--write");
    await syncPresetsRulesMatrix({ writeChanges });
}

export { generatePresetsRulesMatrixSectionFromRules, syncPresetsRulesMatrix };
