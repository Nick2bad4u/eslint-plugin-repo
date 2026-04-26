import {
    lintTargetSource,
    writeFixtureRepo,
} from "./_internal/fixture-helpers";
import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const ruleTester = createRuleTester();

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
