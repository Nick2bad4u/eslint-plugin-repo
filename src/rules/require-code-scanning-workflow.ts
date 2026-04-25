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
            "require a code scanning workflow file (CodeQL or equivalent) to detect vulnerabilities in the repository.",
        messageId: "missingCodeScanningWorkflow",
        messageText:
            "Repository is missing a code scanning workflow. Add a CodeQL analysis workflow at .github/workflows/codeql.yml (or equivalent) to automatically detect security vulnerabilities.",
        name: "require-code-scanning-workflow",
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
