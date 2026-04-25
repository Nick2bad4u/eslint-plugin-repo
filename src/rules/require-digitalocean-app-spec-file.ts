import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for requiring a DigitalOcean App Platform spec file. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repoPlugin.configs.digitalOcean",
            "repoPlugin.configs.strict",
            "repoPlugin.configs.all",
        ],
        description:
            "require a DigitalOcean App Platform specification committed to the repository.",
        messageId: "missingDigitalOceanAppSpecFile",
        messageText:
            "DigitalOcean preset requires .do/app.yaml (or .do/app.yml). Commit the App Platform spec so deploy configuration is reviewable and reproducible.",
        name: "require-digitalocean-app-spec-file",
        recommendation: false,
        requirement: {
            kind: "one-of",
            paths: [".do/app.yaml", ".do/app.yml"],
        },
    });

export default rule;
