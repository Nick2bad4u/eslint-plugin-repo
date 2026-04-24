import { readdirSync } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { ruleDocsByName } from "../src/plugin";

const repositoryRootPath = path.resolve(
    fileURLToPath(new URL("..", import.meta.url))
);
const rulesSourceDirectoryPath = path.join(repositoryRootPath, "src", "rules");
const rulesDocsDirectoryPath = path.join(repositoryRootPath, "docs", "rules");

const getBasenames = (directoryPath: string, extension: string): Set<string> =>
    new Set(
        readdirSync(directoryPath)
            .filter((fileName) => fileName.endsWith(extension))
            .map((fileName) => fileName.slice(0, -extension.length))
    );

describe("rule docs completeness", () => {
    it("has a docs page for every require-* rule source", () => {
        expect.hasAssertions();

        const sourceRuleNames = getBasenames(rulesSourceDirectoryPath, ".ts");
        const docsRuleNames = getBasenames(rulesDocsDirectoryPath, ".md");

        const requireRuleNames = new Set(
            [...sourceRuleNames].filter((ruleName) =>
                ruleName.startsWith("require-")
            )
        );

        const missingDocRuleNames = [...requireRuleNames].filter(
            (ruleName) => !docsRuleNames.has(ruleName)
        );

        expect(missingDocRuleNames).toStrictEqual([]);

        expect(
            new Set(
                [...docsRuleNames].filter((name) => name.startsWith("require-"))
            )
        ).toStrictEqual(requireRuleNames);
    });

    it("keeps runtime rule docs metadata aligned with docs files", () => {
        expect.hasAssertions();

        const docsRuleNames = new Set(
            [...getBasenames(rulesDocsDirectoryPath, ".md")].filter(
                (ruleName) => ruleName.startsWith("require-")
            )
        );

        expect(new Set(Object.keys(ruleDocsByName))).toStrictEqual(
            docsRuleNames
        );
    });
});
