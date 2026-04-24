import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import * as path from "node:path";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

type FileFixture = Readonly<{
    content: string;
    relativePath: string;
}>;

const ruleTester = createRuleTester();
const lintTargetSource = "export const lintTarget = true;\n";
const fixtureRoot = path.join(
    tmpdir(),
    "repo-compliance-provider-config-rules"
);

mkdirSync(fixtureRoot, { recursive: true });

const writeFixtureRepo = (
    ruleName: string,
    variant: string,
    files: readonly FileFixture[]
): string => {
    const repoPath = path.join(fixtureRoot, `${ruleName}-${variant}`);
    mkdirSync(repoPath, { recursive: true });

    for (const file of files) {
        const absolutePath = path.join(repoPath, file.relativePath);
        mkdirSync(path.dirname(absolutePath), { recursive: true });
        writeFileSync(absolutePath, file.content, "utf8");
    }

    const lintTargetPath = path.join(repoPath, "eslint.config.mjs");
    writeFileSync(lintTargetPath, lintTargetSource, "utf8");

    return lintTargetPath;
};

ruleTester.run(
    "require-gitlab-ci-security-scanning",
    getPluginRule("require-gitlab-ci-security-scanning"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingGitLabCiSecurityScanning" }],
                filename: writeFixtureRepo(
                    "require-gitlab-ci-security-scanning",
                    "invalid-no-security",
                    [
                        {
                            content: [
                                "stages:",
                                "  - build",
                                "  - test",
                                "build:",
                                "  stage: build",
                                "  script:",
                                "    - npm run build",
                                "test:",
                                "  stage: test",
                                "  script:",
                                "    - npm test",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yml",
                        },
                    ]
                ),
                name: "reports gitlab-ci.yml without any security scanning",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-security-scanning",
                    "valid-sast-template",
                    [
                        {
                            content: [
                                "include:",
                                "  - template: Security/SAST.gitlab-ci.yml",
                                "stages:",
                                "  - test",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yml",
                        },
                    ]
                ),
                name: "accepts gitlab-ci.yml with SAST template include",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-security-scanning",
                    "valid-secret-detection-template",
                    [
                        {
                            content: [
                                "include:",
                                "  - template: Security/Secret-Detection.gitlab-ci.yml",
                                "stages:",
                                "  - test",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yml",
                        },
                    ]
                ),
                name: "accepts gitlab-ci.yml with Secret Detection template",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-security-scanning",
                    "valid-sast-job",
                    [
                        {
                            content: [
                                "stages:",
                                "  - test",
                                "sast:",
                                "  stage: test",
                                "  script:",
                                "    - run-sast",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yml",
                        },
                    ]
                ),
                name: "accepts gitlab-ci.yml with a sast: job defined",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-security-scanning",
                    "valid-no-gitlab-ci",
                    []
                ),
                name: "skips check when .gitlab-ci.yml is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-gitlab-ci-stages",
    getPluginRule("require-gitlab-ci-stages"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingGitLabCiStages" }],
                filename: writeFixtureRepo(
                    "require-gitlab-ci-stages",
                    "invalid-missing-stages",
                    [
                        {
                            content: [
                                "default:",
                                "  image: node:20",
                                "test:",
                                "  script:",
                                "    - npm test",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yml",
                        },
                    ]
                ),
                name: "reports gitlab-ci.yml without root stages key",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-stages",
                    "valid-with-stages",
                    [
                        {
                            content: [
                                "stages:",
                                "  - test",
                                "  - deploy",
                                "test:",
                                "  stage: test",
                                "  script:",
                                "    - npm test",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yml",
                        },
                    ]
                ),
                name: "accepts gitlab-ci.yml with explicit stages",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-stages",
                    "valid-no-gitlab-ci",
                    []
                ),
                name: "skips check when .gitlab-ci.yml is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-bitbucket-pipelines-default-pipeline",
    getPluginRule("require-bitbucket-pipelines-default-pipeline"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingBitbucketDefaultPipeline" }],
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-default-pipeline",
                    "invalid-no-default",
                    [
                        {
                            content: [
                                "image: node:22",
                                "pipelines:",
                                "  branches:",
                                "    main:",
                                "      - step:",
                                "          name: Build",
                                "          script:",
                                "            - npm run build",
                            ].join("\n"),
                            relativePath: "bitbucket-pipelines.yml",
                        },
                    ]
                ),
                name: "reports pipelines config missing a default: section",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-default-pipeline",
                    "valid-with-default",
                    [
                        {
                            content: [
                                "image: node:22",
                                "pipelines:",
                                "  default:",
                                "    - step:",
                                "        name: Test",
                                "        script:",
                                "          - npm test",
                            ].join("\n"),
                            relativePath: "bitbucket-pipelines.yml",
                        },
                    ]
                ),
                name: "accepts pipelines config with a default: section",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-default-pipeline",
                    "valid-no-pipelines-file",
                    []
                ),
                name: "skips check when bitbucket-pipelines.yml is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-forgejo-actions-workflow-permissions",
    getPluginRule("require-forgejo-actions-workflow-permissions"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingWorkflowPermissions" }],
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-permissions",
                    "invalid-missing-permissions",
                    [
                        {
                            content: [
                                "name: CI",
                                "on:",
                                "  push:",
                                "    branches: [main]",
                                "jobs:",
                                "  test:",
                                "    runs-on: ubuntu-latest",
                                "    steps:",
                                "      - uses: actions/checkout@v4",
                            ].join("\n"),
                            relativePath: ".forgejo/workflows/ci.yml",
                        },
                    ]
                ),
                name: "reports Forgejo workflows missing explicit permissions",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-permissions",
                    "valid-workflow-level-permissions",
                    [
                        {
                            content: [
                                "name: CI",
                                "on:",
                                "  push:",
                                "permissions:",
                                "  contents: read",
                                "jobs:",
                                "  test:",
                                "    runs-on: ubuntu-latest",
                                "    steps:",
                                "      - uses: actions/checkout@v4",
                            ].join("\n"),
                            relativePath: ".forgejo/workflows/ci.yml",
                        },
                    ]
                ),
                name: "accepts Forgejo workflow with workflow-level permissions",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-permissions",
                    "valid-job-level-permissions",
                    [
                        {
                            content: [
                                "name: Lint",
                                "on:",
                                "  pull_request:",
                                "jobs:",
                                "  lint:",
                                "    permissions:",
                                "      contents: read",
                                "    runs-on: ubuntu-latest",
                                "    steps:",
                                "      - uses: actions/checkout@v4",
                            ].join("\n"),
                            relativePath: ".forgejo/workflows/lint.yml",
                        },
                    ]
                ),
                name: "accepts Forgejo workflow with job-level permissions",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-permissions",
                    "valid-no-forgejo-workflows",
                    []
                ),
                name: "skips check when .forgejo/workflows/ directory is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-bitbucket-pipelines-pull-requests",
    getPluginRule("require-bitbucket-pipelines-pull-requests"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingBitbucketPullRequestsPipeline" }],
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-pull-requests",
                    "invalid-no-pull-requests",
                    [
                        {
                            content: [
                                "image: node:22",
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
                name: "reports missing pull-requests section",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-pull-requests",
                    "valid-with-pull-requests",
                    [
                        {
                            content: [
                                "image: node:22",
                                "pipelines:",
                                "  pull-requests:",
                                "    '**':",
                                "      - step:",
                                "          script:",
                                "            - npm test",
                                "  default:",
                                "    - step:",
                                "        script:",
                                "          - npm run lint",
                            ].join("\n"),
                            relativePath: "bitbucket-pipelines.yml",
                        },
                    ]
                ),
                name: "accepts pull-requests section",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-pull-requests",
                    "valid-no-pipelines-file",
                    []
                ),
                name: "skips when bitbucket pipelines file is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-gitlab-ci-merge-request-pipelines",
    getPluginRule("require-gitlab-ci-merge-request-pipelines"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [
                    { messageId: "missingGitLabMergeRequestPipelineConfig" },
                ],
                filename: writeFixtureRepo(
                    "require-gitlab-ci-merge-request-pipelines",
                    "invalid-no-mr-rules",
                    [
                        {
                            content: [
                                "stages:",
                                "  - test",
                                "test:",
                                "  stage: test",
                                "  script:",
                                "    - npm test",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yml",
                        },
                    ]
                ),
                name: "reports missing merge-request pipeline config",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-merge-request-pipelines",
                    "valid-workflow-rules",
                    [
                        {
                            content: [
                                "workflow:",
                                "  rules:",
                                '    - if: $CI_PIPELINE_SOURCE == "merge_request_event"',
                                "stages:",
                                "  - test",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yml",
                        },
                    ]
                ),
                name: "accepts merge_request_event workflow rule",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-merge-request-pipelines",
                    "valid-only-merge-requests",
                    [
                        {
                            content: [
                                "test:",
                                "  script:",
                                "    - npm test",
                                "  only:",
                                "    - merge_requests",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yml",
                        },
                    ]
                ),
                name: "accepts merge_requests only clause",
            },
        ],
    }
);

ruleTester.run(
    "require-forgejo-actions-pinned-sha",
    getPluginRule("require-forgejo-actions-pinned-sha"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "unpinnedForgejoActionsUses" }],
                filename: writeFixtureRepo(
                    "require-forgejo-actions-pinned-sha",
                    "invalid-tag-ref",
                    [
                        {
                            content: [
                                "name: CI",
                                "on:",
                                "  push:",
                                "jobs:",
                                "  test:",
                                "    runs-on: docker",
                                "    steps:",
                                "      - uses: actions/checkout@v4",
                            ].join("\n"),
                            relativePath: ".forgejo/workflows/ci.yml",
                        },
                    ]
                ),
                name: "reports Forgejo uses refs pinned to mutable tags",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-pinned-sha",
                    "valid-full-sha",
                    [
                        {
                            content: [
                                "name: CI",
                                "on:",
                                "  push:",
                                "jobs:",
                                "  test:",
                                "    runs-on: docker",
                                "    steps:",
                                "      - uses: actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332 # v4",
                            ].join("\n"),
                            relativePath: ".forgejo/workflows/ci.yml",
                        },
                    ]
                ),
                name: "accepts Forgejo uses refs pinned to full SHA",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-pinned-sha",
                    "valid-local-action",
                    [
                        {
                            content: [
                                "name: local",
                                "on:",
                                "  push:",
                                "jobs:",
                                "  local:",
                                "    runs-on: docker",
                                "    steps:",
                                "      - uses: ./actions/my-local-action",
                            ].join("\n"),
                            relativePath: ".forgejo/workflows/local.yml",
                        },
                    ]
                ),
                name: "accepts local Forgejo action path",
            },
        ],
    }
);

ruleTester.run(
    "require-forgejo-actions-job-timeout-minutes",
    getPluginRule("require-forgejo-actions-job-timeout-minutes"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingJobTimeoutMinutes" }],
                filename: writeFixtureRepo(
                    "require-forgejo-actions-job-timeout-minutes",
                    "invalid-missing-timeout",
                    [
                        {
                            content: [
                                "name: CI",
                                "on:",
                                "  push:",
                                "jobs:",
                                "  test:",
                                "    runs-on: docker",
                                "    steps:",
                                "      - uses: actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332",
                            ].join("\n"),
                            relativePath: ".forgejo/workflows/ci.yml",
                        },
                    ]
                ),
                name: "reports Forgejo jobs without timeout-minutes",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-job-timeout-minutes",
                    "valid-job-timeout",
                    [
                        {
                            content: [
                                "name: CI",
                                "on:",
                                "  push:",
                                "jobs:",
                                "  test:",
                                "    runs-on: docker",
                                "    timeout-minutes: 12",
                                "    steps:",
                                "      - uses: actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332",
                            ].join("\n"),
                            relativePath: ".forgejo/workflows/ci.yml",
                        },
                    ]
                ),
                name: "accepts Forgejo jobs with timeout-minutes",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-job-timeout-minutes",
                    "valid-reusable-workflow-job",
                    [
                        {
                            content: [
                                "name: Reusable",
                                "on:",
                                "  workflow_dispatch:",
                                "jobs:",
                                "  call:",
                                "    uses: owner/repo/.forgejo/workflows/reusable.yml@main",
                            ].join("\n"),
                            relativePath: ".forgejo/workflows/reuse.yml",
                        },
                    ]
                ),
                name: "skips Forgejo reusable workflow jobs",
            },
        ],
    }
);

ruleTester.run(
    "require-gitlab-ci-workflow-rules",
    getPluginRule("require-gitlab-ci-workflow-rules"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingGitLabWorkflowRules" }],
                filename: writeFixtureRepo(
                    "require-gitlab-ci-workflow-rules",
                    "invalid-no-workflow-rules",
                    [
                        {
                            content: [
                                "stages:",
                                "  - test",
                                "test:",
                                "  script:",
                                "    - npm test",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yml",
                        },
                    ]
                ),
                name: "reports missing root workflow rules",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-workflow-rules",
                    "valid-workflow-rules",
                    [
                        {
                            content: [
                                "workflow:",
                                "  rules:",
                                '    - if: $CI_PIPELINE_SOURCE == "merge_request_event"',
                                "stages:",
                                "  - test",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yml",
                        },
                    ]
                ),
                name: "accepts root workflow rules",
            },
        ],
    }
);

ruleTester.run(
    "require-bitbucket-pipelines-max-time",
    getPluginRule("require-bitbucket-pipelines-max-time"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingBitbucketMaxTime" }],
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-max-time",
                    "invalid-no-max-time",
                    [
                        {
                            content: [
                                "pipelines:",
                                "  default:",
                                "    - step:",
                                "        name: build",
                                "        script:",
                                "          - npm test",
                            ].join("\n"),
                            relativePath: "bitbucket-pipelines.yml",
                        },
                    ]
                ),
                name: "reports missing global and step max-time",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-max-time",
                    "valid-global-max-time",
                    [
                        {
                            content: [
                                "options:",
                                "  max-time: 30",
                                "pipelines:",
                                "  default:",
                                "    - step:",
                                "        name: build",
                                "        script:",
                                "          - npm test",
                            ].join("\n"),
                            relativePath: "bitbucket-pipelines.yml",
                        },
                    ]
                ),
                name: "accepts global options max-time",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-max-time",
                    "valid-step-max-time",
                    [
                        {
                            content: [
                                "pipelines:",
                                "  default:",
                                "    - step:",
                                "        name: build",
                                "        max-time: 15",
                                "        script:",
                                "          - npm test",
                            ].join("\n"),
                            relativePath: "bitbucket-pipelines.yml",
                        },
                    ]
                ),
                name: "accepts per-step max-time",
            },
        ],
    }
);

ruleTester.run(
    "require-gitlab-ci-rules-over-only-except",
    getPluginRule("require-gitlab-ci-rules-over-only-except"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "foundOnlyExceptUsage" }],
                filename: writeFixtureRepo(
                    "require-gitlab-ci-rules-over-only-except",
                    "invalid-only-usage",
                    [
                        {
                            content: [
                                "test:",
                                "  script:",
                                "    - npm test",
                                "  only:",
                                "    - branches",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yml",
                        },
                    ]
                ),
                name: "reports legacy only/except filters",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-rules-over-only-except",
                    "valid-rules-usage",
                    [
                        {
                            content: [
                                "test:",
                                "  script:",
                                "    - npm test",
                                "  rules:",
                                "    - if: $CI_COMMIT_BRANCH",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yml",
                        },
                    ]
                ),
                name: "accepts rules-based job filtering",
            },
        ],
    }
);

ruleTester.run(
    "require-github-actions-workflow-name",
    getPluginRule("require-github-actions-workflow-name"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingWorkflowName" }],
                filename: writeFixtureRepo(
                    "require-github-actions-workflow-name",
                    "invalid-missing-name",
                    [
                        {
                            content: [
                                "on:",
                                "  push:",
                                "jobs:",
                                "  test:",
                                "    runs-on: ubuntu-latest",
                                "    steps:",
                                "      - run: npm test",
                            ].join("\n"),
                            relativePath: ".github/workflows/ci.yml",
                        },
                    ]
                ),
                name: "reports workflow files without root name key",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-github-actions-workflow-name",
                    "valid-with-name",
                    [
                        {
                            content: [
                                "name: CI",
                                "on:",
                                "  push:",
                                "jobs:",
                                "  test:",
                                "    runs-on: ubuntu-latest",
                                "    steps:",
                                "      - run: npm test",
                            ].join("\n"),
                            relativePath: ".github/workflows/ci.yml",
                        },
                    ]
                ),
                name: "accepts workflow files with explicit root name",
            },
        ],
    }
);

ruleTester.run(
    "require-gitlab-ci-default-timeout",
    getPluginRule("require-gitlab-ci-default-timeout"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingGitLabDefaultTimeout" }],
                filename: writeFixtureRepo(
                    "require-gitlab-ci-default-timeout",
                    "invalid-no-default-timeout",
                    [
                        {
                            content: [
                                "stages:",
                                "  - test",
                                "test:",
                                "  stage: test",
                                "  script:",
                                "    - npm test",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yml",
                        },
                    ]
                ),
                name: "reports missing default.timeout baseline",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-default-timeout",
                    "valid-default-timeout",
                    [
                        {
                            content: [
                                "default:",
                                "  timeout: 30m",
                                "stages:",
                                "  - test",
                                "test:",
                                "  stage: test",
                                "  script:",
                                "    - npm test",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yml",
                        },
                    ]
                ),
                name: "accepts gitlab default timeout",
            },
        ],
    }
);

ruleTester.run(
    "require-forgejo-actions-workflow-name",
    getPluginRule("require-forgejo-actions-workflow-name"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingForgejoWorkflowName" }],
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-name",
                    "invalid-missing-workflow-name",
                    [
                        {
                            content: [
                                "on:",
                                "  push:",
                                "jobs:",
                                "  test:",
                                "    runs-on: docker",
                                "    steps:",
                                "      - run: echo test",
                            ].join("\n"),
                            relativePath: ".forgejo/workflows/ci.yml",
                        },
                    ]
                ),
                name: "reports forgejo workflows without root name",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-name",
                    "valid-workflow-name-present",
                    [
                        {
                            content: [
                                "name: CI",
                                "on:",
                                "  push:",
                                "jobs:",
                                "  test:",
                                "    runs-on: docker",
                                "    steps:",
                                "      - run: echo test",
                            ].join("\n"),
                            relativePath: ".forgejo/workflows/ci.yml",
                        },
                    ]
                ),
                name: "accepts forgejo workflows with explicit name",
            },
        ],
    }
);

ruleTester.run(
    "require-bitbucket-pipelines-step-name",
    getPluginRule("require-bitbucket-pipelines-step-name"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingBitbucketStepName" }],
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-step-name",
                    "invalid-step-without-name",
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
                name: "reports step blocks missing name",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-step-name",
                    "valid-step-with-name",
                    [
                        {
                            content: [
                                "pipelines:",
                                "  default:",
                                "    - step:",
                                "        name: test",
                                "        script:",
                                "          - npm test",
                            ].join("\n"),
                            relativePath: "bitbucket-pipelines.yml",
                        },
                    ]
                ),
                name: "accepts step blocks with name",
            },
        ],
    }
);

ruleTester.run(
    "require-bitbucket-pipelines-pull-requests-target-branches",
    getPluginRule("require-bitbucket-pipelines-pull-requests-target-branches"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingPullRequestTargetBranches" }],
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-pull-requests-target-branches",
                    "invalid-pull-requests-without-target-branches",
                    [
                        {
                            content: ["pipelines:", "  pull-requests:"].join(
                                "\n"
                            ),
                            relativePath: "bitbucket-pipelines.yml",
                        },
                    ]
                ),
                name: "reports pull-requests blocks without target branch mappings",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-pull-requests-target-branches",
                    "valid-pull-requests-target-branches",
                    [
                        {
                            content: [
                                "pipelines:",
                                "  pull-requests:",
                                '    "**":',
                                "      - step:",
                                "          name: validate pull requests",
                                "          script:",
                                "            - npm test",
                            ].join("\n"),
                            relativePath: "bitbucket-pipelines.yml",
                        },
                    ]
                ),
                name: "accepts pull-requests blocks that declare target branches",
            },
        ],
    }
);

ruleTester.run(
    "require-dependabot-reviewers",
    getPluginRule("require-dependabot-reviewers"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingDependabotReviewers" }],
                filename: writeFixtureRepo(
                    "require-dependabot-reviewers",
                    "invalid-missing-reviewers",
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
                name: "reports dependabot updates without reviewers",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dependabot-reviewers",
                    "valid-reviewers",
                    [
                        {
                            content: [
                                "version: 2",
                                "updates:",
                                "  - package-ecosystem: npm",
                                "    directory: /",
                                "    schedule:",
                                "      interval: weekly",
                                "    reviewers:",
                                "      - octocat",
                            ].join("\n"),
                            relativePath: ".github/dependabot.yml",
                        },
                    ]
                ),
                name: "accepts dependabot updates with reviewers",
            },
        ],
    }
);

ruleTester.run(
    "require-forgejo-actions-workflow-dispatch",
    getPluginRule("require-forgejo-actions-workflow-dispatch"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [
                    {
                        data: {
                            files: ".forgejo/workflows/ci.yml",
                        },
                        messageId: "missingWorkflowDispatch",
                    },
                ],
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-dispatch",
                    "invalid-missing-workflow-dispatch",
                    [
                        {
                            content: [
                                "name: CI",
                                "on:",
                                "  push:",
                                "    branches:",
                                "      - main",
                                "jobs:",
                                "  test:",
                                "    runs-on: ubuntu-latest",
                                "    steps:",
                                "      - run: npm test",
                            ].join("\n"),
                            relativePath: ".forgejo/workflows/ci.yml",
                        },
                    ]
                ),
                name: "reports forgejo workflows missing workflow_dispatch",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-dispatch",
                    "valid-workflow-dispatch",
                    [
                        {
                            content: [
                                "name: CI",
                                "on:",
                                "  push:",
                                "    branches:",
                                "      - main",
                                "  workflow_dispatch:",
                                "jobs:",
                                "  test:",
                                "    runs-on: ubuntu-latest",
                                "    steps:",
                                "      - run: npm test",
                            ].join("\n"),
                            relativePath: ".forgejo/workflows/ci.yml",
                        },
                    ]
                ),
                name: "accepts forgejo workflows with workflow_dispatch",
            },
        ],
    }
);

ruleTester.run(
    "require-forgejo-actions-no-write-all-permissions",
    getPluginRule("require-forgejo-actions-no-write-all-permissions"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [
                    {
                        data: {
                            workflowList: ".forgejo/workflows/ci.yml",
                        },
                        messageId: "noWriteAllPermissions",
                    },
                ],
                filename: writeFixtureRepo(
                    "require-forgejo-actions-no-write-all-permissions",
                    "invalid-write-all-permissions",
                    [
                        {
                            content: [
                                "name: CI",
                                "on:",
                                "  push:",
                                "    branches:",
                                "      - main",
                                "permissions: write-all",
                                "jobs:",
                                "  test:",
                                "    runs-on: docker",
                                "    steps:",
                                "      - run: npm test",
                            ].join("\n"),
                            relativePath: ".forgejo/workflows/ci.yml",
                        },
                    ]
                ),
                name: "reports forgejo workflows using write-all permissions",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-no-write-all-permissions",
                    "valid-scoped-permissions",
                    [
                        {
                            content: [
                                "name: CI",
                                "on:",
                                "  push:",
                                "    branches:",
                                "      - main",
                                "permissions:",
                                "  contents: read",
                                "jobs:",
                                "  test:",
                                "    runs-on: docker",
                                "    steps:",
                                "      - run: npm test",
                            ].join("\n"),
                            relativePath: ".forgejo/workflows/ci.yml",
                        },
                    ]
                ),
                name: "accepts forgejo workflows with scoped permissions",
            },
        ],
    }
);
