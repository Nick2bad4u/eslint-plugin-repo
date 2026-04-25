import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import * as path from "node:path";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

type FileFixture = Readonly<{
    content: string;
    relativePath: string;
}>;

const fixtureRoot = path.join(tmpdir(), "repo-compliance-content-rules");
const lintTargetSource = "export const lintTarget = true;\n";
const ruleTester = createRuleTester();

mkdirSync(fixtureRoot, { recursive: true });

const writeFixtureRepo = (
    ruleName: string,
    variant: string,
    files: readonly FileFixture[],
    lintTargetRelativePath = "eslint.config.mjs"
): string => {
    const rootDirectoryPath = path.join(fixtureRoot, `${ruleName}-${variant}`);
    mkdirSync(rootDirectoryPath, { recursive: true });

    for (const file of files) {
        const absolutePath = path.join(rootDirectoryPath, file.relativePath);
        mkdirSync(path.dirname(absolutePath), { recursive: true });
        writeFileSync(absolutePath, file.content, "utf8");
    }

    const lintTargetPath = path.join(rootDirectoryPath, lintTargetRelativePath);
    mkdirSync(path.dirname(lintTargetPath), { recursive: true });
    writeFileSync(lintTargetPath, lintTargetSource, "utf8");

    return lintTargetPath;
};

ruleTester.run(
    "require-issue-template-labels",
    getPluginRule("require-issue-template-labels"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingIssueTemplateLabels" }],
                filename: writeFixtureRepo(
                    "require-issue-template-labels",
                    "invalid-yaml-issue-form-without-labels",
                    [
                        {
                            content: [
                                "name: Bug report",
                                "description: Report a reproducible problem",
                                "body:",
                                "  - type: textarea",
                                "    attributes:",
                                "      label: What happened?",
                            ].join("\n"),
                            relativePath: ".github/ISSUE_TEMPLATE/bug.yml",
                        },
                    ]
                ),
                name: "reports GitHub issue-form YAML templates that omit the root-level labels key",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-issue-template-labels",
                    "valid-yaml-issue-form-with-labels",
                    [
                        {
                            content: [
                                "name: Bug report",
                                "description: Report a reproducible problem",
                                "labels: [bug, needs-triage]",
                                "body:",
                                "  - type: textarea",
                                "    attributes:",
                                "      label: What happened?",
                            ].join("\n"),
                            relativePath: ".github/ISSUE_TEMPLATE/bug.yml",
                        },
                    ]
                ),
                name: "accepts real GitHub issue-form YAML with a root-level labels key",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-issue-template-labels",
                    "valid-config-only",
                    [
                        {
                            content: [
                                "blank_issues_enabled: false",
                                "contact_links:",
                                "  - name: Security contact",
                                "    url: https://example.com/security",
                            ].join("\n"),
                            relativePath: ".github/ISSUE_TEMPLATE/config.yml",
                        },
                    ]
                ),
                name: "skips ISSUE_TEMPLATE config.yml because it is not an issue form template",
            },
        ],
    }
);

ruleTester.run(
    "require-readme-sections",
    getPluginRule("require-readme-sections"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [
                    { messageId: "missingReadmeSection" },
                    { messageId: "missingReadmeSection" },
                ],
                filename: writeFixtureRepo(
                    "require-readme-sections",
                    "invalid-headings-only-in-fenced-code",
                    [
                        {
                            content: [
                                "# Project",
                                "",
                                "```md",
                                "## Installation",
                                "npm install project",
                                "## Usage",
                                "npm run start",
                                "```",
                            ].join("\n"),
                            relativePath: "README.md",
                        },
                    ]
                ),
                name: "ignores headings that only appear inside fenced code blocks",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-readme-sections",
                    "valid-real-headings",
                    [
                        {
                            content: [
                                "# Project",
                                "",
                                "## Installation",
                                "npm install project",
                                "",
                                "## Usage",
                                "npm run start",
                            ].join("\n"),
                            relativePath: "README.md",
                        },
                    ]
                ),
                name: "accepts README files with real installation and usage headings",
            },
        ],
    }
);

ruleTester.run(
    "require-dependabot-schedule",
    getPluginRule("require-dependabot-schedule"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingDependabotSchedule" }],
                filename: writeFixtureRepo(
                    "require-dependabot-schedule",
                    "invalid-yaml-extension-missing-schedule",
                    [
                        {
                            content: [
                                "version: 2",
                                "updates:",
                                "  - package-ecosystem: npm",
                                "    directory: /",
                            ].join("\n"),
                            relativePath: ".github/dependabot.yaml",
                        },
                    ]
                ),
                name: "reports Dependabot YAML configs that omit schedule.interval",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dependabot-schedule",
                    "valid-yaml-extension",
                    [
                        {
                            content: [
                                "version: 2",
                                "updates:",
                                "  - package-ecosystem: npm",
                                "    directory: /",
                                "    schedule:",
                                "      interval: weekly",
                            ].join("\n"),
                            relativePath: ".github/dependabot.yaml",
                        },
                    ]
                ),
                name: "accepts Dependabot config stored as dependabot.yaml",
            },
        ],
    }
);
