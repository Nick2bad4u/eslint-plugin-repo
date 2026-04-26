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
    "require-dependency-update-config",
    "require-copilot-instructions-file",
    "require-secret-scanning-config",
    "require-github-code-scanning-workflow",
    "require-release-config-file",
    "require-license-spdx-identifier",
    "require-security-policy-contact-channel",
    "require-codeowners-reviewable-patterns",
    "require-readme-sections",
    "require-readme-badges",
    "require-github-issue-template-labels",
    "require-pr-template-checklist-items",
    "require-dependabot-schedule",
    "require-dependabot-update-entries",
    "require-dependabot-grouping",
    "require-gitlab-ci-cache-policy",
    "require-gitlab-ci-interruptible",
    "require-gitlab-ci-needs-dag",
    "require-bitbucket-pipelines-image-pinned-tag",
    "require-bitbucket-pipelines-clone-depth",
    "require-forgejo-actions-concurrency",
    "require-forgejo-actions-workflow-trigger-coverage",
    "require-aws-amplify-config-file",
    "require-aws-amplify-artifacts-base-directory",
    "require-azure-pipelines-config-file",
    "require-azure-pipelines-pr-trigger",
    "require-google-cloud-build-config-file",
    "require-google-cloud-build-timeout",
    "require-dockerfile",
    "require-dockerignore-file",
    "require-vercel-config-file",
    "require-netlify-config-file",
    "require-netlify-build-publish-directory",
    "require-digitalocean-app-spec-file",
    "require-aws-amplify-artifacts-files",
    "require-azure-pipelines-trigger",
    "require-google-cloud-build-steps",
    "require-dockerfile-base-image-tag",
    "require-vercel-build-command",
    "require-netlify-build-command",
    "require-digitalocean-app-spec-region",
    "require-aws-amplify-build-commands",
    "require-azure-pipelines-pr-branches",
    "require-google-cloud-build-step-name",
    "require-dockerfile-user",
    "require-vercel-schema",
    "require-netlify-build-section",
    "require-digitalocean-app-spec-component",
    "require-aws-amplify-version",
    "require-azure-pipelines-execution-plan",
    "require-google-cloud-build-timeout-format",
    "require-dockerfile-workdir",
    "require-vercel-valid-json",
    "require-netlify-publish-relative-path",
    "require-digitalocean-app-spec-name",
    "require-aws-amplify-artifacts-base-directory-relative-path",
    "require-azure-pipelines-name",
    "require-google-cloud-build-timeout-positive",
    "require-dockerfile-cmd-or-entrypoint",
    "require-vercel-config-object",
    "require-netlify-build-command-non-empty",
    "require-digitalocean-app-spec-region-value",
    "require-aws-amplify-version-value",
    "require-azure-pipelines-trigger-branches",
    "require-google-cloud-build-timeout-max",
    "require-dockerfile-from-instruction",
    "require-vercel-schema-url",
    "require-netlify-publish-directory-non-empty",
    "require-digitalocean-app-spec-name-value",
    "require-aws-amplify-artifacts-files-non-empty",
    "require-azure-pipelines-trigger-include-branches",
    "require-google-cloud-build-steps-non-empty",
    "require-dockerfile-first-instruction-from",
    "require-vercel-version-value",
    "require-netlify-publish-directory-no-trailing-slash",
    "require-digitalocean-app-spec-region-lowercase",
] as const;

const toRuleCatalogId = (ruleNumber: number): RuleCatalogId =>
    `R${String(ruleNumber).padStart(3, "0")}`;

/**
 * Ordered catalog entries for all plugin rules.
 */
const ruleCatalogEntries: readonly RuleCatalogEntry[] = orderedRuleNames.map(
    (ruleName, index) => {
        const ruleNumber = index + 1;

        return {
            ruleId: toRuleCatalogId(ruleNumber),
            ruleName,
            ruleNumber,
        };
    }
);

const ruleCatalogByRuleName = new Map(
    ruleCatalogEntries.map((entry) => [entry.ruleName, entry])
);

/**
 * Returns the catalog entry for a rule name, or `null` if not cataloged.
 */
export const getRuleCatalogEntryForRuleNameOrNull = (
    ruleName: string
): null | RuleCatalogEntry => ruleCatalogByRuleName.get(ruleName) ?? null;
