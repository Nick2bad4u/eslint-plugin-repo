import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import * as path from "node:path";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

type FileFixture = Readonly<{
    content: string;
    relativePath: string;
}>;

const fixtureRoot = path.join(
    tmpdir(),
    "repo-compliance-provider-config-rules-audit"
);
const lintTargetSource = "export const lintTarget = true;\n";
const ruleTester = createRuleTester();

mkdirSync(fixtureRoot, { recursive: true });

const writeFixtureRepo = (
    ruleName: string,
    variant: string,
    files: readonly FileFixture[],
    lintTargetRelativePath = "eslint.config.mjs"
): string => {
    const rootDirectoryPath = path.join(fixtureRoot, `${ruleName}-${variant}`);
    mkdirSync(rootDirectoryPath, { recursive: true });

    for (const file of files) {
        const absolutePath = path.join(rootDirectoryPath, file.relativePath);
        mkdirSync(path.dirname(absolutePath), { recursive: true });
        writeFileSync(absolutePath, file.content, "utf8");
    }

    const lintTargetPath = path.join(rootDirectoryPath, lintTargetRelativePath);
    mkdirSync(path.dirname(lintTargetPath), { recursive: true });
    writeFileSync(lintTargetPath, lintTargetSource, "utf8");

    return lintTargetPath;
};

ruleTester.run(
    "require-gitlab-ci-interruptible",
    getPluginRule("require-gitlab-ci-interruptible"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [
                    {
                        data: {
                            configPath: ".gitlab-ci.yaml",
                            jobName: '"deploy preview"',
                        },
                        messageId: "missingInterruptible",
                    },
                ],
                filename: writeFixtureRepo(
                    "require-gitlab-ci-interruptible",
                    "invalid-quoted-job-name-without-interruptible",
                    [
                        {
                            content: [
                                '"deploy preview":',
                                "  stage: deploy",
                                "  script:",
                                "    - npm run deploy:preview",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yaml",
                        },
                    ]
                ),
                name: "reports quoted GitLab job names that omit interruptible true",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-interruptible",
                    "valid-quoted-job-name-with-interruptible",
                    [
                        {
                            content: [
                                '"deploy preview":',
                                "  interruptible: true",
                                "  script:",
                                "    - npm run deploy:preview",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yaml",
                        },
                    ]
                ),
                name: "accepts quoted GitLab job names when interruptible true is present",
            },
        ],
    }
);

ruleTester.run(
    "require-gitlab-ci-needs-dag",
    getPluginRule("require-gitlab-ci-needs-dag"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [
                    {
                        data: {
                            configPath: ".gitlab-ci.yaml",
                            jobName: "integration suite",
                        },
                        messageId: "missingNeeds",
                    },
                ],
                filename: writeFixtureRepo(
                    "require-gitlab-ci-needs-dag",
                    "invalid-space-job-name-without-needs",
                    [
                        {
                            content: [
                                "integration suite:",
                                "  stage: test",
                                "  script:",
                                "    - npm test",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yaml",
                        },
                    ]
                ),
                name: "reports GitLab job names with spaces when they omit needs",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-needs-dag",
                    "valid-space-job-name-with-needs",
                    [
                        {
                            content: [
                                "integration suite:",
                                "  needs: []",
                                "  script:",
                                "    - npm test",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yaml",
                        },
                    ]
                ),
                name: "accepts GitLab job names with spaces when needs is present",
            },
        ],
    }
);

ruleTester.run(
    "require-gitlab-ci-cache-policy",
    getPluginRule("require-gitlab-ci-cache-policy"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [
                    {
                        data: {
                            configPath: ".gitlab-ci.yaml",
                            lineNumber: "1",
                        },
                        messageId: "missingCachePolicy",
                    },
                ],
                filename: writeFixtureRepo(
                    "require-gitlab-ci-cache-policy",
                    "invalid-yaml-extension-missing-policy",
                    [
                        {
                            content: [
                                "cache:",
                                "  key: node-cache",
                                "  paths:",
                                "    - node_modules/",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yaml",
                        },
                    ]
                ),
                name: "reports cache blocks without policy in .gitlab-ci.yaml",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-cache-policy",
                    "valid-yaml-extension-with-policy",
                    [
                        {
                            content: [
                                "cache:",
                                "  key: node-cache",
                                "  policy: pull-push",
                                "  paths:",
                                "    - node_modules/",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yaml",
                        },
                    ]
                ),
                name: "accepts cache blocks with policy in .gitlab-ci.yaml",
            },
        ],
    }
);

ruleTester.run(
    "require-forgejo-actions-workflow-trigger-coverage",
    getPluginRule("require-forgejo-actions-workflow-trigger-coverage"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [
                    {
                        data: {
                            workflowFile: ".forgejo/workflows/ci.yml",
                        },
                        messageId: "missingStandardTrigger",
                    },
                ],
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-trigger-coverage",
                    "invalid-push-only-outside-on-block",
                    [
                        {
                            content: [
                                "name: CI",
                                "on:",
                                "  workflow_dispatch:",
                                "jobs:",
                                "  test:",
                                "    runs-on: docker",
                                "    env:",
                                "      push: not-a-trigger",
                                "    steps:",
                                "      - run: npm test",
                            ].join("\n"),
                            relativePath: ".forgejo/workflows/ci.yml",
                        },
                    ]
                ),
                name: "does not treat push keys outside the on block as workflow triggers",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-trigger-coverage",
                    "valid-inline-on-list",
                    [
                        {
                            content: [
                                "name: CI",
                                "on: [workflow_dispatch, pull_request]",
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
                name: "accepts inline on declarations that include pull_request",
            },
        ],
    }
);

ruleTester.run(
    "require-forgejo-actions-concurrency",
    getPluginRule("require-forgejo-actions-concurrency"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [
                    {
                        data: {
                            workflowFile: ".forgejo/workflows/ci.yaml",
                        },
                        messageId: "missingConcurrency",
                    },
                ],
                filename: writeFixtureRepo(
                    "require-forgejo-actions-concurrency",
                    "invalid-yaml-extension-no-concurrency",
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
                            relativePath: ".forgejo/workflows/ci.yaml",
                        },
                    ]
                ),
                name: "reports Forgejo workflow files with yaml extension when concurrency is missing",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-concurrency",
                    "valid-yaml-extension-with-concurrency",
                    [
                        {
                            content: [
                                "name: CI",
                                "on:",
                                "  push:",
                                "concurrency:",
                                "  group: ci-main",
                                "  cancel-in-progress: true",
                                "jobs:",
                                "  test:",
                                "    runs-on: docker",
                                "    steps:",
                                "      - run: npm test",
                            ].join("\n"),
                            relativePath: ".forgejo/workflows/ci.yaml",
                        },
                    ]
                ),
                name: "accepts Forgejo workflow files with yaml extension when concurrency is present",
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
                    "invalid-workflow-dispatch-only-outside-on-block",
                    [
                        {
                            content: [
                                "name: CI",
                                "on:",
                                "  push:",
                                "jobs:",
                                "  test:",
                                "    runs-on: docker",
                                "    env:",
                                "      workflow_dispatch: nope",
                                "    steps:",
                                "      - run: npm test",
                            ].join("\n"),
                            relativePath: ".forgejo/workflows/ci.yml",
                        },
                    ]
                ),
                name: "does not treat workflow_dispatch keys outside the on block as valid manual triggers",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-forgejo-actions-workflow-dispatch",
                    "valid-inline-workflow-dispatch-event",
                    [
                        {
                            content: [
                                "name: CI",
                                "on: [push, workflow_dispatch]",
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
                name: "accepts workflow_dispatch when it is declared inline inside the on block",
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
                    {
                        messageId: "missingGitLabMergeRequestPipelineConfig",
                    },
                ],
                filename: writeFixtureRepo(
                    "require-gitlab-ci-merge-request-pipelines",
                    "invalid-yaml-extension-no-mr-pipeline-config",
                    [
                        {
                            content: [
                                "workflow:",
                                "  rules:",
                                "    - if: $CI_COMMIT_BRANCH",
                                "test:",
                                "  script:",
                                "    - npm test",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yaml",
                        },
                    ]
                ),
                name: "reports missing merge-request pipeline config in .gitlab-ci.yaml",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-merge-request-pipelines",
                    "valid-yaml-extension-with-merge-request-event",
                    [
                        {
                            content: [
                                "workflow:",
                                "  rules:",
                                '    - if: $CI_PIPELINE_SOURCE == "merge_request_event"',
                                "test:",
                                "  script:",
                                "    - npm test",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yaml",
                        },
                    ]
                ),
                name: "accepts merge-request pipeline config in .gitlab-ci.yaml",
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
                    "invalid-yaml-extension-no-workflow-rules",
                    [
                        {
                            content: [
                                "stages:",
                                "  - test",
                                "test:",
                                "  script:",
                                "    - npm test",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yaml",
                        },
                    ]
                ),
                name: "reports missing workflow rules in .gitlab-ci.yaml",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-gitlab-ci-workflow-rules",
                    "valid-yaml-extension-with-workflow-rules",
                    [
                        {
                            content: [
                                "workflow:",
                                "  rules:",
                                "    - if: $CI_COMMIT_BRANCH",
                                "stages:",
                                "  - test",
                                "test:",
                                "  script:",
                                "    - npm test",
                            ].join("\n"),
                            relativePath: ".gitlab-ci.yaml",
                        },
                    ]
                ),
                name: "accepts workflow rules in .gitlab-ci.yaml",
            },
        ],
    }
);
