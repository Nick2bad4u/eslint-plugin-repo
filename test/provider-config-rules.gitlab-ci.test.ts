import {
    lintTargetSource,
    writeFixtureRepo,
} from "./_internal/fixture-helpers";
import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const ruleTester = createRuleTester();

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
