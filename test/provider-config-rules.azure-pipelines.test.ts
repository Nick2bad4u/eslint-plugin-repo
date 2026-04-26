import {
    lintTargetSource,
    writeFixtureRepo,
} from "./_internal/fixture-helpers";
import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const ruleTester = createRuleTester();

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
