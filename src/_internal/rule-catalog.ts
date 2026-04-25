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
    "require-changelog-file",
    "require-gitattributes-file",
    "require-gitignore-file",
    "require-node-version-file",
    "require-renovate-or-dependabot",
    "require-copilot-instructions-file",
    "require-secret-scanning-config",
    "require-code-scanning-workflow",
    "require-release-config-file",
    "require-license-spdx-identifier",
    "require-security-policy-contact-channel",
    "require-codeowners-reviewable-patterns",
    "require-readme-sections",
    "require-readme-badges",
    "require-issue-template-labels",
    "require-pr-template-checklist-items",
    "require-dependabot-schedule",
    "require-dependabot-ecosystem-coverage",
    "require-dependabot-grouping",
    "require-gitlab-ci-cache-policy",
    "require-gitlab-ci-interruptible",
    "require-gitlab-ci-needs-dag",
    "require-bitbucket-pipelines-image-pinned-tag",
    "require-bitbucket-pipelines-clone-depth",
    "require-forgejo-actions-concurrency",
    "require-forgejo-actions-workflow-trigger-coverage",
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
