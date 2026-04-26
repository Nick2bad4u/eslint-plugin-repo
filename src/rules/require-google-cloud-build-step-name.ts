import { basename, dirname, relative } from "node:path";
import { setHas, stringSplit } from "ts-extras";

import { providerRuleTriggerFileNames } from "../_internal/config-file-scanner.js";
import {
    getGoogleCloudBuildConfigPath,
    normalizeLineEndings,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const hasNamedStep = (yamlSource: string): boolean =>
    stringSplit(normalizeLineEndings(yamlSource), "\n").some((line) => {
        const trimmed = line.trim();

        if (trimmed.length === 0 || trimmed.startsWith("#")) {
            return false;
        }

        return trimmed.startsWith("- name:");
    });

/** Rule enforcing named steps in Google Cloud Build configs. */
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

                if (hasNamedStep(cloudBuildSource)) {
                    return;
                }

                context.report({
                    data: {
                        configPath: relative(repositoryRoot, configPath),
                    },
                    messageId: "missingGoogleCloudBuildStepName",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require at least one named step in Google Cloud Build configs for readable and auditable CI execution",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.googleCloud",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-google-cloud-build-step-name"),
        },
        messages: {
            missingGoogleCloudBuildStepName:
                "Google Cloud Build config '{{ configPath }}' does not contain a named step (`- name:`). Define explicit step names so execution behavior remains clear and reviewable.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-google-cloud-build-step-name",
});

export default rule;
