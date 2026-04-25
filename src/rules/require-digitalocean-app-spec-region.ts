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

const isBlankOrCommentLine = (line: string): boolean => {
    const trimmed = line.trim();

    return trimmed.length === 0 || trimmed.startsWith("#");
};

const getIndentationWidth = (line: string): number => {
    let width = 0;

    for (const character of line) {
        if (character !== " ") {
            break;
        }

        width += 1;
    }

    return width;
};

const hasRootRegion = (yamlSource: string): boolean =>
    stringSplit(normalizeLineEndings(yamlSource), "\n").some((line) => {
        if (isBlankOrCommentLine(line)) {
            return false;
        }

        if (getIndentationWidth(line) !== 0) {
            return false;
        }

        return line.trimStart().startsWith("region:");
    });

/** Rule enforcing explicit DigitalOcean App Platform region settings. */
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

                if (hasRootRegion(appSpecSource)) {
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
