import { basename, dirname, relative } from "node:path";
import { setHas } from "ts-extras";

import {
    hasTopLevelYamlKey,
    providerRuleTriggerFileNames,
} from "../_internal/config-file-scanner.js";
import {
    getDigitalOceanAppSpecPath,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

/** Rule enforcing explicit DigitalOcean app spec name field. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const triggerFileName = basename(context.physicalFilename);

        if (!setHas(providerRuleTriggerFileNames, triggerFileName)) {
            return {};
        }

        const repositoryRoot = dirname(context.physicalFilename);
        const appSpecPath = getDigitalOceanAppSpecPath(repositoryRoot);

        if (appSpecPath === null) {
            return {};
        }

        return {
            Program(node) {
                const appSpecSource = readTextFileIfExists(appSpecPath);

                if (appSpecSource === null) {
                    return;
                }

                if (hasTopLevelYamlKey(appSpecSource, "name")) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, appSpecPath),
                    },
                    messageId: "missingDigitalOceanAppSpecName",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require a top-level `name` in DigitalOcean App Platform specs so deploy identity is explicit",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.digitalOcean",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-digitalocean-app-spec-name"),
        },
        messages: {
            missingDigitalOceanAppSpecName:
                "DigitalOcean app spec '{{ configPath }}' is missing top-level `name`. Define app identity explicitly in the repository spec.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-digitalocean-app-spec-name",
});

export default rule;
