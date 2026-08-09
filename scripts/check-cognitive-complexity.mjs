#!/usr/bin/env node

import { getFolderOutput } from "cognitive-complexity-ts";

import baseline from "./cognitive-complexity-baseline.json" with { type: "json" };

const SOURCE_DIRECTORY = "src";

/**
 * @type {Readonly<{
 *     threshold: number;
 *     exceptions: Readonly<Record<string, number>>;
 * }>}
 */
const cognitiveComplexityBaseline = baseline;

/** @type {string[]} */
const findings = [];
/** @type {Set<string>} */
const matchedExceptionKeys = new Set();
let functionCount = 0;

/**
 * @param {import("cognitive-complexity-ts").ContainerOutput} container
 * @param {string} filePath
 */
const visitContainer = (container, filePath) => {
    if (container.kind === "function") {
        functionCount += 1;

        if (container.score > cognitiveComplexityBaseline.threshold) {
            const name = container.name || `<anonymous@${container.line}>`;
            const exceptionKey = `${filePath}::${name}`;
            const allowedScore =
                cognitiveComplexityBaseline.exceptions[exceptionKey];

            if (allowedScore === undefined) {
                findings.push(
                    `${exceptionKey} has score ${container.score}; no baseline exception exists.`
                );
            } else {
                matchedExceptionKeys.add(exceptionKey);
                if (container.score > allowedScore) {
                    findings.push(
                        `${exceptionKey} increased from ${allowedScore} to ${container.score}.`
                    );
                }
            }
        }
    }

    for (const nestedContainer of container.inner ?? []) {
        visitContainer(nestedContainer, filePath);
    }
};

/**
 * @param {import("cognitive-complexity-ts").FileOutput
 *     | import("cognitive-complexity-ts").FolderOutput} output
 * @param {string[]} pathSegments
 */
const visitOutput = (output, pathSegments = []) => {
    if (
        output !== null &&
        typeof output === "object" &&
        output.kind === "file" &&
        Array.isArray(output.inner)
    ) {
        const filePath = pathSegments.join("/");
        for (const container of output.inner) {
            visitContainer(container, filePath);
        }
        return;
    }

    if (output === null || typeof output !== "object") {
        return;
    }

    for (const [name, nestedOutput] of Object.entries(output)) {
        visitOutput(nestedOutput, [...pathSegments, name]);
    }
};

visitOutput(await getFolderOutput(SOURCE_DIRECTORY), [SOURCE_DIRECTORY]);

for (const exceptionKey of Object.keys(
    cognitiveComplexityBaseline.exceptions
)) {
    if (!matchedExceptionKeys.has(exceptionKey)) {
        findings.push(
            `${exceptionKey} no longer exceeds ${cognitiveComplexityBaseline.threshold}; remove its stale baseline exception.`
        );
    }
}

if (findings.length > 0) {
    console.error(
        `Cognitive complexity validation failed (${findings.length} finding${findings.length === 1 ? "" : "s"}):`
    );
    for (const finding of findings) {
        console.error(`- ${finding}`);
    }
    process.exitCode = 1;
} else {
    console.log(
        `Cognitive complexity passed for ${functionCount} functions at threshold ${cognitiveComplexityBaseline.threshold}; ` +
            `${matchedExceptionKeys.size} explicit legacy exceptions did not regress.`
    );
}
