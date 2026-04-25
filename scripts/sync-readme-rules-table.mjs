/**
 * @packageDocumentation
 * Synchronize or validate the README rules matrix from canonical rule metadata.
 */
// @ts-check

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import builtPlugin from "../dist/plugin.js";
import {
    configMetadataByName,
    configNamesByReadmeOrder,
    configReferenceToName,
} from "../dist/_internal/config-references.js";

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
 * }>} ReadmeRuleModule
 */

/** @typedef {Readonly<Record<string, ReadmeRuleModule>>} ReadmeRulesMap */

/** @typedef {import("../dist/_internal/config-references.js").ConfigName} PresetName */

const presetOrder = [...configNamesByReadmeOrder];
const presetNameSet = new Set(presetOrder);

const rulesSectionHeading = "## Rules";
const PRESET_DOCS_URL_BASE =
    "https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/presets";

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

/**
 * Locate the rules section bounds within README markdown.
 *
 * @param {string} markdown
 *
 * @returns {Readonly<{ endOffset: number; startOffset: number }>}
 */
const getReadmeRulesSectionBounds = (markdown) => {
    const startOffset = markdown.indexOf(rulesSectionHeading);

    if (startOffset < 0) {
        throw new Error("README.md is missing the '## Rules' section heading.");
    }

    const nextHeadingOffset = markdown.indexOf(
        "\n## ",
        startOffset + rulesSectionHeading.length
    );

    return {
        endOffset: nextHeadingOffset < 0 ? markdown.length : nextHeadingOffset,
        startOffset,
    };
};

/**
 * Extract the README rules section without including the blank separator line
 * that belongs to the following section.
 *
 * @param {string} markdown
 *
 * @returns {string}
 */
export const extractReadmeRulesSection = (markdown) => {
    const { endOffset, startOffset } = getReadmeRulesSectionBounds(markdown);

    return markdown.slice(startOffset, endOffset);
};

/**
 * Normalize markdown table row spacing so formatter-aligned columns compare
 * equivalently to compact generated rows.
 *
 * @param {string} markdown
 *
 * @returns {string}
 */
export const normalizeRulesSectionMarkdown = (markdown) =>
    markdown
        .replaceAll("\r\n", "\n")
        .split("\n")
        .map((line) => {
            const trimmedLine = line.trimEnd();

            if (!/^\|.*\|$/v.test(trimmedLine)) {
                return trimmedLine;
            }

            const cells = trimmedLine
                .split("|")
                .slice(1, -1)
                .map((cell) => {
                    const trimmedCell = cell.trim();

                    if (!/^:?-+:?$/v.test(trimmedCell)) {
                        return trimmedCell;
                    }

                    const hasStartColon = trimmedCell.startsWith(":");
                    const hasEndColon = trimmedCell.endsWith(":");

                    if (hasStartColon && hasEndColon) {
                        return ":-:";
                    }

                    if (hasStartColon) {
                        return ":--";
                    }

                    if (hasEndColon) {
                        return "--:";
                    }

                    return "---";
                });

            return `| ${cells.join(" | ")} |`;
        })
        .join("\n")
        .trimEnd();

/** @type {Readonly<Record<PresetName, string>>} */
const presetDocsSlugByName = {
    ai: "ai",
    all: "all",
    bitbucket: "bitbucket",
    codeberg: "codeberg",
    github: "github",
    gitlab: "gitlab",
    recommended: "recommended",
    strict: "strict",
};

/** @type {Readonly<Record<PresetName, string>>} */
const presetConfigReferenceByName = {
    ai: "repo-compliance.configs.ai",
    all: "repo-compliance.configs.all",
    bitbucket: "repo-compliance.configs.bitbucket",
    codeberg: "repo-compliance.configs.codeberg",
    github: "repo-compliance.configs.github",
    gitlab: "repo-compliance.configs.gitlab",
    recommended: "repo-compliance.configs.recommended",
    strict: "repo-compliance.configs.strict",
};

/**
 * @param {PresetName} presetName
 *
 * @returns {string}
 */
const createPresetDocsUrl = (presetName) =>
    `${PRESET_DOCS_URL_BASE}/${presetDocsSlugByName[presetName]}`;

/**
 * @returns {readonly string[]}
 */
const createPresetLegendLines = () =>
    presetOrder.map((presetName) => {
        const docsUrl = createPresetDocsUrl(presetName);
        const presetIcon = configMetadataByName[presetName].icon;
        const configReference = presetConfigReferenceByName[presetName];

        return `  - [${presetIcon}](${docsUrl}) — [\`${configReference}\`](${docsUrl})`;
    });

/**
 * @param {string} reference
 *
 * @returns {null | PresetName}
 */
const normalizeRepoConfigName = (reference) => {
    if (Object.hasOwn(configReferenceToName, reference)) {
        const referenceKey = /** @type {keyof typeof configReferenceToName} */ (
            reference
        );

        return configReferenceToName[referenceKey];
    }

    const presetName = /** @type {PresetName} */ (reference);

    return presetNameSet.has(presetName) ? presetName : null;
};

/**
 * @param {readonly string[] | string | undefined} repoConfigs
 *
 * @returns {readonly PresetName[]}
 */
const normalizeRepoConfigNames = (repoConfigs) => {
    const references = Array.isArray(repoConfigs) ? repoConfigs : [repoConfigs];

    /** @type {PresetName[]} */
    const names = [];

    /** @type {Set<PresetName>} */
    const seenPresetNames = new Set();

    for (const reference of references) {
        if (typeof reference !== "string") {
            continue;
        }

        const configName = normalizeRepoConfigName(reference);

        if (configName === null) {
            continue;
        }

        if (!presetNameSet.has(configName)) {
            continue;
        }

        if (!seenPresetNames.has(configName)) {
            seenPresetNames.add(configName);
            names.push(configName);
        }
    }

    return names;
};

/**
 * @param {ReadmeRuleModule} ruleModule
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
 * @param {ReadmeRuleModule} ruleModule
 *
 * @returns {string}
 */
const getPresetIndicator = (ruleModule) => {
    const docsRepoConfigs = ruleModule.meta?.docs?.repoConfigs;
    const presetNames = normalizeRepoConfigNames(docsRepoConfigs);
    const presetNamesSet = new Set(presetNames);

    /** @type {string[]} */
    const icons = [];

    for (const presetName of presetOrder) {
        if (presetNamesSet.has(presetName)) {
            const docsUrl = createPresetDocsUrl(presetName);
            const presetIcon = configMetadataByName[presetName].icon;

            icons.push(`[${presetIcon}](${docsUrl})`);
        }
    }

    return icons.length === 0 ? "—" : icons.join(" ");
};

/**
 * @param {readonly [string, ReadmeRuleModule]} entry
 *
 * @returns {string}
 */
const toRuleTableRow = ([ruleName, ruleModule]) => {
    const docsUrl = ruleModule.meta?.docs?.url;

    if (typeof docsUrl !== "string" || docsUrl.trim().length === 0) {
        throw new TypeError(`Rule '${ruleName}' is missing meta.docs.url.`);
    }

    return `| [\`${ruleName}\`](${docsUrl}) | ${getRuleFixIndicator(ruleModule)} | ${getPresetIndicator(ruleModule)} |`;
};

/**
 * Generate the canonical README rules section from plugin rules metadata.
 *
 * @param {ReadmeRulesMap} rules - Plugin rules map.
 *
 * @returns {string} Full markdown section text starting at ## Rules.
 */
export const generateReadmeRulesSectionFromRules = (rules) => {
    const ruleEntries = Object.entries(rules).toSorted((left, right) =>
        left[0].localeCompare(right[0])
    );
    const rows = ruleEntries.map(toRuleTableRow);

    return [
        "## Rules",
        "",
        "- Fix legend:",
        "  - 🔧 = autofixable",
        "  - 💡 = suggestions available",
        "  - — = report only",
        "- Preset key legend:",
        ...createPresetLegendLines(),
        "",
        "| Rule | Fix | Preset key |",
        "| --- | :-: | :-: |",
        ...rows,
        "",
    ].join("\n");
};

/**
 * Synchronize the README rules table with canonical plugin metadata.
 *
 * @param {{ writeChanges: boolean }} input
 *
 * @returns {Promise<{ changed: boolean }>}
 */
export const syncReadmeRulesTable = async ({ writeChanges }) => {
    const workspaceRoot = resolve(fileURLToPath(import.meta.url), "../..");
    const readmePath = resolve(workspaceRoot, "README.md");
    const readmeText = await readFile(readmePath, "utf8");
    const lineEnding = detectLineEnding(readmeText);

    const { endOffset, startOffset } = getReadmeRulesSectionBounds(readmeText);
    const readmePrefix = readmeText.slice(0, startOffset).trimEnd();
    const readmeSuffix = readmeText.slice(endOffset);
    const generatedRulesSection = generateReadmeRulesSectionFromRules(
        /** @type {ReadmeRulesMap} */ (builtPlugin.rules)
    );
    const existingRulesSection = extractReadmeRulesSection(readmeText);

    if (
        normalizeRulesSectionMarkdown(existingRulesSection) ===
        normalizeRulesSectionMarkdown(generatedRulesSection)
    ) {
        return {
            changed: false,
        };
    }

    const nextReadmeText = normalizeMarkdownLineEndings(
        `${readmePrefix}\n\n${generatedRulesSection}${readmeSuffix}`,
        lineEnding
    );

    if (readmeText === nextReadmeText) {
        return {
            changed: false,
        };
    }

    if (!writeChanges) {
        return {
            changed: true,
        };
    }

    await writeFile(readmePath, nextReadmeText, "utf8");

    return {
        changed: true,
    };
};

const runCli = async () => {
    const writeChanges = process.argv.includes("--write");
    const result = await syncReadmeRulesTable({ writeChanges });

    if (!result.changed) {
        console.log("README rules table is already synchronized.");
        return;
    }

    if (writeChanges) {
        console.log("README rules table synchronized from plugin metadata.");
        return;
    }

    console.error(
        "README rules table is out of sync. Run: npm run sync:readme-rules-table:write (or npm run sync:readme-rules-table:update to refresh snapshots too)."
    );
    process.exitCode = 1;
};

if (
    typeof process.argv[1] === "string" &&
    import.meta.url === pathToFileURL(process.argv[1]).href
) {
    await runCli();
}
