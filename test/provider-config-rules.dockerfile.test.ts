import {
    lintTargetSource,
    writeFixtureRepo,
} from "./_internal/fixture-helpers";
import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const ruleTester = createRuleTester();

ruleTester.run(
    "require-dockerfile-base-image-tag",
    getPluginRule("require-dockerfile-base-image-tag"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "unpinnedDockerBaseImageTag" }],
                filename: writeFixtureRepo(
                    "require-dockerfile-base-image-tag",
                    "invalid-latest-tag",
                    [
                        {
                            content: ["FROM node:latest", "WORKDIR /app"].join(
                                "\n"
                            ),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "reports Dockerfile base image refs using latest",
            },
            {
                code: lintTargetSource,
                errors: [{ messageId: "unpinnedDockerBaseImageTag" }],
                filename: writeFixtureRepo(
                    "require-dockerfile-base-image-tag",
                    "invalid-missing-tag",
                    [
                        {
                            content: ["FROM alpine", "RUN echo ok"].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "reports Dockerfile base image refs without explicit tag",
            },
            {
                code: lintTargetSource,
                errors: [{ messageId: "unpinnedDockerBaseImageTag" }],
                filename: writeFixtureRepo(
                    "require-dockerfile-base-image-tag",
                    "invalid-platform-latest-tag",
                    [
                        {
                            content: [
                                "FROM --platform=linux/amd64 node:latest",
                                "RUN node --version",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "reports latest tags even when FROM includes a platform prefix",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-base-image-tag",
                    "valid-non-latest-tag",
                    [
                        {
                            content: [
                                "FROM node:22-alpine",
                                "WORKDIR /app",
                                "RUN npm ci",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "accepts Dockerfile base image refs pinned to non-latest tags",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-base-image-tag",
                    "valid-sha-digest",
                    [
                        {
                            content: [
                                "FROM node@sha256:3bd1a55f74be0d8a2fcb4a00e95e26ef9642f2f957f725622f4c5d6c73ab8cf8",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "accepts Dockerfile base image refs pinned by digest",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-base-image-tag",
                    "valid-scratch-base-image",
                    [
                        {
                            content: ["FROM scratch", "ADD hello /hello"].join(
                                "\n"
                            ),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "accepts scratch base images",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-base-image-tag",
                    "valid-variable-base-image",
                    [
                        {
                            content: [
                                "ARG BASE_IMAGE=node:22-alpine",
                                // eslint-disable-next-line no-template-curly-in-string -- the rule should ignore that this isn't a real variable reference since it can't be evaluated statically
                                "FROM ${BASE_IMAGE}",
                                "RUN node --version",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "accepts variable-driven base image references",
            },
        ],
    }
);

ruleTester.run(
    "require-dockerfile-user",
    getPluginRule("require-dockerfile-user"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingDockerfileUserInstruction" }],
                filename: writeFixtureRepo(
                    "require-dockerfile-user",
                    "invalid-missing-user",
                    [
                        {
                            content: [
                                "FROM node:22-alpine",
                                "WORKDIR /app",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "reports Dockerfiles without explicit USER instruction",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-user",
                    "valid-user-present",
                    [
                        {
                            content: [
                                "FROM node:22-alpine",
                                "WORKDIR /app",
                                "USER node",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "accepts Dockerfiles with explicit USER instruction",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-user",
                    "valid-no-dockerfile",
                    []
                ),
                name: "skips the rule when Dockerfile is absent",
            },
        ],
    }
);

ruleTester.run(
    "require-dockerfile-workdir",
    getPluginRule("require-dockerfile-workdir"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingDockerfileWorkdir" }],
                filename: writeFixtureRepo(
                    "require-dockerfile-workdir",
                    "invalid-no-workdir",
                    [
                        {
                            content: ["FROM node:22-alpine", "RUN npm ci"].join(
                                "\n"
                            ),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "reports Dockerfiles missing WORKDIR instruction",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-workdir",
                    "valid-workdir-present",
                    [
                        {
                            content: [
                                "FROM node:22-alpine",
                                "WORKDIR /app",
                                "RUN npm ci",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "accepts Dockerfiles with explicit WORKDIR",
            },
        ],
    }
);

ruleTester.run(
    "require-dockerfile-cmd-or-entrypoint",
    getPluginRule("require-dockerfile-cmd-or-entrypoint"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingDockerfileCmdOrEntrypoint" }],
                filename: writeFixtureRepo(
                    "require-dockerfile-cmd-or-entrypoint",
                    "invalid-missing-startup-instruction",
                    [
                        {
                            content: [
                                "FROM node:22-alpine",
                                "WORKDIR /app",
                                "RUN npm ci",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "reports Dockerfiles missing CMD and ENTRYPOINT",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-cmd-or-entrypoint",
                    "valid-cmd-present",
                    [
                        {
                            content: [
                                "FROM node:22-alpine",
                                "WORKDIR /app",
                                'CMD ["node", "server.js"]',
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "accepts Dockerfiles with CMD instruction",
            },
        ],
    }
);

ruleTester.run(
    "require-dockerfile-from-instruction",
    getPluginRule("require-dockerfile-from-instruction"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "missingDockerfileFromInstruction" }],
                filename: writeFixtureRepo(
                    "require-dockerfile-from-instruction",
                    "invalid-missing-from",
                    [
                        {
                            content: [
                                "WORKDIR /app",
                                'CMD ["node", "server.js"]',
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "reports Dockerfiles missing FROM instruction",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-from-instruction",
                    "valid-from-present",
                    [
                        {
                            content: [
                                "FROM node:22-alpine",
                                "WORKDIR /app",
                                'CMD ["node", "server.js"]',
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "accepts Dockerfiles with FROM instruction",
            },
        ],
    }
);

ruleTester.run(
    "require-dockerfile-first-instruction-from",
    getPluginRule("require-dockerfile-first-instruction-from"),
    {
        invalid: [
            {
                code: lintTargetSource,
                errors: [{ messageId: "dockerfileFirstInstructionNotFrom" }],
                filename: writeFixtureRepo(
                    "require-dockerfile-first-instruction-from",
                    "invalid-first-instruction-not-from",
                    [
                        {
                            content: [
                                "WORKDIR /app",
                                "FROM node:22-alpine",
                                "CMD ['node','server.js']",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "reports Dockerfiles where first instruction is not FROM",
            },
        ],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-first-instruction-from",
                    "valid-first-instruction-from",
                    [
                        {
                            content: [
                                "# syntax=docker/dockerfile:1",
                                "FROM node:22-alpine",
                                "WORKDIR /app",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "accepts Dockerfiles starting with FROM after comments",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-first-instruction-from",
                    "valid-arg-before-from",
                    [
                        {
                            content: [
                                "# syntax=docker/dockerfile:1",
                                "ARG BASE_VERSION=lts-bookworm",
                                "FROM node:lts-bookworm",
                                "WORKDIR /app",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "accepts Dockerfiles with ARG instructions before FROM",
            },
        ],
    }
);

ruleTester.run(
    "require-dockerfile-workdir",
    getPluginRule("require-dockerfile-workdir"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-workdir",
                    "valid-no-dockerfile-extra",
                    []
                ),
                name: "skips when no Dockerfile is present in the repository",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-workdir",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-workdir",
                    "valid-blank-and-comment-lines",
                    [
                        {
                            content: [
                                "# syntax=docker/dockerfile:1",
                                "",
                                "FROM node:20",
                                "WORKDIR /app",
                                "COPY . .",
                            ].join("\n"),
                            relativePath: "Dockerfile",
                        },
                    ]
                ),
                name: "handles blank lines and comments in Dockerfile correctly",
            },
        ],
    }
);

ruleTester.run(
    "require-dockerfile-from-instruction",
    getPluginRule("require-dockerfile-from-instruction"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-from-instruction",
                    "valid-no-dockerfile-extra",
                    []
                ),
                name: "skips when no Dockerfile is present in the repository",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-from-instruction",
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
    "require-dockerfile-user",
    getPluginRule("require-dockerfile-user"),
    {
        invalid: [],
        valid: [
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-user",
                    "valid-no-dockerfile-extra",
                    []
                ),
                name: "skips when no Dockerfile is present in the repository",
            },
            {
                code: lintTargetSource,
                filename: writeFixtureRepo(
                    "require-dockerfile-user",
                    "valid-non-trigger-filename",
                    [],
                    "vite.config.ts"
                ),
                name: "skips when the linted file is not a recognised trigger filename",
            },
        ],
    }
);
