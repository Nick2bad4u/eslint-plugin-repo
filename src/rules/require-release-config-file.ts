import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/**
 * Rule definition for this repository compliance requirement.
 *
 * This rule approximates a "semver tagging strategy" check by detecting the
 * presence of a release automation configuration file. It cannot verify actual
 * tag semantics (which require API access) but can enforce that release tooling
 * is configured.
 */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repoPlugin.configs.github",
            "repoPlugin.configs.all",
        ],
        description:
            "require a release configuration file to enforce a structured release and versioning strategy.",
        messageId: "missingReleaseConfigFile",
        messageText:
            "Repository is missing a release configuration file. Add .github/release.yml (GitHub release labels), release-please-config.json, or a similar release automation config to establish a structured versioning strategy.",
        name: "require-release-config-file",
        recommendation: false,
        requirement: {
            kind: "one-of",
            paths: [
                ".github/release.yml",
                ".github/release.yaml",
                ".github/release-drafter.yml",
                ".github/release-drafter.yaml",
                "release-please-config.json",
                ".release-please-manifest.json",
                ".changeset/config.json",
                ".releaserc",
                ".releaserc.json",
                ".releaserc.js",
                ".releaserc.cjs",
                ".releaserc.mjs",
                ".releaserc.yml",
                ".releaserc.yaml",
                ".release-it.json",
                ".release-it.yml",
                ".release-it.yaml",
                ".release-it.js",
                ".release-it.cjs",
                ".release-it.mjs",
                "release.config.js",
                "release.config.cjs",
                "release.config.mjs",
                "release.config.ts",
            ],
        },
    });

export default rule;
