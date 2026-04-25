import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for requiring a Vercel project config file. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repoPlugin.configs.vercel",
            "repoPlugin.configs.strict",
            "repoPlugin.configs.all",
        ],
        description:
            "require a `vercel.json` configuration file committed to the repository.",
        messageId: "missingVercelConfigFile",
        messageText:
            "Vercel preset requires vercel.json. Commit project configuration so routing, headers, and build behavior stay reviewable instead of living only in the dashboard.",
        name: "require-vercel-config-file",
        recommendation: false,
        requirement: {
            kind: "file",
            path: "vercel.json",
        },
    });

export default rule;
