import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import * as path from "node:path";

export type FileFixture = Readonly<{
    content: string;
    relativePath: string;
}>;

const fixtureRoot = path.join(
    tmpdir(),
    "repo-compliance-provider-config-rules"
);

mkdirSync(fixtureRoot, { recursive: true });

export const lintTargetSource = "export const lintTarget = true;\n";

export const writeFixtureRepo = (
    ruleName: string,
    variant: string,
    files: readonly FileFixture[],
    lintTargetRelativePath = "eslint.config.mjs"
): string => {
    const repoPath = path.join(fixtureRoot, `${ruleName}-${variant}`);
    mkdirSync(repoPath, { recursive: true });

    for (const file of files) {
        const absolutePath = path.join(repoPath, file.relativePath);
        mkdirSync(path.dirname(absolutePath), { recursive: true });
        writeFileSync(absolutePath, file.content, "utf8");
    }

    const lintTargetPath = path.join(repoPath, lintTargetRelativePath);
    mkdirSync(path.dirname(lintTargetPath), { recursive: true });
    writeFileSync(lintTargetPath, lintTargetSource, "utf8");

    return lintTargetPath;
};
