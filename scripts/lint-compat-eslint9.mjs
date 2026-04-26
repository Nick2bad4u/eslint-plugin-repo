import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";
import * as path from "node:path";

const requireFromScript = createRequire(import.meta.url);

/**
 * @param {readonly string[]} argv
 *
 * @returns {null | number}
 */
const parseExpectedMajor = (argv) => {
    const direct = argv.find((arg) => arg.startsWith("--expect-eslint-major="));

    if (typeof direct === "string") {
        const value = Number.parseInt(direct.split("=")[1] ?? "", 10);
        return Number.isFinite(value) ? value : null;
    }

    const flagIndex = argv.indexOf("--expect-eslint-major");

    if (flagIndex === -1) {
        return null;
    }

    const value = Number.parseInt(argv[flagIndex + 1] ?? "", 10);
    return Number.isFinite(value) ? value : null;
};

/**
 * @param {null | number} expectedMajor
 *
 * @returns {void}
 */
const assertExpectedEslintMajor = (expectedMajor) => {
    if (typeof expectedMajor !== "number") {
        return;
    }

    const eslintPackage = requireFromScript("eslint/package.json");
    const eslintVersion = String(eslintPackage.version ?? "");
    const actualMajor = Number.parseInt(eslintVersion.split(".")[0] ?? "", 10);

    if (!Number.isFinite(actualMajor) || actualMajor !== expectedMajor) {
        throw new Error(
            `Expected ESLint major ${expectedMajor}, found ${eslintVersion || "unknown"}`
        );
    }

    console.log(`[compat] ESLint version check passed: ${eslintVersion}`);
};

/**
 * @returns {Promise<import("../dist/plugin").default>}
 */
const loadPlugin = async () => {
    try {
        const module = await import("../dist/plugin.js");
        return module.default;
    } catch {
        throw new Error(
            "Unable to import dist/plugin.js. Run `npm run build` before running ESLint 9 compatibility checks."
        );
    }
};

/**
 * @typedef SmokeCaseInput
 *
 * @property {number} expectedErrorCount Exact number of lint errors expected
 *   for the smoke case.
 * @property {string} fixtureName Stable case identifier used in temp-directory
 *   names and log output.
 * @property {boolean} includeReadme Whether a README fixture file should be
 *   written before linting.
 * @property {any} plugin The built plugin object loaded from `dist/plugin.js`.
 */

/**
 * @param {SmokeCaseInput} input
 *
 * @returns {Promise<void>}
 */
const runReadmeRuleSmokeCase = async ({
    expectedErrorCount,
    fixtureName,
    includeReadme,
    plugin,
}) => {
    const { ESLint } = await import("eslint");

    const repoRoot = mkdtempSync(
        path.join(tmpdir(), `eslint9-compat-${fixtureName}-`)
    );

    try {
        if (includeReadme) {
            writeFileSync(
                path.join(repoRoot, "README.md"),
                "# fixture\n",
                "utf8"
            );
        }

        const lintTargetPath = path.join(repoRoot, "eslint.config.js");
        const lintTargetSource = "export default [];\n";

        writeFileSync(lintTargetPath, lintTargetSource, "utf8");

        const eslint = new ESLint({
            cwd: repoRoot,
            overrideConfig: [
                {
                    files: [
                        "**/*.js",
                        "**/*.mjs",
                        "**/*.cjs",
                    ],
                    plugins: {
                        "repo-compliance": plugin,
                    },
                    rules: {
                        "repo-compliance/require-readme-file": "error",
                    },
                },
            ],
            overrideConfigFile: true,
        });

        const [result] = await eslint.lintText(lintTargetSource, {
            filePath: lintTargetPath,
        });

        const actualErrorCount = result?.errorCount ?? 0;

        if (actualErrorCount !== expectedErrorCount) {
            const details = (result?.messages ?? [])
                .map(
                    (message) =>
                        `${message.ruleId ?? "<unknown>"}: ${message.message}`
                )
                .join("\n");

            throw new Error(
                `Smoke case '${fixtureName}' expected ${expectedErrorCount} error(s), got ${actualErrorCount}.\n${details}`
            );
        }

        console.log(
            `[compat] Case '${fixtureName}' passed (errors=${actualErrorCount}).`
        );
    } finally {
        rmSync(repoRoot, { force: true, recursive: true });
    }
};

const main = async () => {
    const expectedMajor = parseExpectedMajor(process.argv.slice(2));

    assertExpectedEslintMajor(expectedMajor);

    const plugin = await loadPlugin();

    await runReadmeRuleSmokeCase({
        expectedErrorCount: 0,
        fixtureName: "readme-present",
        includeReadme: true,
        plugin,
    });

    await runReadmeRuleSmokeCase({
        expectedErrorCount: 1,
        fixtureName: "readme-missing",
        includeReadme: false,
        plugin,
    });

    console.log("[compat] ESLint compatibility smoke checks passed.");
};

await main();
