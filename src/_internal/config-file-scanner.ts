/**
 * Shared line-scanning helpers used by provider-config rules.
 *
 * These utilities handle the common pattern of scanning YAML and TOML config
 * files line-by-line without a full parser, which is appropriate because:
 *
 * - ESLint rules need to analyse files that are _not_ the currently-linted
 *   JavaScript/TypeScript file (e.g. `amplify.yml`, `netlify.toml`).
 * - A full parse tree is not required — we only need to check for specific keys
 *   and simple scalar values at well-defined structural positions.
 * - Line-scanning is deliberately simple and fast; full YAML/TOML parsing would
 *   require additional runtime dependencies and adds little value for these
 *   targeted checks.
 *
 * @packageDocumentation
 */

import { stringSplit } from "ts-extras";

import { normalizeLineEndings } from "./repository-text-files.js";

// ---------------------------------------------------------------------------
// Trigger file names
// ---------------------------------------------------------------------------

/**
 * The set of ESLint config filenames that trigger provider-config rules.
 *
 * Provider rules scan config files from the repository root, so they must be
 * triggered by one of the ESLint config files (where users configure the
 * plugin) or `package.json` (a common alternative plugin-config entry point).
 */
export const providerRuleTriggerFileNames: ReadonlySet<string> = new Set([
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.ts",
    "package.json",
]);

// ---------------------------------------------------------------------------
// Generic line utilities
// ---------------------------------------------------------------------------

/**
 * Splits any line-delimited config file source into individual lines.
 *
 * Normalises Windows-style CRLF line endings before splitting so the result is
 * consistent regardless of the operating system that created the file.
 */
export const splitConfigLines = (source: string): readonly string[] =>
    stringSplit(normalizeLineEndings(source), "\n");

/**
 * Returns `true` when the line should be skipped during structural parsing:
 * blank lines and comment lines (whose first non-whitespace character is `#`).
 *
 * Applies to both YAML and TOML config files.
 */
export const isBlankOrCommentLine = (line: string): boolean => {
    const trimmed = line.trim();
    return trimmed.length === 0 || trimmed.startsWith("#");
};

/**
 * Returns the number of leading space characters (indentation depth) in `line`.
 *
 * Tabs are not counted; the provider-config formats targeted here exclusively
 * use spaces for indentation.
 */
export const getIndentationWidth = (line: string): number => {
    let width = 0;

    for (const character of line) {
        if (character !== " ") {
            break;
        }

        width += 1;
    }

    return width;
};

/**
 * Strips any trailing inline comment from a YAML line and returns the trimmed
 * content before the first `#` character.
 *
 * When no `#` is present the entire trimmed line is returned. This helper is
 * used by rules that scan for specific keys or values without a full YAML
 * parser.
 */
export const stripInlineComment = (line: string): string => {
    const commentIndex = line.indexOf("#");

    return commentIndex === -1
        ? line.trim()
        : line.slice(0, commentIndex).trim();
};

// ---------------------------------------------------------------------------
// YAML helpers
// ---------------------------------------------------------------------------

/**
 * Finds the scalar value of a root-level YAML mapping key (`key: value`).
 *
 * Only matches lines at indentation level 0 that are not blank or comments.
 * Strips surrounding single/double quotes from the returned value so callers
 * receive a normalised string regardless of whether the YAML author quoted it.
 *
 * Returns `null` when the key is absent. Returns an empty string when the key
 * is present but has no value (`key:`).
 */
export const getTopLevelYamlKeyValue = (
    yamlSource: string,
    key: string
): null | string => {
    const prefix = `${key}:`;

    const matchingLine = splitConfigLines(yamlSource).find((line) => {
        if (isBlankOrCommentLine(line)) {
            return false;
        }

        const trimmed = line.trim();
        return !line.startsWith(" ") && trimmed.startsWith(prefix);
    });

    if (typeof matchingLine !== "string") {
        return null;
    }

    return matchingLine
        .slice(matchingLine.indexOf(":") + 1)
        .trim()
        .replaceAll(/["']/gv, "");
};

/**
 * Returns `true` when a root-level YAML mapping key is present in the source.
 *
 * The key must appear at indentation level 0 on a non-blank, non-comment line.
 * A key with an empty value (`key:`) is still considered present.
 */
export const hasTopLevelYamlKey = (
    yamlSource: string,
    key: string
): boolean => {
    const prefix = `${key}:`;

    return splitConfigLines(yamlSource).some((line) => {
        if (isBlankOrCommentLine(line)) {
            return false;
        }

        const trimmed = line.trim();
        return !line.startsWith(" ") && trimmed.startsWith(prefix);
    });
};

// ---------------------------------------------------------------------------
// TOML helpers
// ---------------------------------------------------------------------------

/**
 * Returns `true` when `trimmedLine` is a TOML assignment for `key`.
 *
 * Matches `key = value`, `key=value`, and variants with arbitrary whitespace
 * around the `=`. The value must contain at least one non-whitespace
 * character.
 *
 * Uses string operations instead of a constructed `RegExp` so that no escaping
 * of special regex characters in `key` is needed.
 */
const isTomlAssignmentForKey = (trimmedLine: string, key: string): boolean => {
    if (!trimmedLine.startsWith(key)) {
        return false;
    }

    // The character immediately following the key must be `=` or whitespace
    // (to avoid matching `keyExtra = value` when looking for `key`).
    const afterKey = trimmedLine.slice(key.length);
    const afterKeyTrimmed = afterKey.trimStart();

    if (!afterKeyTrimmed.startsWith("=")) {
        return false;
    }

    // Ensure a non-whitespace value exists after the `=`.
    return afterKeyTrimmed.slice(1).trimStart().length > 0;
};

/**
 * Finds the value of a TOML scalar assignment (`key = value`).
 *
 * Matches non-blank, non-comment lines where the key appears at any indentation
 * level (TOML values may be inside table sections).
 *
 * Returns `null` when the key is absent or when the value is empty /
 * whitespace-only. Strips surrounding single/double quotes from the returned
 * value.
 */
export const getTomlKeyValue = (
    tomlSource: string,
    key: string
): null | string => {
    const matchingLine = splitConfigLines(tomlSource).find((line) => {
        if (isBlankOrCommentLine(line)) {
            return false;
        }

        return isTomlAssignmentForKey(line.trim(), key);
    });

    if (typeof matchingLine !== "string") {
        return null;
    }

    return matchingLine
        .slice(matchingLine.indexOf("=") + 1)
        .trim()
        .replaceAll(/["']/gv, "");
};

/**
 * Returns `true` when a TOML assignment for `key` exists with a non-empty
 * value.
 *
 * `false` is returned if the key is absent or if the assignment's value is
 * empty or whitespace-only.
 */
export const hasTomlKey = (tomlSource: string, key: string): boolean =>
    getTomlKeyValue(tomlSource, key) !== null;

/**
 * Returns `true` when a TOML table header (`[sectionName]`) exists in the
 * source.
 */
export const hasTomlTableSection = (
    tomlSource: string,
    sectionName: string
): boolean => {
    const header = `[${sectionName}]`;

    return splitConfigLines(tomlSource).some((line) => {
        if (isBlankOrCommentLine(line)) {
            return false;
        }

        return line.trim() === header;
    });
};
