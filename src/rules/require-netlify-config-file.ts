import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for requiring a Netlify config file. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repoPlugin.configs.netlify",
            "repoPlugin.configs.strict",
            "repoPlugin.configs.all",
        ],
        description: "require a `netlify.toml` configuration file.",
        messageId: "missingNetlifyConfigFile",
        messageText:
            "Netlify preset requires netlify.toml. Commit the build and deploy configuration so hosting behavior is versioned with the repository.",
        name: "require-netlify-config-file",
        recommendation: false,
        requirement: {
            kind: "file",
            path: "netlify.toml",
        },
    });

export default rule;
