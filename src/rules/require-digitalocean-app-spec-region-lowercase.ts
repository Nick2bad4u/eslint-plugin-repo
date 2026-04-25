import { basename, dirname, relative } from "node:path";
import { setHas, stringSplit } from "ts-extras";

import {
    getDigitalOceanAppSpecPath,
    normalizeLineEndings,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const triggerFileNames = new Set([
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.ts",
    "package.json",
]);

const getTopLevelRegionValue = (yamlSource: string): null | string => {
    const regionLine = stringSplit(normalizeLineEndings(yamlSource), "\n").find(
        (line) => {
            const trimmed = line.trim();

            if (trimmed.length === 0 || trimmed.startsWith("#")) {
                return false;
            }

            return !line.startsWith(" ") && trimmed.startsWith("region:");
        }
    );

    if (typeof regionLine !== "string") {
        return null;
    }

    return regionLine
        .slice(regionLine.indexOf(":") + 1)
        .trim()
        .replaceAll(/["']/gv, "");
};

const isLowerCaseRegion = (value: string): boolean =>
    value.length > 0 && value === value.toLowerCase();

/** Rule enforcing lowercase DigitalOcean region values. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const triggerFileName = basename(context.physicalFilename);

        if (!setHas(triggerFileNames, triggerFileName)) {
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

                const regionValue = getTopLevelRegionValue(appSpecSource);

                // A missing region key is not a casing violation; the
                // require-digitalocean-app-spec-region rule covers existence.
                if (
                    typeof regionValue !== "string" ||
                    regionValue.length === 0
                ) {
                    return;
                }

                if (isLowerCaseRegion(regionValue)) {
                    return;
                }

                context.report({
                    data: { configPath: relative(repositoryRoot, appSpecPath) },
                    messageId: "nonLowercaseDigitalOceanRegion",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require DigitalOcean app spec `region` values to use lowercase canonical form",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.digitalOcean",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl(
                "require-digitalocean-app-spec-region-lowercase"
            ),
        },
        messages: {
            nonLowercaseDigitalOceanRegion:
                "DigitalOcean app spec '{{ configPath }}' has non-lowercase `region` value. Use lowercase region identifiers (for example `nyc`).",
        },
        schema: [],
        type: "problem",
    },
    name: "require-digitalocean-app-spec-region-lowercase",
});

export default rule;
