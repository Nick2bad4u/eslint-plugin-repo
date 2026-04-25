import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/**
 * Rule definition for this repository compliance requirement.
 *
 * This rule checks for repository-local release tooling or release metadata
 * configuration. It does not prove that releases are actually executed or that
 * versioning policy is correct; it only enforces the presence of a supported
 * configuration surface.
 */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repoPlugin.configs.github",
            "repoPlugin.configs.all",
        ],
        description:
            "require a repository release tooling or release metadata configuration file.",
        messageId: "missingReleaseConfigFile",
        messageText:
            "Repository is missing a supported release tooling or release metadata configuration file. Add Release Please, Changesets, semantic-release, release-it, Release Drafter, or GitHub release metadata config so release behavior is documented in the repository.",
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
