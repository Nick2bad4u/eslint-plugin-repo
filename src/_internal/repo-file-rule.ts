/* eslint-disable typedoc/require-exported-doc-comment -- migration scaffold stage: exported APIs are still being documented. */
import { existsSync, readdirSync, statSync } from "node:fs";
import * as path from "node:path";

import type { ConfigReference } from "./config-references.js";

import { createTypedRule } from "./typed-rule.js";

export type RepositoryFilePresenceRuleOptions = Readonly<{
    configReferences: readonly ConfigReference[];
    description: string;
    messageId: string;
    messageText: string;
    name: string;
    recommendation: boolean;
    requirement: FileRequirement;
    triggerFileNames?: readonly string[];
}>;

type FileRequirement =
    | Readonly<{
          directory: string;
          extensions: readonly string[];
          kind: "directory-with-extension";
      }>
    | Readonly<{ kind: "file"; path: string }>
    | Readonly<{ kind: "one-of"; paths: readonly string[] }>;

const defaultTriggerFileNames = [
    "eslint.config.js",
    "eslint.config.mjs",
    "package.json",
] as const;

const hasAnyMatchingFileInDirectory = (
    rootDirectoryPath: string,
    requirement: Extract<FileRequirement, { kind: "directory-with-extension" }>
): boolean => {
    const directoryPath = path.resolve(
        rootDirectoryPath,
        requirement.directory
    );
    if (!existsSync(directoryPath)) {
        return false;
    }

    const directoryStats = statSync(directoryPath, { throwIfNoEntry: false });
    const isDirectory = directoryStats?.isDirectory() === true;

    if (!isDirectory) {
        return false;
    }

    const directoryEntries = readdirSync(directoryPath, {
        withFileTypes: true,
    });

    return directoryEntries.some(
        (entry) =>
            entry.isFile() &&
            requirement.extensions.some((extension) =>
                entry.name.toLowerCase().endsWith(extension)
            )
    );
};

const doesRequirementExist = (
    rootDirectoryPath: string,
    requirement: FileRequirement
): boolean => {
    switch (requirement.kind) {
        case "directory-with-extension": {
            return hasAnyMatchingFileInDirectory(
                rootDirectoryPath,
                requirement
            );
        }

        case "file": {
            return existsSync(
                path.resolve(rootDirectoryPath, requirement.path)
            );
        }

        case "one-of": {
            return requirement.paths.some((candidatePath) =>
                existsSync(path.resolve(rootDirectoryPath, candidatePath))
            );
        }

        default: {
            throw new TypeError(
                `Unsupported file requirement shape: ${JSON.stringify(requirement)}`
            );
        }
    }
};

export const createRepositoryFilePresenceRule = (
    options: RepositoryFilePresenceRuleOptions
): ReturnType<typeof createTypedRule> => {
    const triggerFileNames = new Set(
        options.triggerFileNames ?? defaultTriggerFileNames
    );

    return createTypedRule({
        create(context) {
            return {
                Program(node) {
                    const filename = context.physicalFilename;
                    if (filename === "<input>") {
                        return;
                    }

                    if (!triggerFileNames.has(path.basename(filename))) {
                        return;
                    }

                    const rootDirectoryPath = path.dirname(filename);

                    if (
                        doesRequirementExist(
                            rootDirectoryPath,
                            options.requirement
                        )
                    ) {
                        return;
                    }

                    context.report({
                        messageId: options.messageId,
                        node,
                    });
                },
            };
        },
        defaultOptions: [],
        meta: {
            deprecated: false,
            docs: {
                description: options.description,
                frozen: false,
                recommended: options.recommendation,
                repoConfigs: options.configReferences,
                requiresTypeChecking: false,
            },
            messages: {
                [options.messageId]: options.messageText,
            },
            schema: [],
            type: "problem",
        },
        name: options.name,
    });
};
/* eslint-enable typedoc/require-exported-doc-comment */
