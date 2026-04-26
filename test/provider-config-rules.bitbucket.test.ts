import {
    lintTargetSource,
    writeFixtureRepo,
} from "./_internal/fixture-helpers";
import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const ruleTester = createRuleTester();

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
