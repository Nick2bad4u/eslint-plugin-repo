import { basename, dirname, relative } from "node:path";
import { setHas, stringSplit } from "ts-extras";

import {
    getIndentationWidth,
    isBlankOrCommentLine,
    providerRuleTriggerFileNames,
} from "../_internal/config-file-scanner.js";
import {
    getGoogleCloudBuildConfigPath,
    normalizeLineEndings,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const hasRootSteps = (yamlSource: string): boolean =>
    stringSplit(normalizeLineEndings(yamlSource), "\n").some((line) => {
        if (isBlankOrCommentLine(line)) {
            return false;
        }

        if (getIndentationWidth(line) !== 0) {
            return false;
        }

        return line.trimStart().startsWith("steps:");
    });

/** Rule enforcing explicit Cloud Build step definitions. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const triggerFileName = basename(context.physicalFilename);

        if (!setHas(providerRuleTriggerFileNames, triggerFileName)) {
            return {};
        }

        const repositoryRoot = dirname(context.physicalFilename);
        const configPath = getGoogleCloudBuildConfigPath(repositoryRoot);

        if (configPath === null) {
            return {};
        }

        return {
            Program(node) {
                const cloudBuildSource = readTextFileIfExists(configPath);

                if (cloudBuildSource === null) {
                    return;
                }

                if (hasRootSteps(cloudBuildSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "missingGoogleCloudBuildSteps",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require a root `steps` block in Google Cloud Build configs so the build pipeline is explicitly defined",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.googleCloud",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-google-cloud-build-steps"),
        },
        messages: {
            missingGoogleCloudBuildSteps:
                "Google Cloud Build config '{{ configPath }}' is missing a root `steps` block. Declare explicit build steps so CI behavior is deterministic and reviewable.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-google-cloud-build-steps",
});

export default rule;
