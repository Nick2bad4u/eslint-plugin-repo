import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for this repository compliance requirement. */
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
        description: "require a license file at the repository root.",
        messageId: "missingLicenseFile",
        messageText:
            "Repository is missing a license file. Add LICENSE (or LICENSE.md / LICENSE.txt) to make redistribution terms explicit.",
        name: "require-license-file",
        recommendation: true,
        requirement: {
            kind: "one-of",
            paths: [
                "LICENSE",
                "LICENSE.md",
                "LICENSE.txt",
            ],
        },
    });

export default rule;
