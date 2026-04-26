import {
    lintTargetSource,
    writeFixtureRepo,
} from "./_internal/fixture-helpers";
import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const ruleTester = createRuleTester();

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
