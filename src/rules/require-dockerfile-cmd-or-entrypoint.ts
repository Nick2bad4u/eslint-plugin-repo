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

const hasCmdOrEntrypoint = (dockerfileSource: string): boolean =>
    splitConfigLines(dockerfileSource).some((line) => {
        const trimmed = line.trim();

        if (trimmed.length === 0 || trimmed.startsWith("#")) {
            return false;
        }

        return (
            /^cmd\s+\S/iv.test(trimmed) || /^entrypoint\s+\S/iv.test(trimmed)
        );
    });

/** Rule enforcing explicit container startup command metadata in Dockerfiles. */
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

                if (hasCmdOrEntrypoint(dockerfileSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, dockerfilePath),
                    },
                    messageId: "missingDockerfileCmdOrEntrypoint",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require `CMD` or `ENTRYPOINT` in Dockerfiles so container startup behavior is explicit",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.docker",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-dockerfile-cmd-or-entrypoint"),
        },
        messages: {
            missingDockerfileCmdOrEntrypoint:
                "Dockerfile '{{ configPath }}' is missing `CMD` or `ENTRYPOINT`. Declare container startup behavior explicitly in version control.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-dockerfile-cmd-or-entrypoint",
});

export default rule;
