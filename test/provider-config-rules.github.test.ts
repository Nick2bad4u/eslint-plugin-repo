import {
    lintTargetSource,
    writeFixtureRepo,
} from "./_internal/fixture-helpers";
import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const ruleTester = createRuleTester();

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
