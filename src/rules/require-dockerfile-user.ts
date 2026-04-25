import { basename, dirname, relative } from "node:path";
import { setHas } from "ts-extras";

import {
    providerRuleTriggerFileNames,
    splitConfigLines,
} from "../_internal/config-file-scanner.js";
import {
    getRepositoryDockerfilePath,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const hasUserInstruction = (dockerfileSource: string): boolean =>
    splitConfigLines(dockerfileSource).some((line) => {
        const trimmed = line.trim();

        if (trimmed.length === 0 || trimmed.startsWith("#")) {
            return false;
        }

        return /^user\s+\S/iv.test(trimmed);
    });

/** Rule enforcing explicit USER instruction in Dockerfiles. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const triggerFileName = basename(context.physicalFilename);

        if (!setHas(providerRuleTriggerFileNames, triggerFileName)) {
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

                if (hasUserInstruction(dockerfileSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, dockerfilePath),
                    },
                    messageId: "missingDockerfileUserInstruction",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require an explicit `USER` instruction in Dockerfiles so container runtime privilege is intentional and reviewable",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.docker",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-dockerfile-user"),
        },
        messages: {
            missingDockerfileUserInstruction:
                "Dockerfile '{{ configPath }}' is missing a `USER` instruction. Declare the runtime user explicitly to avoid unintentional root execution in containers.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-dockerfile-user",
});

export default rule;
