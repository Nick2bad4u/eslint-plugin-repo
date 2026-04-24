import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repo-compliance.configs.recommended",
            "repo-compliance.configs.strict",
            "repo-compliance.configs.github",
            "repo-compliance.configs.gitlab",
            "repo-compliance.configs.bitbucket",
            "repo-compliance.configs.codeberg",
            "repo-compliance.configs.all",
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
