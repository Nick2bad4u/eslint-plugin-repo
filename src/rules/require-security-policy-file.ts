import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for this repository compliance requirement. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repoPlugin.configs.recommended",
            "repoPlugin.configs.strict",
            "repoPlugin.configs.github",
            "repoPlugin.configs.gitlab",
            "repoPlugin.configs.bitbucket",
            "repoPlugin.configs.codeberg",
            "repoPlugin.configs.all",
        ],
        description: "require a security policy for vulnerability disclosure.",
        messageId: "missingSecurityPolicyFile",
        messageText:
            "Repository is missing SECURITY.md. Add a security policy so researchers know how to report vulnerabilities responsibly.",
        name: "require-security-policy-file",
        recommendation: true,
        requirement: {
            kind: "file",
            path: "SECURITY.md",
        },
    });

export default rule;
