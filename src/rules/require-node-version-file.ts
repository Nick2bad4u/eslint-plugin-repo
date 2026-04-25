import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/**
 * Rule definition for this repository compliance requirement.
 *
 * This rule is intentionally triggered only by `package.json` so that it runs
 * exclusively in Node.js projects that have already committed a `package.json`
 * to the repository root.
 */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repoPlugin.configs.strict",
            "repoPlugin.configs.all",
        ],
        description:
            "require a Node.js version specification file (.nvmrc or .node-version) when package.json is present.",
        messageId: "missingNodeVersionFile",
        messageText:
            "Repository has a package.json but is missing a Node.js version specification file. Add .nvmrc or .node-version at the root so contributors and CI pipelines use a consistent Node.js version.",
        name: "require-node-version-file",
        recommendation: false,
        requirement: {
            kind: "one-of",
            paths: [".nvmrc", ".node-version"],
        },
        triggerFileNames: ["package.json"],
    });

export default rule;
