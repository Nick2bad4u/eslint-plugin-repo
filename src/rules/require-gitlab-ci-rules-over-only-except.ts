import * as path from "node:path";
import { arrayJoin, isEmpty, setHas, stringSplit } from "ts-extras";

import {
    isBlankOrCommentLine,
    providerRuleTriggerFileNames,
} from "../_internal/config-file-scanner.js";
import {
    getGitLabCiConfigPath,
    normalizeLineEndings,
    readTextFileIfExists,
} from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const collectOnlyExceptUsages = (yamlSource: string): readonly string[] => {
    const lines = stringSplit(normalizeLineEndings(yamlSource), "\n");
    const findings: string[] = [];

    for (const [index, line] of lines.entries()) {
        if (isBlankOrCommentLine(line)) {
            continue;
        }

        const trimmed = line.trimStart();

        if (trimmed.startsWith("only:") || trimmed.startsWith("except:")) {
            findings.push(`line ${index + 1}: ${trimmed}`);
        }
    }

    return findings;
};

/** Rule definition for requiring GitLab CI `rules` over legacy `only/except`. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const lintedFilePath = context.physicalFilename;
        const lintedFileName = path.basename(lintedFilePath);

        if (!setHas(providerRuleTriggerFileNames, lintedFileName)) {
            return {};
        }

        const rootDirectoryPath = path.dirname(lintedFilePath);

        return {
            Program(node) {
                const gitlabCiPath = getGitLabCiConfigPath(rootDirectoryPath);

                if (gitlabCiPath === null) {
                    return;
                }

                const gitlabCiSource = readTextFileIfExists(gitlabCiPath);

                if (gitlabCiSource === null) {
                    return;
                }

                const onlyExceptUsages =
                    collectOnlyExceptUsages(gitlabCiSource);

                if (isEmpty(onlyExceptUsages)) {
                    return;
                }

                context.report({
                    data: {
                        usages: arrayJoin(onlyExceptUsages, "; "),
                    },
                    messageId: "foundOnlyExceptUsage",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require GitLab CI `rules` instead of legacy `only`/`except` job filtering.",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.gitlab",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-gitlab-ci-rules-over-only-except"),
        },
        messages: {
            foundOnlyExceptUsage:
                "`.gitlab-ci.yml` contains legacy `only`/`except` filters ({{usages}}). Prefer `rules` for clearer, modern pipeline behavior.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "require-gitlab-ci-rules-over-only-except",
});

export default rule;
