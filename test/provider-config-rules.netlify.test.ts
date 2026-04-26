import {
    lintTargetSource,
    writeFixtureRepo,
} from "./_internal/fixture-helpers";
import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const ruleTester = createRuleTester();

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
