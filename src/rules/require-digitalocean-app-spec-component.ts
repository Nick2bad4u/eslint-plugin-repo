import { basename, dirname, relative } from "node:path";
import { setHas, stringSplit } from "ts-extras";

import {
    getIndentationWidth,
    isBlankOrCommentLine,
    providerRuleTriggerFileNames,
} from "../_internal/config-file-scanner.js";
import {
    getDigitalOceanAppSpecPath,
    normalizeLineEndings,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const appSpecComponentKeys = new Set([
    "databases:",
    "functions:",
    "jobs:",
    "services:",
    "static_sites:",
    "workers:",
]);

const hasTopLevelComponent = (yamlSource: string): boolean =>
    stringSplit(normalizeLineEndings(yamlSource), "\n").some((line) => {
        if (isBlankOrCommentLine(line)) {
            return false;
        }

        if (getIndentationWidth(line) !== 0) {
            return false;
        }

        return setHas(appSpecComponentKeys, line.trimStart());
    });

/** Rule enforcing at least one component block in DigitalOcean app specs. */
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

                if (hasTopLevelComponent(appSpecSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, appSpecPath),
                    },
                    messageId: "missingDigitalOceanAppSpecComponent",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require at least one deployable component block in DigitalOcean App Platform specs",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.digitalOcean",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-digitalocean-app-spec-component"),
        },
        messages: {
            missingDigitalOceanAppSpecComponent:
                "DigitalOcean app spec '{{ configPath }}' does not define any top-level deployable component block (`services`, `workers`, `jobs`, `static_sites`, `functions`, or `databases`).",
        },
        schema: [],
        type: "problem",
    },
    name: "require-digitalocean-app-spec-component",
});

export default rule;
