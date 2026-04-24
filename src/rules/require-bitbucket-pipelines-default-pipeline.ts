import { existsSync, readFileSync } from "node:fs";
import * as path from "node:path";
import { setHas, stringSplit } from "ts-extras";

import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const triggerFileNames = new Set([
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.ts",
]);

const bitbucketPipelinesPaths = [
    "bitbucket-pipelines.yml",
    "bitbucket-pipelines.yaml",
] as const;

const isCommentLine = (line: string): boolean =>
    line.trimStart().startsWith("#");

/**
 * Returns true if the YAML source contains a root-level `default:` pipeline
 * section (no leading whitespace, since it is a top-level YAML key).
 */
const hasDefaultPipeline = (yamlSource: string): boolean => {
    const lines = stringSplit(yamlSource.replaceAll("\r\n", "\n"), "\n");

    for (const line of lines) {
        if (isCommentLine(line)) {
            continue;
        }

        // `default:` is nested under the `pipelines:` key, never at
        // the document root, so check with trimStart().
        const trimmed = line.trimStart();

        if (trimmed === "default:" || trimmed.startsWith("default: ")) {
            return true;
        }
    }

    return false;
};

const getBitbucketPipelinesPath = (
    rootDirectoryPath: string
): null | string => {
    for (const relativePath of bitbucketPipelinesPaths) {
        const absolutePath = path.join(rootDirectoryPath, relativePath);

        if (existsSync(absolutePath)) {
            return absolutePath;
        }
    }

    return null;
};

/** Rule definition for enforcing a default pipeline in Bitbucket Pipelines. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const lintedFilePath = context.physicalFilename;
        const lintedFileName = path.basename(lintedFilePath);

        if (!setHas(triggerFileNames, lintedFileName)) {
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

                const pipelinesSource = (() => {
                    try {
                        return readFileSync(pipelinesPath, "utf8");
                    } catch {
                        return null;
                    }
                })();

                if (pipelinesSource === null) {
                    return;
                }

                if (hasDefaultPipeline(pipelinesSource)) {
                    return;
                }

                context.report({
                    messageId: "missingBitbucketDefaultPipeline",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require a `default:` pipeline section in `bitbucket-pipelines.yml` to ensure all branches have CI coverage.",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.bitbucket",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl(
                "require-bitbucket-pipelines-default-pipeline"
            ),
        },
        messages: {
            missingBitbucketDefaultPipeline:
                "`bitbucket-pipelines.yml` is missing a `default:` pipeline section. Add a default pipeline to ensure all branches without specific pipeline rules are still covered by CI.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-bitbucket-pipelines-default-pipeline",
});

export default rule;
