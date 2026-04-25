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

/** Rule enforcing explicit DigitalOcean App Platform region settings. */
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

                if (hasTopLevelYamlKey(appSpecSource, "region")) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, appSpecPath),
                    },
                    messageId: "missingDigitalOceanAppSpecRegion",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require a root `region` in DigitalOcean App Platform specs so deployment geography is explicit in version control",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.digitalOcean",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-digitalocean-app-spec-region"),
        },
        messages: {
            missingDigitalOceanAppSpecRegion:
                "DigitalOcean app spec '{{ configPath }}' is missing a root `region`. Declare deploy region explicitly so environment placement is reviewable and predictable.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-digitalocean-app-spec-region",
});

export default rule;
