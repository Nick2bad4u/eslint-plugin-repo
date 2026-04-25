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

const hasFromInstruction = (dockerfileSource: string): boolean =>
    stringSplit(normalizeLineEndings(dockerfileSource), "\n").some((line) => {
        const trimmed = line.trim();

        if (trimmed.length === 0 || trimmed.startsWith("#")) {
            return false;
        }

        return /^from\s+\S/iv.test(trimmed);
    });

/** Rule enforcing Dockerfile base image instruction presence. */
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

                if (hasFromInstruction(dockerfileSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, dockerfilePath),
                    },
                    messageId: "missingDockerfileFromInstruction",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require Dockerfiles to declare at least one `FROM` instruction",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.docker",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-dockerfile-from-instruction"),
        },
        messages: {
            missingDockerfileFromInstruction:
                "Dockerfile '{{ configPath }}' is missing a `FROM` instruction. Declare the base image explicitly for deterministic builds.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-dockerfile-from-instruction",
});

export default rule;
