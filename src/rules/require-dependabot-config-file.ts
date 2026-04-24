import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repo-compliance.configs.github",
            "repo-compliance.configs.strict",
            "repo-compliance.configs.all",
        ],
        description:
            "require a Dependabot configuration for automated dependency updates on GitHub.",
        messageId: "missingDependabotConfigFile",
        messageText:
            "GitHub preset requires .github/dependabot.yml. Add Dependabot configuration to keep dependencies and security patches current.",
        name: "require-dependabot-config-file",
        recommendation: false,
        requirement: {
            kind: "file",
            path: ".github/dependabot.yml",
        },
    });

export default rule;
