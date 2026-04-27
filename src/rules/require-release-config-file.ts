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
            "Repository is missing a supported release tooling or release metadata configuration file. Add Release Please, Changesets, semantic-release, release-it, git-cliff, Release Drafter, or GitHub release metadata config so release behavior is documented in the repository.",
        name: "require-release-config-file",
        recommendation: false,
        requirement: {
            kind: "one-of",
            paths: [
                ".github/release.yml",
                ".github/release.yaml",
                ".github/release-drafter.yml",
                ".github/release-drafter.yaml",
                ".github/workflows/release.yml",
                ".github/workflows/release.yaml",
                ".github/workflows/release-drafter.yml",
                ".github/workflows/release-drafter.yaml",
                "release-please-config.json",
                ".release-please-manifest.json",
                ".release-please-config.json",
                ".release-please-config.yaml",
                ".release-please-config.yml",
                ".release-please-config.json5",
                ".changeset/config.json",
                ".changeset/config.yaml",
                ".changeset/config.yml",
                ".changeset/config.js",
                ".changeset/config.cjs",
                ".changeset/config.mjs",
                ".releaserc",
                ".releaserc.json",
                ".releaserc.js",
                ".releaserc.cjs",
                ".releaserc.mjs",
                ".releaserc.yml",
                ".releaserc.yaml",
                ".releaserc.ts",
                ".release-it.json",
                ".release-it.yml",
                ".release-it.yaml",
                ".release-it.js",
                ".release-it.cjs",
                ".release-it.mjs",
                ".release-it.ts",
                "release.config.js",
                "release.config.cjs",
                "release.config.mjs",
                "release.config.ts",
                "release.config.json",
                "release.config.yaml",
                "release.config.yml",
                "release-it.config.js",
                "release-it.config.cjs",
                "release-it.config.mjs",
                "release-it.config.ts",
                "release-it.config.json",
                "release-it.config.yaml",
                "release-it.config.yml",
                "cliff.toml",
                ".cliff.toml",
                "cliff.yaml",
                "cliff.yml",
                ".cliff.yaml",
                ".cliff.yml",
                ".release.json",
                ".release.yaml",
                ".release.yml",
                ".release.js",
                ".release.cjs",
                ".release.mjs",
            ],
        },
    });

export default rule;
