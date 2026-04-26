import {
    lintTargetSource,
    writeFixtureRepo,
} from "./_internal/fixture-helpers";
import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const ruleTester = createRuleTester();

ruleTester.run(
    "require-dependabot-reviewers",
    getPluginRule("require-dependabot-reviewers"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingDependabotReviewers" }],
                filename: writeFixtureRepo(
                    "require-dependabot-reviewers",
                    "invalid-missing-reviewers",
                    [
                        {
                            content: [
                                "version: 2",
                                "updates:",
                                "  - package-ecosystem: npm",
                                "    directory: /",
                                "    schedule:",
                                "      interval: weekly",
                            ].join("\n"),
                            relativePath: ".github/dependabot.yml",
                        },
                    ]
                ),
                name: "reports dependabot updates without reviewers",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dependabot-reviewers",
                    "valid-reviewers",
                    [
                        {
                            content: [
                                "version: 2",
                                "updates:",
                                "  - package-ecosystem: npm",
                                "    directory: /",
                                "    schedule:",
                                "      interval: weekly",
                                "    reviewers:",
                                "      - octocat",
                            ].join("\n"),
                            relativePath: ".github/dependabot.yml",
                        },
                    ]
                ),
                name: "accepts dependabot updates with reviewers",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dependabot-reviewers",
                    "valid-assignees-and-yaml-extension",
                    [
                        {
                            content: [
                                "version: 2",
                                "updates:",
                                "  - package-ecosystem: npm",
                                "    directory: /",
                                "    schedule:",
                                "      interval: weekly",
                                "    assignees:",
                                "      - octocat",
                            ].join("\n"),
                            relativePath: ".github/dependabot.yaml",
                        },
                    ]
                ),
                name: "accepts dependabot yaml with assignees only",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dependabot-reviewers",
                    "valid-no-dependabot-config",
                    []
                ),
                name: "skips when no dependabot config file exists",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dependabot-reviewers",
                    "valid-non-trigger-file",
                    [
                        {
                            content: [
                                "version: 2",
                                "updates:",
                                "  - package-ecosystem: npm",
                                "    directory: /",
                                "    schedule:",
                                "      interval: weekly",
                            ].join("\n"),
                            relativePath: ".github/dependabot.yml",
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
    "require-dockerignore-file",
    getPluginRule("require-dockerignore-file"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingDockerignoreFile" }],
                filename: writeFixtureRepo(
                    "require-dockerignore-file",
                    "invalid-missing-dockerignore",
                    [
                        {
                            content: [
                                "FROM node:22-alpine",
                                "WORKDIR /app",
                                "COPY . .",
                                "RUN npm ci",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "reports repositories with a Dockerfile but no .dockerignore",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerignore-file",
                    "valid-dockerignore-present",
                    [
                        {
                            content: [
                                "FROM node:22-alpine",
                                "WORKDIR /app",
                                "COPY . .",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                        {
                            content: [
                                "node_modules",
                                ".git",
                                ".env",
                            ].join("\n"),
                            relativePath: ".dockerignore",
                        },
                    ]
                ),
                name: "accepts repositories that pair Dockerfile with .dockerignore",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerignore-file",
                    "valid-no-dockerfile",
                    []
                ),
                name: "skips the rule when Dockerfile is absent",
            },
        ],
    }
);
