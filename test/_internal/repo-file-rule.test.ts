import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import * as path from "node:path";

import { createRepositoryFilePresenceRule } from "../../src/_internal/repo-file-rule";
import { createRuleTester } from "./ruleTester";

const ruleTester = createRuleTester();
const moduleSource = "export const lintTarget = true;\n";
const fixtureRoot = path.join(
    tmpdir(),
    "repo-compliance-internal-rule-fixtures"
);

mkdirSync(fixtureRoot, { recursive: true });

const createFixtureRepo = (
    ruleName: string,
    variant: string,
    files: Readonly<Record<string, string>>
): string => {
    const rootDirectoryPath = path.join(fixtureRoot, `${ruleName}-${variant}`);
    mkdirSync(rootDirectoryPath, { recursive: true });

    for (const [relativePath, content] of Object.entries(files)) {
        const absolutePath = path.join(rootDirectoryPath, relativePath);
        mkdirSync(path.dirname(absolutePath), { recursive: true });
        writeFileSync(absolutePath, content, "utf8");
    }

    const lintTargetPath = path.join(rootDirectoryPath, "eslint.config.mjs");
    writeFileSync(lintTargetPath, moduleSource, "utf8");

    return lintTargetPath;
};

const directoryRule = createRepositoryFilePresenceRule({
    configReferences: ["repoPlugin.configs.github"],
    description: "require workflow directory test fixture",
    messageId: "missingFixtureWorkflow",
    messageText: "Fixture workflow is missing.",
    name: "require-fixture-workflow-directory",
    recommendation: false,
    requirement: {
        directory: ".github/workflows",
        extensions: [".yml", ".yaml"],
        kind: "directory-with-extension",
    },
});

const anyOfRule = createRepositoryFilePresenceRule({
    configReferences: ["repoPlugin.configs.strict"],
    description: "require any accepted fixture path",
    messageId: "missingFixtureAnyOf",
    messageText: "Fixture file is missing.",
    name: "require-fixture-any-of",
    recommendation: false,
    requirement: {
        kind: "any-of",
        requirements: [
            {
                kind: "file",
                path: "README.md",
            },
            {
                kind: "one-of",
                paths: ["LICENSE", "LICENSE.txt"],
            },
        ],
    },
});

ruleTester.run("require-fixture-workflow-directory", directoryRule, {
    invalid: [
        {
            code: moduleSource,
            errors: [{ messageId: "missingFixtureWorkflow" }],
            filename: createFixtureRepo(
                "require-fixture-workflow-directory",
                "invalid-file-not-directory",
                {
                    ".github/workflows": "not a directory\n",
                }
            ),
            name: "reports when the expected workflow path exists as a file instead of a directory",
        },
    ],
    valid: [
        {
            code: moduleSource,
            name: "skips evaluation for stdin-style input filenames",
        },
        {
            code: moduleSource,
            filename: path.join(fixtureRoot, "non-trigger", "src", "index.ts"),
            name: "skips evaluation for non-trigger files",
        },
        {
            code: moduleSource,
            filename: createFixtureRepo(
                "require-fixture-workflow-directory",
                "valid-yaml-extension",
                {
                    ".github/workflows/ci.yaml": "name: CI\n",
                }
            ),
            name: "accepts a workflow directory containing a .yaml file",
        },
    ],
});

ruleTester.run("require-fixture-any-of", anyOfRule, {
    invalid: [
        {
            code: moduleSource,
            errors: [{ messageId: "missingFixtureAnyOf" }],
            filename: createFixtureRepo(
                "require-fixture-any-of",
                "invalid",
                {}
            ),
            name: "reports when no any-of branch is satisfied",
        },
    ],
    valid: [
        {
            code: moduleSource,
            filename: createFixtureRepo(
                "require-fixture-any-of",
                "valid-second-branch",
                {
                    "LICENSE.txt": "MIT\n",
                }
            ),
            name: "accepts a repository when a later any-of branch is satisfied",
        },
    ],
});
