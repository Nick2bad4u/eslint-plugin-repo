import { basename, dirname, relative } from "node:path";
import { setHas, stringSplit } from "ts-extras";

import {
    getRepositoryDockerfilePath,
    normalizeLineEndings,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const triggerFileNames = new Set([
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.ts",
    "package.json",
]);

const hasWorkdirInstruction = (dockerfileSource: string): boolean =>
    stringSplit(normalizeLineEndings(dockerfileSource), "\n").some((line) => {
        const trimmed = line.trim();

        if (trimmed.length === 0 || trimmed.startsWith("#")) {
            return false;
        }

        return /^workdir\s+\S/iv.test(trimmed);
    });

/** Rule enforcing explicit WORKDIR instruction in Dockerfiles. */
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
                const dockerfileSource = readTextFileIfExists(dockerfilePath);

                if (dockerfileSource === null) {
                    return;
                }

                if (hasWorkdirInstruction(dockerfileSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, dockerfilePath),
                    },
                    messageId: "missingDockerfileWorkdir",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require a `WORKDIR` instruction in Dockerfiles so path semantics are explicit and predictable",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.docker",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-dockerfile-workdir"),
        },
        messages: {
            missingDockerfileWorkdir:
                "Dockerfile '{{ configPath }}' is missing a `WORKDIR` instruction. Declare an explicit working directory to avoid path-related build and runtime ambiguity.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-dockerfile-workdir",
});

export default rule;
