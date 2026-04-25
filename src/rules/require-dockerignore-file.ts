import { existsSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { setHas } from "ts-extras";

import { getRepositoryDockerfilePath } from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const triggerFileNames = new Set([
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.ts",
    "package.json",
]);

/** Rule enforcing a .dockerignore when a Dockerfile is committed. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const triggerFileName = basename(context.physicalFilename);

        if (!setHas(triggerFileNames, triggerFileName)) {
            return {};
        }

        const repositoryRoot = dirname(context.physicalFilename);
        const dockerfilePath = getRepositoryDockerfilePath(repositoryRoot);

        if (dockerfilePath === null) {
            return {};
        }

        return {
            Program(node) {
                const dockerignorePath = join(repositoryRoot, ".dockerignore");

                if (existsSync(dockerignorePath)) {
                    return;
                }

                context.report({
                    data: {
                        dockerfilePath: relative(
                            repositoryRoot,
                            dockerfilePath
                        ),
                    },
                    messageId: "missingDockerignoreFile",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require `.dockerignore` whenever a repository-root Dockerfile is present to avoid sending unnecessary files into the build context",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.docker",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-dockerignore-file"),
        },
        messages: {
            missingDockerignoreFile:
                "Repository includes '{{ dockerfilePath }}' but is missing `.dockerignore`. Add one to keep secrets, caches, and unnecessary files out of the Docker build context.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-dockerignore-file",
});

export default rule;
