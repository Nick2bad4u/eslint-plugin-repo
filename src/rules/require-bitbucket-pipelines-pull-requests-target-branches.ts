import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { setHas, stringSplit } from "ts-extras";

import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const isPullRequestsHeadingLine = (line: string): boolean =>
    line.trim() === "pull-requests:";
const isPullRequestTargetBranchKeyLine = (line: string): boolean => {
    const trimmedLine = line.trim();

    if (trimmedLine.length === 0 || trimmedLine.startsWith("#")) {
        return false;
    }

    const colonOffset = trimmedLine.indexOf(":");

    return colonOffset > 0;
};

const triggerFileNames = new Set([
    "eslint.config.cjs",
    "eslint.config.js",
    "eslint.config.mjs",
]);

/**
 * Check whether a `pull-requests:` block declares at least one target-branch
 * key.
 */
const hasPullRequestTargetBranch = (yamlSource: string): boolean => {
    const normalizedSource = yamlSource.replaceAll(/\r\n?/gv, "\n");
    const lines = stringSplit(normalizedSource, "\n");

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
        const line = lines[lineIndex] ?? "";

        if (!isPullRequestsHeadingLine(line)) {
            continue;
        }

        const pullRequestsIndent = line.search(/\S/v);

        for (
            let childLineIndex = lineIndex + 1;
            childLineIndex < lines.length;
            childLineIndex += 1
        ) {
            const childLine = lines[childLineIndex] ?? "";
            const trimmedChildLine = childLine.trim();

            if (
                trimmedChildLine.length === 0 ||
                trimmedChildLine.startsWith("#")
            ) {
                continue;
            }

            const childIndent = childLine.search(/\S/v);

            if (childIndent <= pullRequestsIndent) {
                break;
            }

            if (
                childIndent === pullRequestsIndent + 2 &&
                isPullRequestTargetBranchKeyLine(childLine)
            ) {
                return true;
            }
        }
    }

    return false;
};

/** Rule enforcing pull-request target branch mappings in Bitbucket Pipelines. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const triggerFileName = basename(context.physicalFilename);

        if (!setHas(triggerFileNames, triggerFileName)) {
            return {};
        }

        const repositoryRoot = dirname(context.physicalFilename);
        const pipelinesConfigPath = join(
            repositoryRoot,
            "bitbucket-pipelines.yml"
        );

        if (!existsSync(pipelinesConfigPath)) {
            return {};
        }

        return {
            Program: (node): void => {
                const pipelinesSource = readFileSync(
                    pipelinesConfigPath,
                    "utf8"
                );

                const hasPullRequestHeading = stringSplit(
                    pipelinesSource.replaceAll(/\r\n?/gv, "\n"),
                    "\n"
                ).some((line) => isPullRequestsHeadingLine(line));

                if (!hasPullRequestHeading) {
                    return;
                }

                if (hasPullRequestTargetBranch(pipelinesSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: "bitbucket-pipelines.yml",
                    },
                    messageId: "missingPullRequestTargetBranches",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require target branch mappings under Bitbucket pull-request pipelines",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.strict",
                "repoPlugin.configs.bitbucket",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl(
                "require-bitbucket-pipelines-pull-requests-target-branches"
            ),
        },
        messages: {
            missingPullRequestTargetBranches:
                "Bitbucket Pipelines config '{{ configPath }}' defines `pull-requests:` but no target-branch mappings. Add at least one branch pattern (for example, `\"**\":`).",
        },
        schema: [],
        type: "problem",
    },
    name: "require-bitbucket-pipelines-pull-requests-target-branches",
});

export default rule;
