import { arrayIncludes, stringSplit } from "ts-extras";

import { normalizeLineEndings } from "./repository-text-files.js";

const stripInlineComment = (line: string): string => {
    const commentIndex = line.indexOf("#");

    return commentIndex === -1
        ? line.trim()
        : line.slice(0, commentIndex).trim();
};

const normalizeInlineEventNames = (inlineEvents: string): readonly string[] =>
    stringSplit(inlineEvents, ",")
        .flatMap((segment) => stringSplit(segment, " "))
        .map((segment) => segment.trim())
        .filter((segment) => segment.length > 0);

const normalizeNestedEventName = (line: string): string =>
    line
        .replace(/^-/u, "")
        .replace(/:$/u, "")
        .trim()
        .replaceAll('"', "")
        .replaceAll("'", "");

const hasNestedOnEvent = (
    lines: readonly string[],
    startIndex: number,
    onIndent: number,
    targetEventName: string
): boolean => {
    for (const nestedLine of lines.slice(startIndex)) {
        const trimmedNestedLine = stripInlineComment(nestedLine);

        if (trimmedNestedLine.length === 0) {
            continue;
        }

        const nestedIndent = nestedLine.length - nestedLine.trimStart().length;

        if (nestedIndent <= onIndent) {
            break;
        }

        if (normalizeNestedEventName(trimmedNestedLine) === targetEventName) {
            return true;
        }
    }

    return false;
};

/**
 * Returns `true` when the requested event is declared inside the top-level
 * `on:` block of a workflow source, including inline and nested YAML forms.
 */
export const hasWorkflowOnEvent = (
    source: string,
    targetEventName: string
): boolean => {
    const lines = stringSplit(normalizeLineEndings(source), "\n");

    for (const [index, line] of lines.entries()) {
        const trimmedLine = stripInlineComment(line);

        if (!trimmedLine.startsWith("on:")) {
            continue;
        }

        const inlineEvents = trimmedLine
            .slice("on:".length)
            .replaceAll("[", " ")
            .replaceAll("]", " ")
            .replaceAll("{", " ")
            .replaceAll("}", " ")
            .replaceAll('"', " ")
            .replaceAll("'", " ");

        const normalizedInlineEvents = normalizeInlineEventNames(inlineEvents);

        if (arrayIncludes(normalizedInlineEvents, targetEventName)) {
            return true;
        }

        const onIndent = line.length - line.trimStart().length;

        if (hasNestedOnEvent(lines, index + 1, onIndent, targetEventName)) {
            return true;
        }
    }

    return false;
};
