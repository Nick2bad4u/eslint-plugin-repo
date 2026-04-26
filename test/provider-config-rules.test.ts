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
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingWorkflowPermissions" }],
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-permissions",
                    "invalid-commented-permissions-only",
                    [
                        {
                            content: [
                                "name: CI",
                                "on:",
                                "  push:",
                                "# permissions:",
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
                name: "ignores commented permissions keys and still reports the workflow",
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
                    "valid-yaml-and-extra-non-workflow-files",
                    [
                        {
                            content: "ignored\n",
                            relativePath: ".forgejo/workflows/notes.txt",
                        },
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
                            relativePath: ".forgejo/workflows/ci.yaml",
                        },
                    ]
                ),
                name: "accepts yaml workflows and ignores non-workflow extensions",
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
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-permissions",
                    "valid-multiple-workflows-all-covered",
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
                        {
                            content: [
                                "name: Release",
                                "on:",
                                "  workflow_dispatch:",
                                "jobs:",
                                "  release:",
                                "    permissions:",
                                "      contents: write",
                                "    runs-on: ubuntu-latest",
                                "    steps:",
                                "      - uses: actions/checkout@v4",
                            ].join("\n"),
                            relativePath: ".forgejo/workflows/release.yml",
                        },
                    ]
                ),
                name: "accepts multiple Forgejo workflows when each declares permissions",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-permissions",
                    "valid-nested-directory-only",
                    [
                        {
                            content: "name: nested\n",
                            relativePath: ".forgejo/workflows/nested/ci.yml",
                        },
                    ]
                ),
                name: "skips nested workflow directories because only top-level workflow files are considered",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-permissions",
                    "valid-non-trigger-file",
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
                                "      - uses: actions/checkout@v4",
                            ].join("\n"),
                            relativePath: ".forgejo/workflows/ci.yml",
                        },
                    ],
                    "src/index.ts"
                ),
                name: "skips evaluation when linting a non-trigger file",
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
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingGitLabWorkflowRules" }],
                filename: writeFixtureRepo(
                    "require-gitlab-ci-workflow-rules",
                    "invalid-workflow-without-rules-block",
                    [
                        {
                            content: [
                                "workflow:",
                                "  name: pipeline",
                                "stages:",
                                "  - test",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yml",
                        },
                    ]
                ),
                name: "reports workflow sections that exist but omit rules",
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
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-workflow-rules",
                    "valid-yaml-extension-with-comments",
                    [
                        {
                            content: [
                                "# pipeline control",
                                "workflow:",
                                "  # allowed pipeline sources",
                                "  rules:",
                                '    - if: $CI_PIPELINE_SOURCE == "push"',
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yaml",
                        },
                    ]
                ),
                name: "accepts .gitlab-ci.yaml and ignores comment lines inside workflow",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-workflow-rules",
                    "valid-no-gitlab-ci-file",
                    []
                ),
                name: "skips when no GitLab CI config file exists",
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
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-max-time",
                    "valid-inline-comment-max-time",
                    [
                        {
                            content: [
                                "options:",
                                "  max-time: 20 # default timeout",
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
                name: "accepts max-time values with inline comments",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-max-time",
                    "valid-empty-file",
                    [
                        {
                            content: "",
                            relativePath: "bitbucket-pipelines.yml",
                        },
                    ]
                ),
                name: "skips empty pipelines files",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-max-time",
                    "valid-no-pipelines-file",
                    []
                ),
                name: "skips when bitbucket-pipelines.yml is absent",
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
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingForgejoWorkflowName" }],
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-name",
                    "invalid-nested-name-only",
                    [
                        {
                            content: [
                                "on:",
                                "  push:",
                                "jobs:",
                                "  test:",
                                "    name: nested job name",
                                "    runs-on: docker",
                                "    steps:",
                                "      - run: echo test",
                            ].join("\n"),
                            relativePath: ".forgejo/workflows/ci.yml",
                        },
                    ]
                ),
                name: "reports workflows that only define nested job names",
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
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-name",
                    "valid-yaml-extension-and-leading-comments",
                    [
                        {
                            content: [
                                "# workflow heading",
                                "",
                                "name: Release",
                                "on:",
                                "  workflow_dispatch:",
                                "jobs:",
                                "  release:",
                                "    runs-on: docker",
                                "    steps:",
                                "      - run: echo release",
                            ].join("\n"),
                            relativePath: ".forgejo/workflows/release.yaml",
                        },
                    ]
                ),
                name: "accepts yaml workflows with leading comments before the root name",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-name",
                    "valid-no-workflows-directory",
                    []
                ),
                name: "skips when no Forgejo workflows directory exists",
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
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingBitbucketStepName" }],
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-step-name",
                    "invalid-multiple-steps-one-missing-name",
                    [
                        {
                            content: [
                                "pipelines:",
                                "  default:",
                                "    - step:",
                                "        name: build",
                                "        script:",
                                "          - npm run build",
                                "    - step:",
                                "        script:",
                                "          - npm test",
                            ].join("\n"),
                            relativePath: "bitbucket-pipelines.yml",
                        },
                    ]
                ),
                name: "reports unnamed steps even when earlier steps are named",
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
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-step-name",
                    "valid-inline-step-name",
                    [
                        {
                            content: [
                                "pipelines:",
                                "  default:",
                                "    - step: { name: inline, script: ['npm test'] }",
                            ].join("\n"),
                            relativePath: "bitbucket-pipelines.yaml",
                        },
                    ]
                ),
                name: "accepts inline step declarations that include name on the step line",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-step-name",
                    "valid-no-step-blocks",
                    [
                        {
                            content: [
                                "pipelines:",
                                "  branches:",
                                "    main: []",
                            ].join("\n"),
                            relativePath: "bitbucket-pipelines.yml",
                        },
                    ]
                ),
                name: "skips configs that do not contain any step blocks",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-step-name",
                    "valid-step-name-after-comment",
                    [
                        {
                            content: [
                                "pipelines:",
                                "  default:",
                                "    - step:",
                                "        # helpful label follows",
                                "        name: commented-name-case",
                                "        script:",
                                "          - npm test",
                            ].join("\n"),
                            relativePath: "bitbucket-pipelines.yml",
                        },
                    ]
                ),
                name: "accepts step names that appear after comment lines inside the step block",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-step-name",
                    "valid-no-pipelines-file",
                    []
                ),
                name: "skips when no Bitbucket pipelines file exists",
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
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-pull-requests-target-branches",
                    "valid-no-pull-requests-heading",
                    [
                        {
                            content: [
                                "pipelines:",
                                "  branches:",
                                "    main:",
                                "      - step:",
                                "          name: build",
                                "          script:",
                                "            - npm test",
                            ].join("\n"),
                            relativePath: "bitbucket-pipelines.yml",
                        },
                    ]
                ),
                name: "skips configs that do not define a pull-requests block",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-pull-requests-target-branches",
                    "valid-pull-requests-with-comments",
                    [
                        {
                            content: [
                                "pipelines:",
                                "  pull-requests:",
                                "    # shared rule",
                                '    "release/*":',
                                "      - step:",
                                "          name: validate release pull requests",
                                "          script:",
                                "            - npm test",
                            ].join("\n"),
                            relativePath: "bitbucket-pipelines.yml",
                        },
                    ]
                ),
                name: "accepts pull-request target branches even with intervening comments",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-pull-requests-target-branches",
                    "valid-non-trigger-file",
                    [
                        {
                            content: ["pipelines:", "  pull-requests:"].join(
                                "\n"
                            ),
                            relativePath: "bitbucket-pipelines.yml",
                        },
                    ],
                    "src/index.ts"
                ),
                name: "skips evaluation when linting a non-trigger file",
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
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dependabot-reviewers",
                    "valid-assignees-and-yaml-extension",
                    [
                        {
                            content: [
                                "version: 2",
                                "updates:",
                                "  - package-ecosystem: npm",
                                "    directory: /",
                                "    schedule:",
                                "      interval: weekly",
                                "    assignees:",
                                "      - octocat",
                            ].join("\n"),
                            relativePath: ".github/dependabot.yaml",
                        },
                    ]
                ),
                name: "accepts dependabot yaml with assignees only",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dependabot-reviewers",
                    "valid-no-dependabot-config",
                    []
                ),
                name: "skips when no dependabot config file exists",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dependabot-reviewers",
                    "valid-non-trigger-file",
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
                    ],
                    "src/index.ts"
                ),
                name: "skips evaluation when linting a non-trigger file",
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
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-dispatch",
                    "valid-inline-on-trigger",
                    [
                        {
                            content: [
                                "name: CI",
                                "on: [push, workflow_dispatch]",
                                "jobs:",
                                "  test:",
                                "    runs-on: ubuntu-latest",
                                "    steps:",
                                "      - run: npm test",
                            ].join("\n"),
                            relativePath: ".forgejo/workflows/ci.yaml",
                        },
                    ]
                ),
                name: "accepts inline on: declarations that include workflow_dispatch",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-dispatch",
                    "valid-list-item-trigger",
                    [
                        {
                            content: [
                                "name: CI",
                                "on:",
                                "  - push",
                                "  - workflow_dispatch",
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
                name: "accepts workflow_dispatch declared as a list item",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-dispatch",
                    "valid-no-workflow-directory",
                    []
                ),
                name: "skips when no Forgejo workflow directory exists",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-dispatch",
                    "valid-non-trigger-file",
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
                            relativePath: ".forgejo/workflows/ci.yml",
                        },
                    ],
                    "src/index.ts"
                ),
                name: "skips evaluation for non-trigger files even when workflows are missing workflow_dispatch",
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

ruleTester.run(
    "require-aws-amplify-artifacts-base-directory",
    getPluginRule("require-aws-amplify-artifacts-base-directory"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [
                    {
                        messageId: "missingAwsAmplifyArtifactsBaseDirectory",
                    },
                ],
                filename: writeFixtureRepo(
                    "require-aws-amplify-artifacts-base-directory",
                    "invalid-missing-base-directory",
                    [
                        {
                            content: [
                                "version: 1",
                                "frontend:",
                                "  phases:",
                                "    build:",
                                "      commands:",
                                "        - npm run build",
                                "  artifacts:",
                                "    files:",
                                "      - '**/*'",
                            ].join("\n"),
                            relativePath: "amplify.yml",
                        },
                    ]
                ),
                name: "reports Amplify specs that omit artifacts.baseDirectory",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-aws-amplify-artifacts-base-directory",
                    "valid-base-directory-present",
                    [
                        {
                            content: [
                                "version: 1",
                                "frontend:",
                                "  artifacts:",
                                "    baseDirectory: dist",
                                "    files:",
                                "      - '**/*'",
                            ].join("\n"),
                            relativePath: "amplify.yml",
                        },
                    ]
                ),
                name: "accepts Amplify specs with artifacts.baseDirectory",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-aws-amplify-artifacts-base-directory",
                    "valid-no-amplify-config",
                    []
                ),
                name: "skips the rule when Amplify config is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-azure-pipelines-pr-trigger",
    getPluginRule("require-azure-pipelines-pr-trigger"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingAzurePipelinesPrTrigger" }],
                filename: writeFixtureRepo(
                    "require-azure-pipelines-pr-trigger",
                    "invalid-push-only",
                    [
                        {
                            content: [
                                "trigger:",
                                "  branches:",
                                "    include:",
                                "      - main",
                            ].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "reports Azure Pipelines configs without a pr trigger",
            },
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingAzurePipelinesPrTrigger" }],
                filename: writeFixtureRepo(
                    "require-azure-pipelines-pr-trigger",
                    "invalid-pr-none",
                    [
                        {
                            content: [
                                "trigger:",
                                "  - main",
                                "pr: none",
                            ].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "reports Azure Pipelines configs that explicitly disable pr validation",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-pr-trigger",
                    "valid-root-pr",
                    [
                        {
                            content: [
                                "trigger:",
                                "  - main",
                                "pr:",
                                "  branches:",
                                "    include:",
                                "      - main",
                            ].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "accepts Azure Pipelines configs with a root pr trigger block",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-pr-trigger",
                    "valid-no-azure-config",
                    []
                ),
                name: "skips the rule when azure-pipelines.yml is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-google-cloud-build-timeout",
    getPluginRule("require-google-cloud-build-timeout"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingGoogleCloudBuildTimeout" }],
                filename: writeFixtureRepo(
                    "require-google-cloud-build-timeout",
                    "invalid-missing-timeout",
                    [
                        {
                            content: [
                                "steps:",
                                "  - name: gcr.io/cloud-builders/npm",
                                "    args: ['test']",
                            ].join("\n"),
                            relativePath: "cloudbuild.yaml",
                        },
                    ]
                ),
                name: "reports Cloud Build configs without a root timeout",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-timeout",
                    "valid-root-timeout",
                    [
                        {
                            content: [
                                "timeout: 1200s",
                                "steps:",
                                "  - name: gcr.io/cloud-builders/npm",
                                "    args: ['test']",
                            ].join("\n"),
                            relativePath: "cloudbuild.yaml",
                        },
                    ]
                ),
                name: "accepts Cloud Build configs with an explicit timeout",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-timeout",
                    "valid-no-cloudbuild-config",
                    []
                ),
                name: "skips the rule when cloudbuild.yaml is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-dockerignore-file",
    getPluginRule("require-dockerignore-file"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingDockerignoreFile" }],
                filename: writeFixtureRepo(
                    "require-dockerignore-file",
                    "invalid-missing-dockerignore",
                    [
                        {
                            content: [
                                "FROM node:22-alpine",
                                "WORKDIR /app",
                                "COPY . .",
                                "RUN npm ci",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "reports repositories with a Dockerfile but no .dockerignore",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerignore-file",
                    "valid-dockerignore-present",
                    [
                        {
                            content: [
                                "FROM node:22-alpine",
                                "WORKDIR /app",
                                "COPY . .",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                        {
                            content: [
                                "node_modules",
                                ".git",
                                ".env",
                            ].join("\n"),
                            relativePath: ".dockerignore",
                        },
                    ]
                ),
                name: "accepts repositories that pair Dockerfile with .dockerignore",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerignore-file",
                    "valid-no-dockerfile",
                    []
                ),
                name: "skips the rule when Dockerfile is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-netlify-build-publish-directory",
    getPluginRule("require-netlify-build-publish-directory"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingNetlifyBuildPublishDirectory" }],
                filename: writeFixtureRepo(
                    "require-netlify-build-publish-directory",
                    "invalid-missing-publish",
                    [
                        {
                            content: [
                                "[build]",
                                '  command = "npm run build"',
                            ].join("\n"),
                            relativePath: "netlify.toml",
                        },
                    ]
                ),
                name: "reports netlify.toml files that omit publish output configuration",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-netlify-build-publish-directory",
                    "valid-build-publish",
                    [
                        {
                            content: [
                                "[build]",
                                '  command = "npm run build"',
                                '  publish = "dist"',
                            ].join("\n"),
                            relativePath: "netlify.toml",
                        },
                    ]
                ),
                name: "accepts netlify.toml files with an explicit publish directory",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-netlify-build-publish-directory",
                    "valid-no-netlify-config",
                    []
                ),
                name: "skips the rule when netlify.toml is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-aws-amplify-artifacts-files",
    getPluginRule("require-aws-amplify-artifacts-files"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingAwsAmplifyArtifactsFiles" }],
                filename: writeFixtureRepo(
                    "require-aws-amplify-artifacts-files",
                    "invalid-missing-artifacts-files",
                    [
                        {
                            content: [
                                "version: 1",
                                "frontend:",
                                "  artifacts:",
                                "    baseDirectory: dist",
                            ].join("\n"),
                            relativePath: "amplify.yml",
                        },
                    ]
                ),
                name: "reports Amplify specs that omit artifacts.files",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-aws-amplify-artifacts-files",
                    "valid-artifacts-files-present",
                    [
                        {
                            content: [
                                "version: 1",
                                "frontend:",
                                "  artifacts:",
                                "    baseDirectory: dist",
                                "    files:",
                                "      - '**/*'",
                            ].join("\n"),
                            relativePath: "amplify.yml",
                        },
                    ]
                ),
                name: "accepts Amplify specs with artifacts.files",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-aws-amplify-artifacts-files",
                    "valid-no-amplify-config",
                    []
                ),
                name: "skips the rule when Amplify config is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-azure-pipelines-trigger",
    getPluginRule("require-azure-pipelines-trigger"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingAzurePipelinesTrigger" }],
                filename: writeFixtureRepo(
                    "require-azure-pipelines-trigger",
                    "invalid-trigger-none",
                    [
                        {
                            content: [
                                "trigger: none",
                                "pr:",
                                "  - main",
                            ].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "reports Azure Pipelines configs that disable trigger",
            },
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingAzurePipelinesTrigger" }],
                filename: writeFixtureRepo(
                    "require-azure-pipelines-trigger",
                    "invalid-no-trigger",
                    [
                        {
                            content: ["pr:", "  - main"].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "reports Azure Pipelines configs that omit trigger",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-trigger",
                    "valid-trigger-present",
                    [
                        {
                            content: [
                                "trigger:",
                                "  branches:",
                                "    include:",
                                "      - main",
                                "pr:",
                                "  branches:",
                                "    include:",
                                "      - main",
                            ].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "accepts Azure Pipelines configs with trigger",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-trigger",
                    "valid-no-azure-config",
                    []
                ),
                name: "skips the rule when azure-pipelines config is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-google-cloud-build-steps",
    getPluginRule("require-google-cloud-build-steps"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingGoogleCloudBuildSteps" }],
                filename: writeFixtureRepo(
                    "require-google-cloud-build-steps",
                    "invalid-no-steps",
                    [
                        {
                            content: ["timeout: 1200s"].join("\n"),
                            relativePath: "cloudbuild.yaml",
                        },
                    ]
                ),
                name: "reports Cloud Build configs that omit root steps",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-steps",
                    "valid-root-steps",
                    [
                        {
                            content: [
                                "timeout: 1200s",
                                "steps:",
                                "  - name: gcr.io/cloud-builders/npm",
                                "    args: ['test']",
                            ].join("\n"),
                            relativePath: "cloudbuild.yaml",
                        },
                    ]
                ),
                name: "accepts Cloud Build configs with root steps",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-steps",
                    "valid-no-cloudbuild-config",
                    []
                ),
                name: "skips the rule when cloudbuild config is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-dockerfile-base-image-tag",
    getPluginRule("require-dockerfile-base-image-tag"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "unpinnedDockerBaseImageTag" }],
                filename: writeFixtureRepo(
                    "require-dockerfile-base-image-tag",
                    "invalid-latest-tag",
                    [
                        {
                            content: ["FROM node:latest", "WORKDIR /app"].join(
                                "\n"
                            ),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "reports Dockerfile base image refs using latest",
            },
            {
                code: lintTargetSource,
                errors: [{ messageId: "unpinnedDockerBaseImageTag" }],
                filename: writeFixtureRepo(
                    "require-dockerfile-base-image-tag",
                    "invalid-missing-tag",
                    [
                        {
                            content: ["FROM alpine", "RUN echo ok"].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "reports Dockerfile base image refs without explicit tag",
            },
            {
                code: lintTargetSource,
                errors: [{ messageId: "unpinnedDockerBaseImageTag" }],
                filename: writeFixtureRepo(
                    "require-dockerfile-base-image-tag",
                    "invalid-platform-latest-tag",
                    [
                        {
                            content: [
                                "FROM --platform=linux/amd64 node:latest",
                                "RUN node --version",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "reports latest tags even when FROM includes a platform prefix",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-base-image-tag",
                    "valid-non-latest-tag",
                    [
                        {
                            content: [
                                "FROM node:22-alpine",
                                "WORKDIR /app",
                                "RUN npm ci",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "accepts Dockerfile base image refs pinned to non-latest tags",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-base-image-tag",
                    "valid-sha-digest",
                    [
                        {
                            content: [
                                "FROM node@sha256:3bd1a55f74be0d8a2fcb4a00e95e26ef9642f2f957f725622f4c5d6c73ab8cf8",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "accepts Dockerfile base image refs pinned by digest",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-base-image-tag",
                    "valid-scratch-base-image",
                    [
                        {
                            content: ["FROM scratch", "ADD hello /hello"].join(
                                "\n"
                            ),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "accepts scratch base images",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-base-image-tag",
                    "valid-variable-base-image",
                    [
                        {
                            content: [
                                "ARG BASE_IMAGE=node:22-alpine",
                                // eslint-disable-next-line no-template-curly-in-string
                                "FROM ${BASE_IMAGE}",
                                "RUN node --version",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "accepts variable-driven base image references",
            },
        ],
    }
);

ruleTester.run(
    "require-vercel-build-command",
    getPluginRule("require-vercel-build-command"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingVercelBuildCommand" }],
                filename: writeFixtureRepo(
                    "require-vercel-build-command",
                    "invalid-missing-build-command",
                    [
                        {
                            content: JSON.stringify(
                                { cleanUrls: true },
                                null,
                                2
                            ),
                            relativePath: "vercel.json",
                        },
                    ]
                ),
                name: "reports Vercel config without buildCommand",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-vercel-build-command",
                    "valid-build-command-present",
                    [
                        {
                            content: JSON.stringify(
                                {
                                    buildCommand: "npm run build",
                                },
                                null,
                                2
                            ),
                            relativePath: "vercel.json",
                        },
                    ]
                ),
                name: "accepts Vercel config with non-empty buildCommand",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-vercel-build-command",
                    "valid-no-vercel-config",
                    []
                ),
                name: "skips the rule when vercel config is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-netlify-build-command",
    getPluginRule("require-netlify-build-command"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingNetlifyBuildCommand" }],
                filename: writeFixtureRepo(
                    "require-netlify-build-command",
                    "invalid-missing-command",
                    [
                        {
                            content: ["[build]", '  publish = "dist"'].join(
                                "\n"
                            ),
                            relativePath: "netlify.toml",
                        },
                    ]
                ),
                name: "reports netlify config that omits build command",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-netlify-build-command",
                    "valid-command-present",
                    [
                        {
                            content: [
                                "[build]",
                                '  command = "npm run build"',
                                '  publish = "dist"',
                            ].join("\n"),
                            relativePath: "netlify.toml",
                        },
                    ]
                ),
                name: "accepts netlify config with explicit build command",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-netlify-build-command",
                    "valid-no-netlify-config",
                    []
                ),
                name: "skips the rule when netlify config is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-digitalocean-app-spec-region",
    getPluginRule("require-digitalocean-app-spec-region"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingDigitalOceanAppSpecRegion" }],
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-region",
                    "invalid-missing-region",
                    [
                        {
                            content: [
                                "name: example-app",
                                "services:",
                                "  - name: web",
                            ].join("\n"),
                            relativePath: ".do/app.yaml",
                        },
                    ]
                ),
                name: "reports DigitalOcean app specs that omit root region",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-region",
                    "valid-region-present",
                    [
                        {
                            content: [
                                "name: example-app",
                                "region: nyc",
                                "services:",
                                "  - name: web",
                            ].join("\n"),
                            relativePath: ".do/app.yaml",
                        },
                    ]
                ),
                name: "accepts DigitalOcean app specs with explicit region",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-region",
                    "valid-no-app-spec",
                    []
                ),
                name: "skips the rule when DigitalOcean app spec is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-aws-amplify-build-commands",
    getPluginRule("require-aws-amplify-build-commands"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingAwsAmplifyBuildCommands" }],
                filename: writeFixtureRepo(
                    "require-aws-amplify-build-commands",
                    "invalid-missing-build-commands",
                    [
                        {
                            content: [
                                "version: 1",
                                "frontend:",
                                "  phases:",
                                "    build:",
                                "      cache:",
                                "        paths:",
                                "          - node_modules/**/*",
                            ].join("\n"),
                            relativePath: "amplify.yml",
                        },
                    ]
                ),
                name: "reports Amplify specs that omit build.commands",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-aws-amplify-build-commands",
                    "valid-build-commands-present",
                    [
                        {
                            content: [
                                "version: 1",
                                "frontend:",
                                "  phases:",
                                "    build:",
                                "      commands:",
                                "        - npm run build",
                            ].join("\n"),
                            relativePath: "amplify.yml",
                        },
                    ]
                ),
                name: "accepts Amplify specs with build.commands",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-aws-amplify-build-commands",
                    "valid-no-amplify-config",
                    []
                ),
                name: "skips the rule when Amplify config is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-azure-pipelines-pr-branches",
    getPluginRule("require-azure-pipelines-pr-branches"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingAzurePipelinesPrBranches" }],
                filename: writeFixtureRepo(
                    "require-azure-pipelines-pr-branches",
                    "invalid-pr-without-branches",
                    [
                        {
                            content: ["pr:", "  autoCancel: true"].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "reports Azure Pipelines pr blocks without branch filters",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-pr-branches",
                    "valid-pr-branches-block",
                    [
                        {
                            content: [
                                "pr:",
                                "  branches:",
                                "    include:",
                                "      - main",
                            ].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "accepts Azure Pipelines pr branch filters",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-pr-branches",
                    "valid-inline-pr-value",
                    [
                        {
                            content: ["pr: [main]"].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "accepts Azure Pipelines inline PR trigger values",
            },
        ],
    }
);

ruleTester.run(
    "require-google-cloud-build-step-name",
    getPluginRule("require-google-cloud-build-step-name"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingGoogleCloudBuildStepName" }],
                filename: writeFixtureRepo(
                    "require-google-cloud-build-step-name",
                    "invalid-steps-without-name",
                    [
                        {
                            content: [
                                "steps:",
                                "  - id: test",
                                "    args: ['test']",
                            ].join("\n"),
                            relativePath: "cloudbuild.yaml",
                        },
                    ]
                ),
                name: "reports Cloud Build configs lacking named steps",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-step-name",
                    "valid-step-name-present",
                    [
                        {
                            content: [
                                "steps:",
                                "  - name: gcr.io/cloud-builders/npm",
                                "    args: ['test']",
                            ].join("\n"),
                            relativePath: "cloudbuild.yaml",
                        },
                    ]
                ),
                name: "accepts Cloud Build configs with named steps",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-step-name",
                    "valid-no-cloudbuild-config",
                    []
                ),
                name: "skips the rule when cloudbuild config is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-dockerfile-user",
    getPluginRule("require-dockerfile-user"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingDockerfileUserInstruction" }],
                filename: writeFixtureRepo(
                    "require-dockerfile-user",
                    "invalid-missing-user",
                    [
                        {
                            content: [
                                "FROM node:22-alpine",
                                "WORKDIR /app",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "reports Dockerfiles without explicit USER instruction",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-user",
                    "valid-user-present",
                    [
                        {
                            content: [
                                "FROM node:22-alpine",
                                "WORKDIR /app",
                                "USER node",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "accepts Dockerfiles with explicit USER instruction",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-user",
                    "valid-no-dockerfile",
                    []
                ),
                name: "skips the rule when Dockerfile is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-vercel-schema",
    getPluginRule("require-vercel-schema"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingVercelSchemaProperty" }],
                filename: writeFixtureRepo(
                    "require-vercel-schema",
                    "invalid-missing-schema",
                    [
                        {
                            content: JSON.stringify(
                                { cleanUrls: true },
                                null,
                                2
                            ),
                            relativePath: "vercel.json",
                        },
                    ]
                ),
                name: "reports Vercel config without $schema",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-vercel-schema",
                    "valid-schema-present",
                    [
                        {
                            content: JSON.stringify(
                                {
                                    $schema:
                                        "https://openapi.vercel.sh/vercel.json",
                                    cleanUrls: true,
                                },
                                null,
                                2
                            ),
                            relativePath: "vercel.json",
                        },
                    ]
                ),
                name: "accepts Vercel config with schema metadata",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-vercel-schema",
                    "valid-no-vercel-config",
                    []
                ),
                name: "skips the rule when vercel config is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-netlify-build-section",
    getPluginRule("require-netlify-build-section"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingNetlifyBuildSection" }],
                filename: writeFixtureRepo(
                    "require-netlify-build-section",
                    "invalid-no-build-section",
                    [
                        {
                            content: ["[redirects]", '  from = "/*"'].join(
                                "\n"
                            ),
                            relativePath: "netlify.toml",
                        },
                    ]
                ),
                name: "reports netlify config without [build] section",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-netlify-build-section",
                    "valid-build-section-present",
                    [
                        {
                            content: [
                                "[build]",
                                '  command = "npm run build"',
                                '  publish = "dist"',
                            ].join("\n"),
                            relativePath: "netlify.toml",
                        },
                    ]
                ),
                name: "accepts netlify config with [build] section",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-netlify-build-section",
                    "valid-no-netlify-config",
                    []
                ),
                name: "skips the rule when netlify config is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-digitalocean-app-spec-component",
    getPluginRule("require-digitalocean-app-spec-component"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingDigitalOceanAppSpecComponent" }],
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-component",
                    "invalid-no-components",
                    [
                        {
                            content: ["name: demo", "region: nyc"].join("\n"),
                            relativePath: ".do/app.yaml",
                        },
                    ]
                ),
                name: "reports DigitalOcean app specs without component blocks",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-component",
                    "valid-services-component",
                    [
                        {
                            content: [
                                "name: demo",
                                "region: nyc",
                                "services:",
                                "  - name: web",
                            ].join("\n"),
                            relativePath: ".do/app.yaml",
                        },
                    ]
                ),
                name: "accepts DigitalOcean app specs with services block",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-component",
                    "valid-no-app-spec",
                    []
                ),
                name: "skips the rule when DigitalOcean app spec is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-aws-amplify-version",
    getPluginRule("require-aws-amplify-version"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingAwsAmplifyVersion" }],
                filename: writeFixtureRepo(
                    "require-aws-amplify-version",
                    "invalid-no-version",
                    [
                        {
                            content: [
                                "frontend:",
                                "  phases:",
                                "    build:",
                                "      commands:",
                                "        - npm run build",
                            ].join("\n"),
                            relativePath: "amplify.yml",
                        },
                    ]
                ),
                name: "reports Amplify configs missing top-level version",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-aws-amplify-version",
                    "valid-version-present",
                    [
                        {
                            content: [
                                "version: 1",
                                "frontend:",
                                "  phases:",
                                "    build:",
                                "      commands:",
                                "        - npm run build",
                            ].join("\n"),
                            relativePath: "amplify.yml",
                        },
                    ]
                ),
                name: "accepts Amplify configs with explicit version",
            },
        ],
    }
);

ruleTester.run(
    "require-azure-pipelines-execution-plan",
    getPluginRule("require-azure-pipelines-execution-plan"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingAzurePipelinesExecutionPlan" }],
                filename: writeFixtureRepo(
                    "require-azure-pipelines-execution-plan",
                    "invalid-no-jobs-stages-steps",
                    [
                        {
                            content: ["trigger:", "  - main"].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "reports Azure Pipelines configs missing execution plan keys",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-execution-plan",
                    "valid-jobs-key-present",
                    [
                        {
                            content: [
                                "jobs:",
                                "  - job: test",
                                "    steps:",
                                "      - script: npm test",
                            ].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "accepts Azure Pipelines configs with jobs key",
            },
        ],
    }
);

ruleTester.run(
    "require-google-cloud-build-timeout-format",
    getPluginRule("require-google-cloud-build-timeout-format"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "invalidGoogleCloudBuildTimeoutFormat" }],
                filename: writeFixtureRepo(
                    "require-google-cloud-build-timeout-format",
                    "invalid-timeout-format",
                    [
                        {
                            content: [
                                "timeout: 20m",
                                "steps:",
                                "  - name: test",
                            ].join("\n"),
                            relativePath: "cloudbuild.yaml",
                        },
                    ]
                ),
                name: "reports Cloud Build timeout values that are not in seconds",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-timeout-format",
                    "valid-timeout-format",
                    [
                        {
                            content: [
                                "timeout: 1200s",
                                "steps:",
                                "  - name: gcr.io/cloud-builders/npm",
                            ].join("\n"),
                            relativePath: "cloudbuild.yaml",
                        },
                    ]
                ),
                name: "accepts Cloud Build timeout values in explicit seconds",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-timeout-format",
                    "valid-no-timeout-key",
                    [
                        {
                            content: [
                                "steps:",
                                "  - name: gcr.io/cloud-builders/npm",
                            ].join("\n"),
                            relativePath: "cloudbuild.yaml",
                        },
                    ]
                ),
                name: "passes when timeout key is absent (existence enforced by require-google-cloud-build-timeout)",
            },
        ],
    }
);

ruleTester.run(
    "require-dockerfile-workdir",
    getPluginRule("require-dockerfile-workdir"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingDockerfileWorkdir" }],
                filename: writeFixtureRepo(
                    "require-dockerfile-workdir",
                    "invalid-no-workdir",
                    [
                        {
                            content: ["FROM node:22-alpine", "RUN npm ci"].join(
                                "\n"
                            ),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "reports Dockerfiles missing WORKDIR instruction",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-workdir",
                    "valid-workdir-present",
                    [
                        {
                            content: [
                                "FROM node:22-alpine",
                                "WORKDIR /app",
                                "RUN npm ci",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "accepts Dockerfiles with explicit WORKDIR",
            },
        ],
    }
);

ruleTester.run(
    "require-vercel-valid-json",
    getPluginRule("require-vercel-valid-json"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "invalidVercelJson" }],
                filename: writeFixtureRepo(
                    "require-vercel-valid-json",
                    "invalid-json-syntax",
                    [
                        {
                            content: '{"buildCommand": "npm run build",}',
                            relativePath: "vercel.json",
                        },
                    ]
                ),
                name: "reports vercel.json files with invalid JSON syntax",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-vercel-valid-json",
                    "valid-json",
                    [
                        {
                            content: JSON.stringify(
                                {
                                    buildCommand: "npm run build",
                                },
                                null,
                                2
                            ),
                            relativePath: "vercel.json",
                        },
                    ]
                ),
                name: "accepts vercel.json files with valid JSON",
            },
        ],
    }
);

ruleTester.run(
    "require-netlify-publish-relative-path",
    getPluginRule("require-netlify-publish-relative-path"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "absoluteNetlifyPublishPath" }],
                filename: writeFixtureRepo(
                    "require-netlify-publish-relative-path",
                    "invalid-absolute-publish-path",
                    [
                        {
                            content: ["[build]", '  publish = "/dist"'].join(
                                "\n"
                            ),
                            relativePath: "netlify.toml",
                        },
                    ]
                ),
                name: "reports absolute Netlify publish directories",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-netlify-publish-relative-path",
                    "valid-relative-publish-path",
                    [
                        {
                            content: ["[build]", '  publish = "dist"'].join(
                                "\n"
                            ),
                            relativePath: "netlify.toml",
                        },
                    ]
                ),
                name: "accepts relative Netlify publish directories",
            },
        ],
    }
);

ruleTester.run(
    "require-digitalocean-app-spec-name",
    getPluginRule("require-digitalocean-app-spec-name"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingDigitalOceanAppSpecName" }],
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-name",
                    "invalid-missing-name",
                    [
                        {
                            content: [
                                "region: nyc",
                                "services:",
                                "  - name: web",
                            ].join("\n"),
                            relativePath: ".do/app.yaml",
                        },
                    ]
                ),
                name: "reports DigitalOcean app specs missing top-level name",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-name",
                    "valid-name-present",
                    [
                        {
                            content: [
                                "name: demo-app",
                                "region: nyc",
                                "services:",
                                "  - name: web",
                            ].join("\n"),
                            relativePath: ".do/app.yaml",
                        },
                    ]
                ),
                name: "accepts DigitalOcean app specs with top-level name",
            },
        ],
    }
);

ruleTester.run(
    "require-aws-amplify-artifacts-base-directory-relative-path",
    getPluginRule("require-aws-amplify-artifacts-base-directory-relative-path"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [
                    {
                        messageId:
                            "absoluteAwsAmplifyArtifactsBaseDirectoryRelativePath",
                    },
                ],
                filename: writeFixtureRepo(
                    "require-aws-amplify-artifacts-base-directory-relative-path",
                    "invalid-absolute-base-directory",
                    [
                        {
                            content: [
                                "version: 1",
                                "frontend:",
                                "  artifacts:",
                                "    baseDirectory: /dist",
                            ].join("\n"),
                            relativePath: "amplify.yml",
                        },
                    ]
                ),
                name: "reports absolute Amplify artifacts base directory values",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-aws-amplify-artifacts-base-directory-relative-path",
                    "valid-relative-base-directory",
                    [
                        {
                            content: [
                                "version: 1",
                                "frontend:",
                                "  artifacts:",
                                "    baseDirectory: dist",
                            ].join("\n"),
                            relativePath: "amplify.yml",
                        },
                    ]
                ),
                name: "accepts relative Amplify artifacts base directory values",
            },
        ],
    }
);

ruleTester.run(
    "require-azure-pipelines-name",
    getPluginRule("require-azure-pipelines-name"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingAzurePipelinesName" }],
                filename: writeFixtureRepo(
                    "require-azure-pipelines-name",
                    "invalid-missing-name",
                    [
                        {
                            content: ["trigger:", "  - main"].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "reports Azure Pipelines config without top-level name",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-name",
                    "valid-name-present",
                    [
                        {
                            content: [
                                "name: CI",
                                "trigger:",
                                "  - main",
                                "jobs:",
                                "  - job: test",
                                "    steps:",
                                "      - script: npm test",
                            ].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "accepts Azure Pipelines config with top-level name",
            },
        ],
    }
);

ruleTester.run(
    "require-google-cloud-build-timeout-positive",
    getPluginRule("require-google-cloud-build-timeout-positive"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "nonPositiveGoogleCloudBuildTimeout" }],
                filename: writeFixtureRepo(
                    "require-google-cloud-build-timeout-positive",
                    "invalid-zero-timeout",
                    [
                        {
                            content: [
                                "timeout: 0s",
                                "steps:",
                                "  - name: gcr.io/cloud-builders/npm",
                            ].join("\n"),
                            relativePath: "cloudbuild.yaml",
                        },
                    ]
                ),
                name: "reports non-positive Cloud Build timeout values",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-timeout-positive",
                    "valid-positive-timeout",
                    [
                        {
                            content: [
                                "timeout: 60s",
                                "steps:",
                                "  - name: gcr.io/cloud-builders/npm",
                            ].join("\n"),
                            relativePath: "cloudbuild.yaml",
                        },
                    ]
                ),
                name: "accepts positive Cloud Build timeout values",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-timeout-positive",
                    "valid-no-timeout-key",
                    [
                        {
                            content: [
                                "steps:",
                                "  - name: gcr.io/cloud-builders/npm",
                            ].join("\n"),
                            relativePath: "cloudbuild.yaml",
                        },
                    ]
                ),
                name: "passes when timeout key is absent (existence enforced by require-google-cloud-build-timeout)",
            },
        ],
    }
);

ruleTester.run(
    "require-dockerfile-cmd-or-entrypoint",
    getPluginRule("require-dockerfile-cmd-or-entrypoint"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingDockerfileCmdOrEntrypoint" }],
                filename: writeFixtureRepo(
                    "require-dockerfile-cmd-or-entrypoint",
                    "invalid-missing-startup-instruction",
                    [
                        {
                            content: [
                                "FROM node:22-alpine",
                                "WORKDIR /app",
                                "RUN npm ci",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "reports Dockerfiles missing CMD and ENTRYPOINT",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-cmd-or-entrypoint",
                    "valid-cmd-present",
                    [
                        {
                            content: [
                                "FROM node:22-alpine",
                                "WORKDIR /app",
                                'CMD ["node", "server.js"]',
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "accepts Dockerfiles with CMD instruction",
            },
        ],
    }
);

ruleTester.run(
    "require-vercel-config-object",
    getPluginRule("require-vercel-config-object"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "nonObjectVercelConfig" }],
                filename: writeFixtureRepo(
                    "require-vercel-config-object",
                    "invalid-array-config",
                    [
                        {
                            content: "[]",
                            relativePath: "vercel.json",
                        },
                    ]
                ),
                name: "reports non-object vercel config documents",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-vercel-config-object",
                    "valid-object-config",
                    [
                        {
                            content: JSON.stringify(
                                {
                                    buildCommand: "npm run build",
                                },
                                null,
                                2
                            ),
                            relativePath: "vercel.json",
                        },
                    ]
                ),
                name: "accepts object-based vercel config documents",
            },
        ],
    }
);

ruleTester.run(
    "require-netlify-build-command-non-empty",
    getPluginRule("require-netlify-build-command-non-empty"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingOrEmptyNetlifyBuildCommand" }],
                filename: writeFixtureRepo(
                    "require-netlify-build-command-non-empty",
                    "invalid-empty-command",
                    [
                        {
                            content: [
                                "[build]",
                                '  command = ""',
                                '  publish = "dist"',
                            ].join("\n"),
                            relativePath: "netlify.toml",
                        },
                    ]
                ),
                name: "reports empty Netlify build command values",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-netlify-build-command-non-empty",
                    "valid-non-empty-command",
                    [
                        {
                            content: [
                                "[build]",
                                '  command = "npm run build"',
                                '  publish = "dist"',
                            ].join("\n"),
                            relativePath: "netlify.toml",
                        },
                    ]
                ),
                name: "accepts non-empty Netlify build command values",
            },
        ],
    }
);

ruleTester.run(
    "require-digitalocean-app-spec-region-value",
    getPluginRule("require-digitalocean-app-spec-region-value"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [
                    { messageId: "missingDigitalOceanAppSpecRegionValue" },
                ],
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-region-value",
                    "invalid-empty-region-value",
                    [
                        {
                            content: [
                                "name: demo-app",
                                "region:",
                                "services:",
                                "  - name: web",
                            ].join("\n"),
                            relativePath: ".do/app.yaml",
                        },
                    ]
                ),
                name: "reports DigitalOcean app specs with empty region values",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-region-value",
                    "valid-region-value",
                    [
                        {
                            content: [
                                "name: demo-app",
                                "region: nyc",
                                "services:",
                                "  - name: web",
                            ].join("\n"),
                            relativePath: ".do/app.yaml",
                        },
                    ]
                ),
                name: "accepts DigitalOcean app specs with non-empty region values",
            },
        ],
    }
);

ruleTester.run(
    "require-aws-amplify-version-value",
    getPluginRule("require-aws-amplify-version-value"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "invalidAwsAmplifyVersionValue" }],
                filename: writeFixtureRepo(
                    "require-aws-amplify-version-value",
                    "invalid-version-2",
                    [
                        {
                            content: [
                                "version: 2",
                                "frontend:",
                                "  phases:",
                                "    build:",
                                "      commands:",
                                "        - npm run build",
                            ].join("\n"),
                            relativePath: "amplify.yml",
                        },
                    ]
                ),
                name: "reports unsupported Amplify version values",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-aws-amplify-version-value",
                    "valid-version-1",
                    [
                        {
                            content: [
                                "version: 1",
                                "frontend:",
                                "  phases:",
                                "    build:",
                                "      commands:",
                                "        - npm run build",
                            ].join("\n"),
                            relativePath: "amplify.yml",
                        },
                    ]
                ),
                name: "accepts supported Amplify version values",
            },
        ],
    }
);

ruleTester.run(
    "require-azure-pipelines-trigger-branches",
    getPluginRule("require-azure-pipelines-trigger-branches"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingAzurePipelinesTriggerBranches" }],
                filename: writeFixtureRepo(
                    "require-azure-pipelines-trigger-branches",
                    "invalid-trigger-without-branches",
                    [
                        {
                            content: ["trigger:", "  batch: true"].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "reports trigger blocks without branch filters",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-trigger-branches",
                    "valid-trigger-branches",
                    [
                        {
                            content: [
                                "trigger:",
                                "  branches:",
                                "    include:",
                                "      - main",
                            ].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "accepts trigger blocks with branches filters",
            },
        ],
    }
);

ruleTester.run(
    "require-google-cloud-build-timeout-max",
    getPluginRule("require-google-cloud-build-timeout-max"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "invalidGoogleCloudBuildTimeoutMax" }],
                filename: writeFixtureRepo(
                    "require-google-cloud-build-timeout-max",
                    "invalid-timeout-too-large",
                    [
                        {
                            content: [
                                "timeout: 999999s",
                                "steps:",
                                "  - name: gcr.io/cloud-builders/npm",
                            ].join("\n"),
                            relativePath: "cloudbuild.yaml",
                        },
                    ]
                ),
                name: "reports Cloud Build timeout values above max bound",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-timeout-max",
                    "valid-timeout-bound",
                    [
                        {
                            content: [
                                "timeout: 3600s",
                                "steps:",
                                "  - name: gcr.io/cloud-builders/npm",
                            ].join("\n"),
                            relativePath: "cloudbuild.yaml",
                        },
                    ]
                ),
                name: "accepts Cloud Build timeout values within max bound",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-timeout-max",
                    "valid-no-timeout-key",
                    [
                        {
                            content: [
                                "steps:",
                                "  - name: gcr.io/cloud-builders/npm",
                            ].join("\n"),
                            relativePath: "cloudbuild.yaml",
                        },
                    ]
                ),
                name: "passes when timeout key is absent (existence enforced by require-google-cloud-build-timeout)",
            },
        ],
    }
);

ruleTester.run(
    "require-dockerfile-from-instruction",
    getPluginRule("require-dockerfile-from-instruction"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingDockerfileFromInstruction" }],
                filename: writeFixtureRepo(
                    "require-dockerfile-from-instruction",
                    "invalid-missing-from",
                    [
                        {
                            content: [
                                "WORKDIR /app",
                                'CMD ["node", "server.js"]',
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "reports Dockerfiles missing FROM instruction",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-from-instruction",
                    "valid-from-present",
                    [
                        {
                            content: [
                                "FROM node:22-alpine",
                                "WORKDIR /app",
                                'CMD ["node", "server.js"]',
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "accepts Dockerfiles with FROM instruction",
            },
        ],
    }
);

ruleTester.run(
    "require-vercel-schema-url",
    getPluginRule("require-vercel-schema-url"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingVercelSchemaUrl" }],
                filename: writeFixtureRepo(
                    "require-vercel-schema-url",
                    "invalid-non-vercel-schema-url",
                    [
                        {
                            content: JSON.stringify(
                                {
                                    $schema: "https://example.com/schema.json",
                                },
                                null,
                                2
                            ),
                            relativePath: "vercel.json",
                        },
                    ]
                ),
                name: "reports schema URLs that are not vercel.json schemas",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-vercel-schema-url",
                    "valid-vercel-schema-url",
                    [
                        {
                            content: JSON.stringify(
                                {
                                    $schema:
                                        "https://openapi.vercel.sh/vercel.json",
                                },
                                null,
                                2
                            ),
                            relativePath: "vercel.json",
                        },
                    ]
                ),
                name: "accepts vercel.json schema URLs",
            },
        ],
    }
);

ruleTester.run(
    "require-netlify-publish-directory-non-empty",
    getPluginRule("require-netlify-publish-directory-non-empty"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [
                    { messageId: "missingOrEmptyNetlifyPublishDirectory" },
                ],
                filename: writeFixtureRepo(
                    "require-netlify-publish-directory-non-empty",
                    "invalid-empty-publish",
                    [
                        {
                            content: [
                                "[build]",
                                '  command = "npm run build"',
                                '  publish = ""',
                            ].join("\n"),
                            relativePath: "netlify.toml",
                        },
                    ]
                ),
                name: "reports empty Netlify publish values",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-netlify-publish-directory-non-empty",
                    "valid-non-empty-publish",
                    [
                        {
                            content: [
                                "[build]",
                                '  command = "npm run build"',
                                '  publish = "dist"',
                            ].join("\n"),
                            relativePath: "netlify.toml",
                        },
                    ]
                ),
                name: "accepts non-empty Netlify publish values",
            },
        ],
    }
);

ruleTester.run(
    "require-digitalocean-app-spec-name-value",
    getPluginRule("require-digitalocean-app-spec-name-value"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingDigitalOceanAppSpecNameValue" }],
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-name-value",
                    "invalid-empty-name",
                    [
                        {
                            content: [
                                "name:",
                                "region: nyc",
                                "services:",
                                "  - name: web",
                            ].join("\n"),
                            relativePath: ".do/app.yaml",
                        },
                    ]
                ),
                name: "reports DigitalOcean app specs with empty name values",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-name-value",
                    "valid-non-empty-name",
                    [
                        {
                            content: [
                                "name: demo-app",
                                "region: nyc",
                                "services:",
                                "  - name: web",
                            ].join("\n"),
                            relativePath: ".do/app.yaml",
                        },
                    ]
                ),
                name: "accepts DigitalOcean app specs with non-empty name values",
            },
        ],
    }
);

ruleTester.run(
    "require-aws-amplify-artifacts-files-non-empty",
    getPluginRule("require-aws-amplify-artifacts-files-non-empty"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [
                    { messageId: "missingAwsAmplifyArtifactsFilesEntries" },
                ],
                filename: writeFixtureRepo(
                    "require-aws-amplify-artifacts-files-non-empty",
                    "invalid-empty-files-list",
                    [
                        {
                            content: [
                                "version: 1",
                                "frontend:",
                                "  artifacts:",
                                "    files:",
                            ].join("\n"),
                            relativePath: "amplify.yml",
                        },
                    ]
                ),
                name: "reports empty Amplify artifacts files list",
            },
            {
                code: lintTargetSource,
                errors: [
                    { messageId: "missingAwsAmplifyArtifactsFilesEntries" },
                ],
                filename: writeFixtureRepo(
                    "require-aws-amplify-artifacts-files-non-empty",
                    "invalid-files-outside-artifacts-block",
                    [
                        {
                            content: [
                                "version: 1",
                                "cache:",
                                "  paths:",
                                "    files:",
                                "      - node_modules/**/*",
                                "frontend:",
                                "  artifacts:",
                                "    baseDirectory: dist",
                            ].join("\n"),
                            relativePath: "amplify.yml",
                        },
                    ]
                ),
                name: "reports files lists that are not under artifacts block",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-aws-amplify-artifacts-files-non-empty",
                    "valid-files-list",
                    [
                        {
                            content: [
                                "version: 1",
                                "frontend:",
                                "  artifacts:",
                                "    files:",
                                "      - '**/*'",
                            ].join("\n"),
                            relativePath: "amplify.yml",
                        },
                    ]
                ),
                name: "accepts non-empty Amplify artifacts files list",
            },
        ],
    }
);

ruleTester.run(
    "require-azure-pipelines-trigger-include-branches",
    getPluginRule("require-azure-pipelines-trigger-include-branches"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [
                    {
                        messageId:
                            "missingAzurePipelinesTriggerIncludeBranches",
                    },
                ],
                filename: writeFixtureRepo(
                    "require-azure-pipelines-trigger-include-branches",
                    "invalid-missing-include-entries",
                    [
                        {
                            content: [
                                "trigger:",
                                "  branches:",
                                "    include:",
                            ].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "reports missing trigger include branch entries",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-trigger-include-branches",
                    "valid-include-entries",
                    [
                        {
                            content: [
                                "trigger:",
                                "  branches:",
                                "    include:",
                                "      - main",
                            ].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "accepts trigger include branch entries",
            },
        ],
    }
);

ruleTester.run(
    "require-google-cloud-build-steps-non-empty",
    getPluginRule("require-google-cloud-build-steps-non-empty"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingGoogleCloudBuildStepEntries" }],
                filename: writeFixtureRepo(
                    "require-google-cloud-build-steps-non-empty",
                    "invalid-empty-steps",
                    [
                        {
                            content: ["steps:", "timeout: 60s"].join("\n"),
                            relativePath: "cloudbuild.yaml",
                        },
                    ]
                ),
                name: "reports empty Cloud Build steps list",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-steps-non-empty",
                    "valid-steps-list",
                    [
                        {
                            content: [
                                "steps:",
                                "  - name: gcr.io/cloud-builders/npm",
                            ].join("\n"),
                            relativePath: "cloudbuild.yaml",
                        },
                    ]
                ),
                name: "accepts non-empty Cloud Build steps list",
            },
        ],
    }
);

ruleTester.run(
    "require-dockerfile-first-instruction-from",
    getPluginRule("require-dockerfile-first-instruction-from"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "dockerfileFirstInstructionNotFrom" }],
                filename: writeFixtureRepo(
                    "require-dockerfile-first-instruction-from",
                    "invalid-first-instruction-not-from",
                    [
                        {
                            content: [
                                "WORKDIR /app",
                                "FROM node:22-alpine",
                                "CMD ['node','server.js']",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "reports Dockerfiles where first instruction is not FROM",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-first-instruction-from",
                    "valid-first-instruction-from",
                    [
                        {
                            content: [
                                "# syntax=docker/dockerfile:1",
                                "FROM node:22-alpine",
                                "WORKDIR /app",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "accepts Dockerfiles starting with FROM after comments",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-first-instruction-from",
                    "valid-arg-before-from",
                    [
                        {
                            content: [
                                "# syntax=docker/dockerfile:1",
                                "ARG BASE_VERSION=lts-bookworm",
                                "FROM node:lts-bookworm",
                                "WORKDIR /app",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "accepts Dockerfiles with ARG instructions before FROM",
            },
        ],
    }
);

ruleTester.run(
    "require-vercel-version-value",
    getPluginRule("require-vercel-version-value"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "invalidVercelVersionValue" }],
                filename: writeFixtureRepo(
                    "require-vercel-version-value",
                    "invalid-version-1",
                    [
                        {
                            content: JSON.stringify({ version: 1 }, null, 2),
                            relativePath: "vercel.json",
                        },
                    ]
                ),
                name: "reports invalid vercel version values",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-vercel-version-value",
                    "valid-version-2",
                    [
                        {
                            content: JSON.stringify({ version: 2 }, null, 2),
                            relativePath: "vercel.json",
                        },
                    ]
                ),
                name: "accepts vercel version value 2",
            },
        ],
    }
);

ruleTester.run(
    "require-netlify-publish-directory-no-trailing-slash",
    getPluginRule("require-netlify-publish-directory-no-trailing-slash"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "netlifyPublishDirectoryTrailingSlash" }],
                filename: writeFixtureRepo(
                    "require-netlify-publish-directory-no-trailing-slash",
                    "invalid-trailing-slash",
                    [
                        {
                            content: ["[build]", '  publish = "dist/"'].join(
                                "\n"
                            ),
                            relativePath: "netlify.toml",
                        },
                    ]
                ),
                name: "reports Netlify publish values with trailing slash",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-netlify-publish-directory-no-trailing-slash",
                    "valid-no-trailing-slash",
                    [
                        {
                            content: ["[build]", '  publish = "dist"'].join(
                                "\n"
                            ),
                            relativePath: "netlify.toml",
                        },
                    ]
                ),
                name: "accepts Netlify publish values without trailing slash",
            },
        ],
    }
);

ruleTester.run(
    "require-digitalocean-app-spec-region-lowercase",
    getPluginRule("require-digitalocean-app-spec-region-lowercase"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "nonLowercaseDigitalOceanRegion" }],
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-region-lowercase",
                    "invalid-uppercase-region",
                    [
                        {
                            content: [
                                "name: demo",
                                "region: NYC",
                                "services:",
                                "  - name: web",
                            ].join("\n"),
                            relativePath: ".do/app.yaml",
                        },
                    ]
                ),
                name: "reports non-lowercase DigitalOcean region values",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-region-lowercase",
                    "valid-lowercase-region",
                    [
                        {
                            content: [
                                "name: demo",
                                "region: nyc",
                                "services:",
                                "  - name: web",
                            ].join("\n"),
                            relativePath: ".do/app.yaml",
                        },
                    ]
                ),
                name: "accepts lowercase DigitalOcean region values",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-region-lowercase",
                    "valid-no-region-key",
                    [
                        {
                            content: [
                                "name: demo",
                                "services:",
                                "  - name: web",
                            ].join("\n"),
                            relativePath: ".do/app.yaml",
                        },
                    ]
                ),
                name: "passes when region key is absent (existence enforced by require-digitalocean-app-spec-region)",
            },
        ],
    }
);

// ──────────────────────────────────────────────────────────────────────────────
// Additional branch-coverage tests appended below
// ──────────────────────────────────────────────────────────────────────────────

ruleTester.run(
    "require-aws-amplify-version",
    getPluginRule("require-aws-amplify-version"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-aws-amplify-version",
                    "valid-no-amplify-config-file",
                    []
                ),
                name: "skips when no Amplify config file exists in the repository",
            },
        ],
    }
);

ruleTester.run(
    "require-aws-amplify-version-value",
    getPluginRule("require-aws-amplify-version-value"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-aws-amplify-version-value",
                    "valid-no-amplify-config-file",
                    []
                ),
                name: "skips when no Amplify config file exists in the repository",
            },
        ],
    }
);

ruleTester.run(
    "require-digitalocean-app-spec-name",
    getPluginRule("require-digitalocean-app-spec-name"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-name",
                    "valid-no-do-app-spec-file",
                    []
                ),
                name: "skips when no DigitalOcean app spec exists in the repository",
            },
        ],
    }
);

ruleTester.run(
    "require-digitalocean-app-spec-name-value",
    getPluginRule("require-digitalocean-app-spec-name-value"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-name-value",
                    "valid-no-do-app-spec-file",
                    []
                ),
                name: "skips when no DigitalOcean app spec exists in the repository",
            },
        ],
    }
);

ruleTester.run(
    "require-digitalocean-app-spec-region-value",
    getPluginRule("require-digitalocean-app-spec-region-value"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-region-value",
                    "valid-no-do-app-spec-file",
                    []
                ),
                name: "skips when no DigitalOcean app spec exists in the repository",
            },
        ],
    }
);

ruleTester.run(
    "require-azure-pipelines-execution-plan",
    getPluginRule("require-azure-pipelines-execution-plan"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-execution-plan",
                    "valid-no-azure-config-file",
                    []
                ),
                name: "skips when no Azure Pipelines config exists in the repository",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-execution-plan",
                    "valid-stages-key",
                    [
                        {
                            content: [
                                "stages:",
                                "  - stage: Build",
                                "    jobs:",
                                "      - job: BuildJob",
                                "        steps:",
                                "          - script: npm run build",
                            ].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "accepts Azure Pipelines configs with top-level stages key",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-execution-plan",
                    "valid-steps-key",
                    [
                        {
                            content: [
                                "steps:",
                                "  - script: npm run build",
                            ].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "accepts Azure Pipelines configs with top-level steps key",
            },
        ],
    }
);

ruleTester.run(
    "require-azure-pipelines-trigger-branches",
    getPluginRule("require-azure-pipelines-trigger-branches"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingAzurePipelinesTriggerBranches" }],
                filename: writeFixtureRepo(
                    "require-azure-pipelines-trigger-branches",
                    "invalid-no-trigger-key",
                    [
                        {
                            content: [
                                "jobs:",
                                "  - job: build",
                                "    steps:",
                                "      - script: npm run build",
                            ].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "reports Azure Pipelines configs that have no trigger key at all",
            },
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingAzurePipelinesTriggerBranches" }],
                filename: writeFixtureRepo(
                    "require-azure-pipelines-trigger-branches",
                    "invalid-trigger-none",
                    [
                        {
                            content: ["trigger: none"].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "reports Azure Pipelines configs with trigger: none and no branches block",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-trigger-branches",
                    "valid-no-azure-config-file",
                    []
                ),
                name: "skips when no Azure Pipelines config exists in the repository",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-trigger-branches",
                    "valid-inline-trigger-branch",
                    [
                        {
                            content: [
                                "trigger: main",
                                "jobs:",
                                "  - job: build",
                                "    steps:",
                                "      - script: npm run build",
                            ].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "accepts Azure Pipelines configs with inline trigger branch value",
            },
        ],
    }
);

ruleTester.run(
    "require-azure-pipelines-pr-branches",
    getPluginRule("require-azure-pipelines-pr-branches"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingAzurePipelinesPrBranches" }],
                filename: writeFixtureRepo(
                    "require-azure-pipelines-pr-branches",
                    "invalid-no-pr-key",
                    [
                        {
                            content: [
                                "trigger:",
                                "  branches:",
                                "    include:",
                                "      - main",
                            ].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "reports Azure Pipelines configs without a pr: key",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-pr-branches",
                    "valid-no-azure-config-file",
                    []
                ),
                name: "skips when no Azure Pipelines config exists in the repository",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-pr-branches",
                    "valid-inline-pr-branch",
                    [
                        {
                            content: ["pr: main"].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "accepts Azure Pipelines configs with inline pr branch value",
            },
        ],
    }
);

ruleTester.run(
    "require-azure-pipelines-trigger-include-branches",
    getPluginRule("require-azure-pipelines-trigger-include-branches"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [
                    {
                        messageId:
                            "missingAzurePipelinesTriggerIncludeBranches",
                    },
                ],
                filename: writeFixtureRepo(
                    "require-azure-pipelines-trigger-include-branches",
                    "invalid-trigger-no-branches-key",
                    [
                        {
                            content: [
                                "trigger:",
                                "  batch: true",
                                "jobs:",
                                "  - job: build",
                                "    steps:",
                                "      - script: npm run build",
                            ].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "reports when trigger: block has no branches key",
            },
            {
                code: lintTargetSource,
                errors: [
                    {
                        messageId:
                            "missingAzurePipelinesTriggerIncludeBranches",
                    },
                ],
                filename: writeFixtureRepo(
                    "require-azure-pipelines-trigger-include-branches",
                    "invalid-trigger-branches-no-include",
                    [
                        {
                            content: [
                                "trigger:",
                                "  branches:",
                                "    exclude:",
                                "      - feature/*",
                            ].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "reports when trigger.branches has only exclude with no include key",
            },
            {
                code: lintTargetSource,
                errors: [
                    {
                        messageId:
                            "missingAzurePipelinesTriggerIncludeBranches",
                    },
                ],
                filename: writeFixtureRepo(
                    "require-azure-pipelines-trigger-include-branches",
                    "invalid-no-trigger-key",
                    [
                        {
                            content: [
                                "jobs:",
                                "  - job: build",
                                "    steps:",
                                "      - script: npm run build",
                            ].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "reports when there is no trigger key in the config",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-trigger-include-branches",
                    "valid-no-azure-config-file",
                    []
                ),
                name: "skips when no Azure Pipelines config exists in the repository",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-trigger-include-branches",
                    "valid-trigger-with-blank-line-before-include",
                    [
                        {
                            content: [
                                "trigger:",
                                "  branches:",
                                "",
                                "    # Filter branches",
                                "    include:",
                                "      - main",
                            ].join("\n"),
                            relativePath: "azure-pipelines.yml",
                        },
                    ]
                ),
                name: "accepts trigger include branches with blank lines and comments",
            },
        ],
    }
);

// ──────────────────────────────────────────────────────────────────────────────
// Additional branch-coverage tests: missing "no config" and "non-trigger" cases
// ──────────────────────────────────────────────────────────────────────────────

ruleTester.run(
    "require-azure-pipelines-name",
    getPluginRule("require-azure-pipelines-name"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-name",
                    "valid-no-azure-config-extra",
                    []
                ),
                name: "skips when no azure-pipelines.yml is present in the repository",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-name",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
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
                errors: [{ messageId: "noWriteAllPermissions" }],
                filename: writeFixtureRepo(
                    "require-forgejo-actions-no-write-all-permissions",
                    "invalid-single-quoted-write-all",
                    [
                        {
                            content: [
                                "name: CI",
                                "on:",
                                "  push:",
                                "permissions: 'write-all'",
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
                name: "reports workflows with single-quoted write-all permissions",
            },
            {
                code: lintTargetSource,
                errors: [{ messageId: "noWriteAllPermissions" }],
                filename: writeFixtureRepo(
                    "require-forgejo-actions-no-write-all-permissions",
                    "invalid-double-quoted-write-all",
                    [
                        {
                            content: [
                                "name: CI",
                                "on:",
                                "  push:",
                                'permissions: "write-all"',
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
                name: "reports workflows with double-quoted write-all permissions",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-no-write-all-permissions",
                    "valid-no-workflows-dir-extra",
                    []
                ),
                name: "skips when no Forgejo workflows directory is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-no-write-all-permissions",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-no-write-all-permissions",
                    "valid-non-yaml-file-in-workflows",
                    [
                        {
                            content: "#!/bin/sh\necho hello",
                            relativePath: ".forgejo/workflows/helper.sh",
                        },
                    ]
                ),
                name: "skips non-YAML files found inside the workflows directory",
            },
        ],
    }
);

ruleTester.run(
    "require-dockerfile-workdir",
    getPluginRule("require-dockerfile-workdir"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-workdir",
                    "valid-no-dockerfile-extra",
                    []
                ),
                name: "skips when no Dockerfile is present in the repository",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-workdir",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-workdir",
                    "valid-blank-and-comment-lines",
                    [
                        {
                            content: [
                                "# syntax=docker/dockerfile:1",
                                "",
                                "FROM node:20",
                                "WORKDIR /app",
                                "COPY . .",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "handles blank lines and comments in Dockerfile correctly",
            },
        ],
    }
);

ruleTester.run(
    "require-dockerfile-from-instruction",
    getPluginRule("require-dockerfile-from-instruction"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-from-instruction",
                    "valid-no-dockerfile-extra",
                    []
                ),
                name: "skips when no Dockerfile is present in the repository",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-from-instruction",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-dockerfile-user",
    getPluginRule("require-dockerfile-user"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-user",
                    "valid-no-dockerfile-extra",
                    []
                ),
                name: "skips when no Dockerfile is present in the repository",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-user",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-forgejo-actions-workflow-trigger-coverage",
    getPluginRule("require-forgejo-actions-workflow-trigger-coverage"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-trigger-coverage",
                    "valid-no-workflows-dir-extra",
                    []
                ),
                name: "skips when no Forgejo workflows directory is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-trigger-coverage",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-forgejo-actions-pinned-sha",
    getPluginRule("require-forgejo-actions-pinned-sha"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-pinned-sha",
                    "valid-no-workflows-dir-extra",
                    []
                ),
                name: "skips when no Forgejo workflows directory is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-pinned-sha",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-pinned-sha",
                    "valid-workflow-no-uses-steps",
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
                                "      - run: npm test",
                            ].join("\n"),
                            relativePath: ".forgejo/workflows/ci.yml",
                        },
                    ]
                ),
                name: "passes workflow files that have no 'uses:' references at all",
            },
        ],
    }
);

ruleTester.run(
    "require-digitalocean-app-spec-component",
    getPluginRule("require-digitalocean-app-spec-component"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-component",
                    "valid-no-app-spec-extra",
                    []
                ),
                name: "skips when no DigitalOcean app spec is present in the repository",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-component",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-component",
                    "valid-blank-and-comment-lines",
                    [
                        {
                            content: [
                                "# DigitalOcean App Spec",
                                "",
                                "name: my-app",
                                "region: nyc",
                                "services:",
                                "  - name: web",
                                "    image:",
                                "      registry_type: DOCKER_HUB",
                            ].join("\n"),
                            relativePath: ".do/app.yaml",
                        },
                    ]
                ),
                name: "handles blank and comment lines in the app spec",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-component",
                    "valid-indented-component-key",
                    [
                        {
                            content: [
                                "name: my-app",
                                "# nested spec is valid but the component key must be top-level",
                                "",
                                "services:",
                                "  - name: web",
                                "    image:",
                                "      registry_type: DOCKER_HUB",
                                "      nested_services:",
                                "        - name: ignored",
                            ].join("\n"),
                            relativePath: ".do/app.yaml",
                        },
                    ]
                ),
                name: "passes when a valid top-level component key is present alongside other keys",
            },
        ],
    }
);

ruleTester.run(
    "require-aws-amplify-version",
    getPluginRule("require-aws-amplify-version"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-aws-amplify-version",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-aws-amplify-version-value",
    getPluginRule("require-aws-amplify-version-value"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-aws-amplify-version-value",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-aws-amplify-build-commands",
    getPluginRule("require-aws-amplify-build-commands"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-aws-amplify-build-commands",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-aws-amplify-artifacts-files",
    getPluginRule("require-aws-amplify-artifacts-files"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-aws-amplify-artifacts-files",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-aws-amplify-artifacts-base-directory",
    getPluginRule("require-aws-amplify-artifacts-base-directory"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-aws-amplify-artifacts-base-directory",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-netlify-build-command",
    getPluginRule("require-netlify-build-command"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-netlify-build-command",
                    "valid-no-netlify-config",
                    []
                ),
                name: "skips when no Netlify config is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-netlify-build-command",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-netlify-build-command-non-empty",
    getPluginRule("require-netlify-build-command-non-empty"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-netlify-build-command-non-empty",
                    "valid-no-netlify-config",
                    []
                ),
                name: "skips when no Netlify config is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-netlify-build-command-non-empty",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-netlify-build-publish-directory",
    getPluginRule("require-netlify-build-publish-directory"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-netlify-build-publish-directory",
                    "valid-no-netlify-config",
                    []
                ),
                name: "skips when no Netlify config is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-netlify-build-publish-directory",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-netlify-build-section",
    getPluginRule("require-netlify-build-section"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-netlify-build-section",
                    "valid-no-netlify-config",
                    []
                ),
                name: "skips when no Netlify config is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-netlify-build-section",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-netlify-publish-directory-no-trailing-slash",
    getPluginRule("require-netlify-publish-directory-no-trailing-slash"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-netlify-publish-directory-no-trailing-slash",
                    "valid-no-netlify-config",
                    []
                ),
                name: "skips when no Netlify config is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-netlify-publish-directory-no-trailing-slash",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-netlify-publish-directory-non-empty",
    getPluginRule("require-netlify-publish-directory-non-empty"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-netlify-publish-directory-non-empty",
                    "valid-no-netlify-config",
                    []
                ),
                name: "skips when no Netlify config is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-netlify-publish-directory-non-empty",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-netlify-publish-relative-path",
    getPluginRule("require-netlify-publish-relative-path"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-netlify-publish-relative-path",
                    "valid-no-netlify-config",
                    []
                ),
                name: "skips when no Netlify config is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-netlify-publish-relative-path",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-vercel-build-command",
    getPluginRule("require-vercel-build-command"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-vercel-build-command",
                    "valid-no-vercel-config",
                    []
                ),
                name: "skips when no Vercel config is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-vercel-build-command",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-vercel-config-object",
    getPluginRule("require-vercel-config-object"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-vercel-config-object",
                    "valid-no-vercel-config",
                    []
                ),
                name: "skips when no Vercel config is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-vercel-config-object",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-vercel-schema-url",
    getPluginRule("require-vercel-schema-url"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-vercel-schema-url",
                    "valid-no-vercel-config",
                    []
                ),
                name: "skips when no Vercel config is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-vercel-schema-url",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-vercel-schema",
    getPluginRule("require-vercel-schema"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-vercel-schema",
                    "valid-no-vercel-config",
                    []
                ),
                name: "skips when no Vercel config is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-vercel-schema",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-vercel-valid-json",
    getPluginRule("require-vercel-valid-json"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-vercel-valid-json",
                    "valid-no-vercel-config",
                    []
                ),
                name: "skips when no Vercel config is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-vercel-valid-json",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-vercel-version-value",
    getPluginRule("require-vercel-version-value"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-vercel-version-value",
                    "valid-no-vercel-config",
                    []
                ),
                name: "skips when no Vercel config is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-vercel-version-value",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-google-cloud-build-step-name",
    getPluginRule("require-google-cloud-build-step-name"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-step-name",
                    "valid-no-cloudbuild-config",
                    []
                ),
                name: "skips when no Cloud Build config is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-step-name",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-google-cloud-build-steps-non-empty",
    getPluginRule("require-google-cloud-build-steps-non-empty"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-steps-non-empty",
                    "valid-no-cloudbuild-config",
                    []
                ),
                name: "skips when no Cloud Build config is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-steps-non-empty",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-google-cloud-build-steps",
    getPluginRule("require-google-cloud-build-steps"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-steps",
                    "valid-no-cloudbuild-config",
                    []
                ),
                name: "skips when no Cloud Build config is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-steps",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-google-cloud-build-timeout",
    getPluginRule("require-google-cloud-build-timeout"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-timeout",
                    "valid-no-cloudbuild-config",
                    []
                ),
                name: "skips when no Cloud Build config is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-timeout",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-google-cloud-build-timeout-format",
    getPluginRule("require-google-cloud-build-timeout-format"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-timeout-format",
                    "valid-no-cloudbuild-config",
                    []
                ),
                name: "skips when no Cloud Build config is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-timeout-format",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-google-cloud-build-timeout-max",
    getPluginRule("require-google-cloud-build-timeout-max"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-timeout-max",
                    "valid-no-cloudbuild-config",
                    []
                ),
                name: "skips when no Cloud Build config is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-timeout-max",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-google-cloud-build-timeout-positive",
    getPluginRule("require-google-cloud-build-timeout-positive"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-timeout-positive",
                    "valid-no-cloudbuild-config",
                    []
                ),
                name: "skips when no Cloud Build config is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-google-cloud-build-timeout-positive",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-bitbucket-pipelines-max-time",
    getPluginRule("require-bitbucket-pipelines-max-time"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-max-time",
                    "valid-no-bitbucket-config",
                    []
                ),
                name: "skips when no Bitbucket Pipelines config is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-max-time",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-bitbucket-pipelines-step-name",
    getPluginRule("require-bitbucket-pipelines-step-name"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-step-name",
                    "valid-no-bitbucket-config",
                    []
                ),
                name: "skips when no Bitbucket Pipelines config is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-step-name",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-bitbucket-pipelines-pull-requests",
    getPluginRule("require-bitbucket-pipelines-pull-requests"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-pull-requests",
                    "valid-no-bitbucket-config",
                    []
                ),
                name: "skips when no Bitbucket Pipelines config is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-pull-requests",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-bitbucket-pipelines-pull-requests-target-branches",
    getPluginRule("require-bitbucket-pipelines-pull-requests-target-branches"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-pull-requests-target-branches",
                    "valid-no-bitbucket-config",
                    []
                ),
                name: "skips when no Bitbucket Pipelines config is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-bitbucket-pipelines-pull-requests-target-branches",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-azure-pipelines-trigger",
    getPluginRule("require-azure-pipelines-trigger"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-trigger",
                    "valid-no-azure-config",
                    []
                ),
                name: "skips when no azure-pipelines.yml is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-trigger",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-azure-pipelines-pr-trigger",
    getPluginRule("require-azure-pipelines-pr-trigger"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-pr-trigger",
                    "valid-no-azure-config",
                    []
                ),
                name: "skips when no azure-pipelines.yml is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-pr-trigger",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-azure-pipelines-execution-plan",
    getPluginRule("require-azure-pipelines-execution-plan"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-azure-pipelines-execution-plan",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-digitalocean-app-spec-region",
    getPluginRule("require-digitalocean-app-spec-region"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-region",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-digitalocean-app-spec-name",
    getPluginRule("require-digitalocean-app-spec-name"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-name",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-digitalocean-app-spec-region-lowercase",
    getPluginRule("require-digitalocean-app-spec-region-lowercase"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-digitalocean-app-spec-region-lowercase",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-forgejo-actions-workflow-dispatch",
    getPluginRule("require-forgejo-actions-workflow-dispatch"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-dispatch",
                    "valid-no-workflows-dir-extra",
                    []
                ),
                name: "skips when no Forgejo workflows directory is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-dispatch",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-forgejo-actions-job-timeout-minutes",
    getPluginRule("require-forgejo-actions-job-timeout-minutes"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-job-timeout-minutes",
                    "valid-no-workflows-dir-extra",
                    []
                ),
                name: "skips when no Forgejo workflows directory is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-job-timeout-minutes",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-forgejo-actions-workflow-permissions",
    getPluginRule("require-forgejo-actions-workflow-permissions"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-permissions",
                    "valid-no-workflows-dir-extra",
                    []
                ),
                name: "skips when no Forgejo workflows directory is present",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-permissions",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-gitlab-ci-security-scanning",
    getPluginRule("require-gitlab-ci-security-scanning"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-security-scanning",
                    "valid-no-gitlab-ci-config",
                    []
                ),
                name: "skips when no GitLab CI config exists in the repository",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-security-scanning",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-gitlab-ci-stages",
    getPluginRule("require-gitlab-ci-stages"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-stages",
                    "valid-no-gitlab-ci-config",
                    []
                ),
                name: "skips when no GitLab CI config exists in the repository",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-stages",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-gitlab-ci-workflow-rules",
    getPluginRule("require-gitlab-ci-workflow-rules"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-workflow-rules",
                    "valid-no-gitlab-ci-config",
                    []
                ),
                name: "skips when no GitLab CI config exists in the repository",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-workflow-rules",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-gitlab-ci-merge-request-pipelines",
    getPluginRule("require-gitlab-ci-merge-request-pipelines"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-merge-request-pipelines",
                    "valid-no-gitlab-ci-config",
                    []
                ),
                name: "skips when no GitLab CI config exists in the repository",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-merge-request-pipelines",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);

ruleTester.run(
    "require-gitlab-ci-default-timeout",
    getPluginRule("require-gitlab-ci-default-timeout"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-default-timeout",
                    "valid-no-gitlab-ci-config",
                    []
                ),
                name: "skips when no GitLab CI config exists in the repository",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-default-timeout",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);
