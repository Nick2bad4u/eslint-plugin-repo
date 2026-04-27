import { existsSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { arrayJoin, setHas } from "ts-extras";

import { providerRuleTriggerFileNames } from "../_internal/config-file-scanner.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const CODEOWNERS_PRECEDENCE_PATHS = [
    ".github/CODEOWNERS", // GitHub: highest priority
    ".gitlab/CODEOWNERS", // GitLab: highest priority
    ".bitbucket/CODEOWNERS", // Bitbucket Cloud: supported CODEOWNERS location
    "CODEOWNERS", // Both platforms: root (lower priority than platform-specific dirs)
    "docs/CODEOWNERS", // GitHub only: lowest priority
] as const;

const findExistingCodeownersPaths = (
    repositoryRootPath: string
): readonly string[] =>
    CODEOWNERS_PRECEDENCE_PATHS.filter((relativePath) =>
        existsSync(join(repositoryRootPath, relativePath))
    );

/** Rule enforcing a single authoritative CODEOWNERS file location. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const lintedFileName = basename(context.physicalFilename);

        if (!setHas(providerRuleTriggerFileNames, lintedFileName)) {
            return {};
        }

        const repositoryRootPath = dirname(context.physicalFilename);

        return {
            Program(node): void {
                const existingCodeownersPaths =
                    findExistingCodeownersPaths(repositoryRootPath);

                if (existingCodeownersPaths.length <= 1) {
                    return;
                }

                const primaryPath = existingCodeownersPaths[0];

                if (primaryPath === undefined) {
                    return;
                }

                context.report({
                    data: {
                        allPaths: arrayJoin(existingCodeownersPaths, ", "),
                        primaryPath,
                    },
                    messageId: "multipleCodeownersFiles",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            description:
                "require a single CODEOWNERS file location to avoid precedence ambiguity",
            frozen: false,
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.strict",
                "repoPlugin.configs.github",
                "repoPlugin.configs.bitbucket",
                "repoPlugin.configs.gitlab",
                "repoPlugin.configs.codeberg",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            ruleId: "",
            ruleNumber: 0,
            url: createRuleDocsUrl("require-single-codeowners-file"),
        },
        messages: {
            multipleCodeownersFiles:
                "Multiple CODEOWNERS files found: {{ allPaths }}. Platforms apply their own precedence (GitHub: .github/CODEOWNERS → CODEOWNERS → docs/CODEOWNERS; GitLab: .gitlab/CODEOWNERS → CODEOWNERS; Bitbucket Cloud: .bitbucket/CODEOWNERS) and silently ignore lower-precedence files. Remove all but {{ primaryPath }} to keep ownership rules deterministic.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-single-codeowners-file",
});

export default rule;
