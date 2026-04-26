import {
    lintTargetSource,
    writeFixtureRepo,
} from "./_internal/fixture-helpers";
import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const ruleTester = createRuleTester();

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
