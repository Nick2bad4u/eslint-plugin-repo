import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/**
 * Rule definition for this repository compliance requirement.
 *
 * This rule enforces the presence of a repository settings configuration file
 * (.github/settings.yml) used by the probot/settings app or similar tooling to
 * declaratively manage repository settings such as branch protection rules,
 * team access, and labels. It acts as a proxy for verifying that repository
 * settings are managed as code rather than through the GitHub UI.
 */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repoPlugin.configs.github",
            "repoPlugin.configs.all",
        ],
        description:
            "require a repository settings configuration file to manage repository settings as code.",
        messageId: "missingRepositorySettingsFile",
        messageText:
            "Repository is missing a settings configuration file. Add .github/settings.yml (probot/settings app) or .github/repository-settings.yml to manage repository settings — branch protection rules, team access, and labels — as code instead of through the GitHub UI.",
        name: "require-repository-settings-file",
        recommendation: false,
        requirement: {
            kind: "one-of",
            paths: [
                ".github/settings.yml",
                ".github/settings.yaml",
                ".github/repository-settings.yml",
                ".github/repository-settings.yaml",
            ],
        },
    });

export default rule;
