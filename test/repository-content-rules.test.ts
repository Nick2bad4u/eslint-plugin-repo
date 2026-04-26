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
    "require-github-issue-template-labels",
    getPluginRule("require-github-issue-template-labels"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingGitHubIssueTemplateLabels" }],
                filename: writeFixtureRepo(
                    "require-github-issue-template-labels",
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
                    "require-github-issue-template-labels",
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
                    "require-github-issue-template-labels",
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

ruleTester.run(
    "require-readme-badges",
    getPluginRule("require-readme-badges"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingReadmeBadges" }],
                filename: writeFixtureRepo(
                    "require-readme-badges",
                    "invalid-no-badges",
                    [
                        {
                            content: [
                                "# Project",
                                "",
                                "This repository ships an ESLint plugin.",
                            ].join("\n"),
                            relativePath: "README.md",
                        },
                    ]
                ),
                name: "reports non-empty README files that do not contain badge markdown",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-readme-badges",
                    "valid-has-badge",
                    [
                        {
                            content: [
                                "# Project",
                                "",
                                "![CI](https://github.com/example/repo/actions/workflows/ci.yml/badge.svg)",
                            ].join("\n"),
                            relativePath: "README.md",
                        },
                    ]
                ),
                name: "accepts README files with at least one badge image link",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-readme-badges",
                    "valid-empty-readme",
                    [
                        {
                            content: "\n\n",
                            relativePath: "README.md",
                        },
                    ]
                ),
                name: "skips empty README files",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-readme-badges",
                    "valid-no-readme",
                    []
                ),
                name: "skips when README file is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-security-policy-contact-channel",
    getPluginRule("require-security-policy-contact-channel"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingSecurityPolicyContactChannel" }],
                filename: writeFixtureRepo(
                    "require-security-policy-contact-channel",
                    "invalid-no-contact-channel",
                    [
                        {
                            content: [
                                "# Security Policy",
                                "",
                                "We take security seriously.",
                                "Please keep disclosures concise.",
                            ].join("\n"),
                            relativePath: "SECURITY.md",
                        },
                    ]
                ),
                name: "reports security policies that omit contact channels and reporting details",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-security-policy-contact-channel",
                    "valid-https-contact",
                    [
                        {
                            content: [
                                "# Security Policy",
                                "",
                                "Report issues at https://example.com/security.",
                            ].join("\n"),
                            relativePath: "SECURITY.md",
                        },
                    ]
                ),
                name: "accepts security policy files with HTTPS reporting URLs",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-security-policy-contact-channel",
                    "valid-email-address",
                    [
                        {
                            content: [
                                "# Security Policy",
                                "",
                                "Please email security@example.org for vulnerability reports.",
                            ].join("\n"),
                            relativePath: ".github/SECURITY.md",
                        },
                    ]
                ),
                name: "accepts security policy files containing likely email addresses",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-security-policy-contact-channel",
                    "valid-empty-policy",
                    [
                        {
                            content: "\n",
                            relativePath: "SECURITY.md",
                        },
                    ]
                ),
                name: "skips empty security policy files",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-security-policy-contact-channel",
                    "valid-no-security-policy",
                    []
                ),
                name: "skips the rule when no security policy file exists",
            },
        ],
    }
);

ruleTester.run(
    "require-bitbucket-pipelines-clone-depth",
    getPluginRule("require-bitbucket-pipelines-clone-depth"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingCloneDepth" }],
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-clone-depth",
                    "invalid-missing-depth",
                    [
                        {
                            content: [
                                "pipelines:",
                                "  default:",
                                "    - step:",
                                "        script:",
                                "          - npm test",
                            ].join("\n"),
                            relativePath: "bitbucket-pipelines.yml",
                        },
                    ]
                ),
                name: "reports Bitbucket Pipelines configs without clone depth",
            },
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingCloneDepth" }],
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-clone-depth",
                    "invalid-depth-commented-out",
                    [
                        {
                            content: [
                                "clone:",
                                "  # depth: 1",
                                "pipelines:",
                                "  default:",
                                "    - step:",
                                "        script:",
                                "          - npm test",
                            ].join("\n"),
                            relativePath: "bitbucket-pipelines.yml",
                        },
                    ]
                ),
                name: "does not treat commented depth entries as configured clone depth",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-clone-depth",
                    "valid-depth-present",
                    [
                        {
                            content: [
                                "clone:",
                                "  depth: 1 # shallow clone",
                                "pipelines:",
                                "  default:",
                                "    - step:",
                                "        script:",
                                "          - npm test",
                            ].join("\n"),
                            relativePath: "bitbucket-pipelines.yml",
                        },
                    ]
                ),
                name: "accepts Bitbucket Pipelines configs with clone depth, including inline comments",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-clone-depth",
                    "valid-no-bitbucket-pipelines-file",
                    []
                ),
                name: "skips the rule when bitbucket-pipelines.yml is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-codeowners-reviewable-patterns",
    getPluginRule("require-codeowners-reviewable-patterns"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "unownedPattern" }],
                filename: writeFixtureRepo(
                    "require-codeowners-reviewable-patterns",
                    "invalid-unowned-pattern",
                    [
                        {
                            content: [
                                "# Owned rule",
                                "*.ts @org/maintainers",
                                "docs/**",
                            ].join("\n"),
                            relativePath: "CODEOWNERS",
                        },
                    ]
                ),
                name: "reports CODEOWNERS patterns that do not have any owners",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-codeowners-reviewable-patterns",
                    "valid-owned-patterns",
                    [
                        {
                            content: [
                                "*.ts @org/maintainers",
                                "docs/** @org/docs",
                            ].join("\n"),
                            relativePath: "CODEOWNERS",
                        },
                    ]
                ),
                name: "accepts CODEOWNERS entries with owners",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-codeowners-reviewable-patterns",
                    "valid-empty-codeowners",
                    [
                        {
                            content: "\n",
                            relativePath: ".github/CODEOWNERS",
                        },
                    ]
                ),
                name: "skips empty CODEOWNERS files",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-codeowners-reviewable-patterns",
                    "valid-no-codeowners-file",
                    []
                ),
                name: "skips the rule when CODEOWNERS is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-dependabot-grouping",
    getPluginRule("require-dependabot-grouping"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingDependabotGrouping" }],
                filename: writeFixtureRepo(
                    "require-dependabot-grouping",
                    "invalid-no-groups",
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
                            relativePath: ".github/dependabot.yml",
                        },
                    ]
                ),
                name: "reports Dependabot configs that do not define update groups",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dependabot-grouping",
                    "valid-groups-present",
                    [
                        {
                            content: [
                                "version: 2",
                                "updates:",
                                "  - package-ecosystem: npm",
                                "    directory: /",
                                "    schedule:",
                                "      interval: weekly",
                                "    groups:",
                                "      npm-minor:",
                                "        patterns:",
                                "          - '*'",
                            ].join("\n"),
                            relativePath: ".github/dependabot.yml",
                        },
                    ]
                ),
                name: "accepts Dependabot configs with a groups section",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dependabot-grouping",
                    "valid-no-dependabot-config",
                    []
                ),
                name: "skips the rule when Dependabot config is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-dependabot-update-entries",
    getPluginRule("require-dependabot-update-entries"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingDependabotUpdateEntries" }],
                filename: writeFixtureRepo(
                    "require-dependabot-update-entries",
                    "invalid-updates-without-ecosystem-entries",
                    [
                        {
                            content: [
                                "version: 2",
                                "updates:",
                                "  - directory: /",
                                "    schedule:",
                                "      interval: weekly",
                            ].join("\n"),
                            relativePath: ".github/dependabot.yml",
                        },
                    ]
                ),
                name: "reports Dependabot configs that do not declare package ecosystems",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dependabot-update-entries",
                    "valid-single-ecosystem-entry",
                    [
                        {
                            content: [
                                "version: 2",
                                "updates:",
                                '  - package-ecosystem: "npm"',
                                "    directory: /",
                                "    schedule:",
                                "      interval: weekly",
                            ].join("\n"),
                            relativePath: ".github/dependabot.yml",
                        },
                    ]
                ),
                name: "accepts Dependabot configs with at least one package-ecosystem entry",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dependabot-update-entries",
                    "valid-no-dependabot-config",
                    []
                ),
                name: "skips the rule when Dependabot config is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-license-spdx-identifier",
    getPluginRule("require-license-spdx-identifier"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingSpdxIdentifier" }],
                filename: writeFixtureRepo(
                    "require-license-spdx-identifier",
                    "invalid-license-without-known-identifier",
                    [
                        {
                            content: [
                                "Custom License",
                                "All rights reserved.",
                                "No SPDX identifier here.",
                            ].join("\n"),
                            relativePath: "LICENSE",
                        },
                    ]
                ),
                name: "reports LICENSE files without known SPDX identifiers",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-license-spdx-identifier",
                    "valid-license-name-detected",
                    [
                        {
                            content: [
                                "MIT License",
                                "",
                                "Permission is hereby granted...",
                            ].join("\n"),
                            relativePath: "LICENSE",
                        },
                    ]
                ),
                name: "accepts recognized license names in the first few lines",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-license-spdx-identifier",
                    "valid-explicit-spdx-tag",
                    [
                        {
                            content: [
                                "SPDX-License-Identifier: Apache-2.0",
                                "",
                                "Copyright (c) Example",
                            ].join("\n"),
                            relativePath: "LICENSE.txt",
                        },
                    ]
                ),
                name: "accepts explicit SPDX-License-Identifier tags",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-license-spdx-identifier",
                    "valid-empty-license",
                    [
                        {
                            content: "\n",
                            relativePath: "LICENSE",
                        },
                    ]
                ),
                name: "skips empty LICENSE files",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-license-spdx-identifier",
                    "valid-no-license-file",
                    []
                ),
                name: "skips the rule when LICENSE file is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-bitbucket-pipelines-image-pinned-tag",
    getPluginRule("require-bitbucket-pipelines-image-pinned-tag"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [
                    { messageId: "unpinnedImage" },
                    { messageId: "unpinnedImage" },
                ],
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-image-pinned-tag",
                    "invalid-unpinned-and-latest-images",
                    [
                        {
                            content: [
                                "image: node",
                                "pipelines:",
                                "  default:",
                                "    - step:",
                                "        image: node:latest",
                                "        script:",
                                "          - node --version",
                            ].join("\n"),
                            relativePath: "bitbucket-pipelines.yml",
                        },
                    ]
                ),
                name: "reports image entries without explicit tags and those using latest",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-image-pinned-tag",
                    "valid-pinned-image-tags",
                    [
                        {
                            content: [
                                "image: node:20.11-alpine",
                                "pipelines:",
                                "  default:",
                                "    - step:",
                                "        image: mcr.microsoft.com/playwright:v1.50.1-jammy",
                                "        script:",
                                "          - npm test",
                            ].join("\n"),
                            relativePath: "bitbucket-pipelines.yml",
                        },
                    ]
                ),
                name: "accepts Bitbucket pipelines with explicit non-latest image tags",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-image-pinned-tag",
                    "valid-image-object-syntax",
                    [
                        {
                            content: [
                                "pipelines:",
                                "  default:",
                                "    - step:",
                                "        image: { name: atlassian/default-image:3 }",
                                "        script:",
                                "          - echo ok",
                            ].join("\n"),
                            relativePath: "bitbucket-pipelines.yml",
                        },
                    ]
                ),
                name: "skips image object mapping syntax that is handled outside scalar line matching",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-image-pinned-tag",
                    "valid-no-bitbucket-pipelines-config",
                    []
                ),
                name: "skips the rule when bitbucket-pipelines.yml is absent",
            },
        ],
    }
);

// ──────────────────────────────────────────────────────────────────────────────
// Additional branch-coverage tests for Dependabot rules
// ──────────────────────────────────────────────────────────────────────────────

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
                    "invalid-interval-not-in-valid-set",
                    [
                        {
                            content: [
                                "version: 2",
                                "updates:",
                                "  - package-ecosystem: npm",
                                "    directory: /",
                                "    schedule:",
                                "      interval: hourly",
                            ].join("\n"),
                            relativePath: ".github/dependabot.yml",
                        },
                    ]
                ),
                name: "reports Dependabot configs with an unrecognised interval value",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dependabot-schedule",
                    "valid-no-dependabot-config-present",
                    []
                ),
                name: "skips when no Dependabot config file exists in the repository",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dependabot-schedule",
                    "valid-no-update-entries",
                    [
                        {
                            content: ["version: 2", "updates: []"].join("\n"),
                            relativePath: ".github/dependabot.yml",
                        },
                    ]
                ),
                name: "passes when there are no update entries (nothing to schedule)",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dependabot-schedule",
                    "valid-daily-interval",
                    [
                        {
                            content: [
                                "version: 2",
                                "updates:",
                                "  - package-ecosystem: npm",
                                "    directory: /",
                                "    schedule:",
                                "      interval: daily",
                            ].join("\n"),
                            relativePath: ".github/dependabot.yml",
                        },
                    ]
                ),
                name: "accepts Dependabot configs with a daily interval",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dependabot-schedule",
                    "valid-monthly-interval",
                    [
                        {
                            content: [
                                "version: 2",
                                "updates:",
                                "  - package-ecosystem: npm",
                                "    directory: /",
                                "    schedule:",
                                "      interval: monthly",
                            ].join("\n"),
                            relativePath: ".github/dependabot.yml",
                        },
                    ]
                ),
                name: "accepts Dependabot configs with a monthly interval",
            },
        ],
    }
);

ruleTester.run(
    "require-dependabot-grouping",
    getPluginRule("require-dependabot-grouping"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dependabot-grouping",
                    "valid-no-dependabot-config-present",
                    []
                ),
                name: "skips when no Dependabot config file exists in the repository",
            },
        ],
    }
);

ruleTester.run(
    "require-dependabot-update-entries",
    getPluginRule("require-dependabot-update-entries"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dependabot-update-entries",
                    "valid-no-dependabot-config-extra",
                    []
                ),
                name: "skips when no Dependabot config file exists (extra branch coverage test)",
            },
        ],
    }
);
