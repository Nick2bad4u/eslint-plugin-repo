#!/usr/bin/env node

import { execFileSync, spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_ARGUMENT_CHARACTERS = 12_000;
const BASELINE_PATH = ".secrets.baseline";
const currentDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(currentDirectory, "..");

/**
 * Keep each process invocation safely below Windows' command-line limit.
 *
 * @param {readonly string[]} paths
 *
 * @returns {string[][]}
 */
function chunkPaths(paths) {
    /** @type {string[][]} */
    const chunks = [];
    /** @type {string[]} */
    let currentChunk = [];
    let currentLength = 0;

    for (const path of paths) {
        const argumentLength = path.length + 3;

        if (
            currentChunk.length > 0 &&
            currentLength + argumentLength > MAX_ARGUMENT_CHARACTERS
        ) {
            chunks.push(currentChunk);
            currentChunk = [];
            currentLength = 0;
        }

        currentChunk.push(path);
        currentLength += argumentLength;
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }

    return chunks;
}

const trackedFiles = execFileSync("git", ["ls-files", "-z"], {
    cwd: repositoryRoot,
    encoding: "utf8",
})
    .split("\0")
    .filter((path) => path.length > 0 && path !== BASELINE_PATH);

for (const paths of chunkPaths(trackedFiles)) {
    const result = spawnSync(
        "detect-secrets-hook",
        [
            "--baseline",
            BASELINE_PATH,
            "--json",
            "--cores",
            "1",
            ...paths,
        ],
        {
            cwd: repositoryRoot,
            encoding: "utf8",
        }
    );

    if (result.error !== undefined) {
        throw result.error;
    }

    if (result.status !== 0) {
        if (result.stdout.length > 0) {
            console.error(result.stdout.trimEnd());
        }
        if (result.stderr.length > 0) {
            console.error(result.stderr.trimEnd());
        }
        process.exit(result.status ?? 1);
    }
}

console.log(
    `detect-secrets passed for ${trackedFiles.length.toLocaleString()} tracked files.`
);
