import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/** Rule definition for this repository compliance requirement. */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: ["repoPlugin.configs.node", "repoPlugin.configs.all"],
        description: "require a .nvmrc file.",
        messageId: "missingNvmrcFile",
        messageText:
            "Repository is missing .nvmrc. Add .nvmrc at the root so contributors and CI pipelines use a consistent Node.js version.",
        name: "require-nvmrc-file",
        recommendation: false,
        requirement: {
            kind: "file",
            path: ".nvmrc",
        },
    });

export default rule;
