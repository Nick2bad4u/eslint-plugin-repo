/**
 * Catalog metadata for a rule.
 */
export type RuleCatalogEntry = Readonly<{
    ruleId: RuleCatalogId;
    ruleName: string;
    ruleNumber: number;
}>;

/**
 * Stable rule identifier in `R###` format.
 */
export type RuleCatalogId = `R${string}`;

const orderedRuleNames = [
    "require-readme-file",
    "require-license-file",
    "require-contributing-file",
    "require-code-of-conduct-file",
    "require-security-policy-file",
    "require-support-file",
    "require-codeowners-file",
    "require-issue-template-file",
    "require-pull-request-template-file",
    "require-dependabot-config-file",
    "require-github-actions-workflow-file",
    "require-gitlab-ci-config-file",
    "require-gitlab-issue-template-file",
    "require-gitlab-merge-request-template-file",
    "require-bitbucket-pipelines-config-file",
    "require-forgejo-actions-workflow-file",
    "require-gitlab-ci-security-scanning",
    "require-bitbucket-pipelines-default-pipeline",
    "require-forgejo-actions-workflow-permissions",
    "require-bitbucket-pipelines-pull-requests",
    "require-gitlab-ci-merge-request-pipelines",
    "require-forgejo-actions-pinned-sha",
    "require-forgejo-actions-job-timeout-minutes",
    "require-forgejo-actions-no-write-all-permissions",
    "require-gitlab-ci-workflow-rules",
    "require-bitbucket-pipelines-max-time",
    "require-gitlab-ci-rules-over-only-except",
    "require-github-actions-workflow-name",
    "require-gitlab-ci-default-timeout",
    "require-forgejo-actions-workflow-name",
    "require-gitlab-ci-stages",
    "require-bitbucket-pipelines-step-name",
    "require-bitbucket-pipelines-pull-requests-target-branches",
    "require-dependabot-reviewers",
    "require-forgejo-actions-workflow-dispatch",
] as const;

const toRuleCatalogId = (ruleNumber: number): RuleCatalogId =>
    `R${String(ruleNumber).padStart(3, "0")}`;

/**
 * Ordered catalog entries for all plugin rules.
 */
export const ruleCatalogEntries: readonly RuleCatalogEntry[] =
    orderedRuleNames.map((ruleName, index) => {
        const ruleNumber = index + 1;

        return {
            ruleId: toRuleCatalogId(ruleNumber),
            ruleName,
            ruleNumber,
        };
    });

const ruleCatalogByRuleName = new Map(
    ruleCatalogEntries.map((entry) => [entry.ruleName, entry])
);

/**
 * Returns the catalog entry for a rule name, or `null` if not cataloged.
 */
export const getRuleCatalogEntryForRuleNameOrNull = (
    ruleName: string
): null | RuleCatalogEntry => ruleCatalogByRuleName.get(ruleName) ?? null;
