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

const hasFromAsFirstInstruction = (dockerfileSource: string): boolean => {
    for (const line of stringSplit(
        normalizeLineEndings(dockerfileSource),
        "\n"
    )) {
        const trimmed = line.trim();

        if (trimmed.length === 0 || trimmed.startsWith("#")) {
            continue;
        }

        // Docker allows ARG instructions before FROM for build-time variable
        // substitution in the FROM image reference (e.g. ARG BASE=node:lts).
        // Skip all leading ARG instructions when looking for the first FROM.
        if (/^arg(?:\s|$)/iv.test(trimmed)) {
            continue;
        }

        return /^from\s+\S/iv.test(trimmed);
    }

    return false;
};

/** Rule enforcing Dockerfile first meaningful instruction to be FROM. */
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

                if (hasFromAsFirstInstruction(dockerfileSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, dockerfilePath),
                    },
                    messageId: "dockerfileFirstInstructionNotFrom",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require Dockerfile first non-comment instruction to be `FROM`",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.docker",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-dockerfile-first-instruction-from"),
        },
        messages: {
            dockerfileFirstInstructionNotFrom:
                "Dockerfile '{{ configPath }}' must start with `FROM` as the first non-comment instruction.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-dockerfile-first-instruction-from",
});

export default rule;
