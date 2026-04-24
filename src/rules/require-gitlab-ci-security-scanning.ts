import { existsSync, readFileSync } from "node:fs";
import * as path from "node:path";
import { setHas, stringSplit } from "ts-extras";

import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const triggerFileNames = new Set([
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.ts",
]);

const gitlabCiPaths = [".gitlab-ci.yml", ".gitlab-ci.yaml"] as const;

/**
 * GitLab security scanning template name fragments checked via
 * `String.prototype.includes` (no regex — avoids super-linear issues).
 */
const securityTemplateFragments = [
    "Security/SAST",
    "Security/Secret-Detection",
    "Security/Dependency-Scanning",
    "Security/DAST",
    "Security/Container-Scanning",
    "Jobs/SAST",
] as const;

/**
 * Root-level GitLab CI job name prefixes for built-in security jobs. Checked
 * via `String.prototype.startsWith` on the trimmed line.
 */
const securityJobPrefixes = [
    "sast:",
    "secret_detection:",
    "dependency_scanning:",
    "dast:",
    "container_scanning:",
] as const;

const isCommentLine = (line: string): boolean =>
    line.trimStart().startsWith("#");

/** Returns true if the YAML source includes a recognizable security scan. */
const hasSecurityScanning = (yamlSource: string): boolean => {
    const lines = stringSplit(yamlSource.replaceAll("\r\n", "\n"), "\n");

    for (const line of lines) {
        if (isCommentLine(line)) {
            continue;
        }

        for (const fragment of securityTemplateFragments) {
            if (line.includes(fragment)) {
                return true;
            }
        }

        const trimmed = line.trimStart();

        for (const prefix of securityJobPrefixes) {
            if (trimmed.startsWith(prefix)) {
                return true;
            }
        }
    }

    return false;
};

const getGitLabCiPath = (rootDirectoryPath: string): null | string => {
    for (const relativePath of gitlabCiPaths) {
        const absolutePath = path.join(rootDirectoryPath, relativePath);

        if (existsSync(absolutePath)) {
            return absolutePath;
        }
    }

    return null;
};

/** Rule definition for enforcing GitLab security scanning in CI configuration. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const lintedFilePath = context.physicalFilename;
        const lintedFileName = path.basename(lintedFilePath);

        if (!setHas(triggerFileNames, lintedFileName)) {
            return {};
        }

        const rootDirectoryPath = path.dirname(lintedFilePath);

        return {
            Program(node) {
                const gitlabCiPath = getGitLabCiPath(rootDirectoryPath);

                if (gitlabCiPath === null) {
                    return;
                }

                const gitlabCiSource = (() => {
                    try {
                        return readFileSync(gitlabCiPath, "utf8");
                    } catch {
                        return null;
                    }
                })();

                if (gitlabCiSource === null) {
                    return;
                }

                if (hasSecurityScanning(gitlabCiSource)) {
                    return;
                }

                context.report({
                    messageId: "missingGitLabCiSecurityScanning",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "require at least one GitLab security scanning template or job in `.gitlab-ci.yml` to enforce supply-chain security.",
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.strict",
                "repoPlugin.configs.gitlab",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-gitlab-ci-security-scanning"),
        },
        messages: {
            missingGitLabCiSecurityScanning:
                "`.gitlab-ci.yml` does not include a GitLab security scanning template or job (SAST, Secret Detection, Dependency Scanning, DAST, or Container Scanning). Add at least one security scan to improve supply-chain security.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-gitlab-ci-security-scanning",
});

export default rule;
