import {
    lintTargetSource,
    writeFixtureRepo,
} from "./_internal/fixture-helpers";
import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const ruleTester = createRuleTester();

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
