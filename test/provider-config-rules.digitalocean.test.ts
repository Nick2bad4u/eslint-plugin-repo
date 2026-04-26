import {
    lintTargetSource,
    writeFixtureRepo,
} from "./_internal/fixture-helpers";
import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const ruleTester = createRuleTester();

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
