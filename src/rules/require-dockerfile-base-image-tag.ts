import { basename, dirname, relative } from "node:path";
import { arrayFirst, isEmpty, setHas } from "ts-extras";

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

type UnpinnedBaseImageMatch = Readonly<{
    imageReference: string;
}>;

const extractBaseImageReference = (line: string): null | string => {
    const trimmed = line.trim();

    if (trimmed.length === 0 || trimmed.startsWith("#")) {
        return null;
    }

    if (!/^from\s+/iv.test(trimmed)) {
        return null;
    }

    const fromBody = trimmed.replace(/^from\s+/iv, "");
    const parts = fromBody.split(/\s+/v).filter((part) => part.length > 0);

    if (isEmpty(parts)) {
        return null;
    }

    const firstPart = arrayFirst(parts);

    if (typeof firstPart !== "string") {
        return null;
    }

    const imagePart = firstPart.startsWith("--platform=")
        ? parts[1]
        : firstPart;

    return typeof imagePart === "string" && imagePart.length > 0
        ? imagePart
        : null;
};

const hasExplicitTag = (imageReference: string): boolean => {
    const lastSlashIndex = imageReference.lastIndexOf("/");
    const lastColonIndex = imageReference.lastIndexOf(":");

    return lastColonIndex > lastSlashIndex;
};

const getFirstUnpinnedBaseImageMatch = (
    dockerfileSource: string
): null | UnpinnedBaseImageMatch => {
    const lines = splitConfigLines(dockerfileSource);

    for (const line of lines) {
        const imageReference = extractBaseImageReference(line);

        if (imageReference === null) {
            continue;
        }

        if (
            imageReference === "scratch" ||
            imageReference.startsWith("${") ||
            imageReference.includes("@sha256:")
        ) {
            continue;
        }

        if (!hasExplicitTag(imageReference)) {
            return { imageReference };
        }

        if (imageReference.toLowerCase().endsWith(":latest")) {
            return { imageReference };
        }
    }

    return null;
};

/** Rule enforcing pinned Docker base image references. */
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

                const unpinnedMatch =
                    getFirstUnpinnedBaseImageMatch(dockerfileSource);

                if (unpinnedMatch === null) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, dockerfilePath),
                        imageReference: unpinnedMatch.imageReference,
                    },
                    messageId: "unpinnedDockerBaseImageTag",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require Dockerfile base images to use explicit non-`latest` tags or digests so container builds stay reproducible",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.docker",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-dockerfile-base-image-tag"),
        },
        messages: {
            unpinnedDockerBaseImageTag:
                "Dockerfile '{{ configPath }}' uses an unpinned base image reference '{{ imageReference }}'. Pin a non-`latest` tag or digest so image builds remain deterministic.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-dockerfile-base-image-tag",
});

export default rule;
