import { existsSync } from "node:fs";
import * as path from "node:path";
import { isDefined, setHas, stringSplit } from "ts-extras";

import {
    providerRuleTriggerFileNames,
    stripInlineComment,
} from "../_internal/config-file-scanner.js";
import {
    normalizeLineEndings,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const bitbucketPipelinesRelativePath = "bitbucket-pipelines.yml";

const getBitbucketPipelinesPath = (
    rootDirectoryPath: string
): null | string => {
    const candidatePath = path.join(
        rootDirectoryPath,
        bitbucketPipelinesRelativePath
    );

    return existsSync(candidatePath) ? candidatePath : null;
};

const hasAnyMaxTime = (source: string): boolean => {
    const lines = stringSplit(normalizeLineEndings(source), "\n");

    for (const rawLine of lines) {
        if (!isDefined(rawLine)) {
            continue;
        }

        const line = stripInlineComment(rawLine).trim();

        if (line.startsWith("max-time:")) {
            return true;
        }
    }

    return false;
};

/** Rule definition for requiring Bitbucket Pipelines max-time controls. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const lintedFilePath = context.physicalFilename;
        const lintedFileName = path.basename(lintedFilePath);

        if (!setHas(providerRuleTriggerFileNames, lintedFileName)) {
            return {};
        }

        const rootDirectoryPath = path.dirname(lintedFilePath);

        return {
            Program(node) {
                const pipelinesPath =
                    getBitbucketPipelinesPath(rootDirectoryPath);

                if (pipelinesPath === null) {
                    return;
                }

                const pipelinesSource = readTextFileIfExists(pipelinesPath);

                if (pipelinesSource === null) {
                    return;
                }

                if (
                    pipelinesSource.length === 0 ||
                    hasAnyMaxTime(pipelinesSource)
                ) {
                    return;
                }

                context.report({
                    data: {
                        file: bitbucketPipelinesRelativePath,
                    },
                    messageId: "missingBitbucketMaxTime",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require a global options.max-time setting in bitbucket-pipelines.yml.",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.bitbucket",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-bitbucket-pipelines-max-time"),
        },
        messages: {
            missingBitbucketMaxTime:
                "Bitbucket pipelines configuration '{{file}}' should define options.max-time.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "require-bitbucket-pipelines-max-time",
});

export default rule;
