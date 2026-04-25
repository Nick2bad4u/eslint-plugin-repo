import { createRepositoryFilePresenceRule } from "../_internal/repo-file-rule.js";

/**
 * Rule definition for this repository compliance requirement.
 *
 * This rule checks for the presence of a CodeQL or code scanning workflow file
 * in `.github/workflows/`. It looks for common known file names used by
 * GitHub's default CodeQL setup as well as manually authored analysis
 * workflows.
 */
const rule: ReturnType<typeof createRepositoryFilePresenceRule> =
    createRepositoryFilePresenceRule({
        configReferences: [
            "repoPlugin.configs.github",
            "repoPlugin.configs.all",
        ],
        description:
            "require a GitHub code scanning workflow file to enable repository-level code scanning automation.",
        messageId: "missingGitHubCodeScanningWorkflow",
        messageText:
            "Repository is missing a recognised GitHub code scanning workflow. Add a CodeQL or equivalent workflow such as `.github/workflows/codeql.yml` to automate repository-level code scanning.",
        name: "require-github-code-scanning-workflow",
        recommendation: false,
        requirement: {
            kind: "one-of",
            paths: [
                ".github/workflows/codeql.yml",
                ".github/workflows/codeql.yaml",
                ".github/workflows/codeql-analysis.yml",
                ".github/workflows/codeql-analysis.yaml",
                ".github/workflows/code-scanning.yml",
                ".github/workflows/code-scanning.yaml",
                ".github/workflows/security-analysis.yml",
                ".github/workflows/security-analysis.yaml",
            ],
        },
    });

export default rule;
