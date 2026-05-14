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
    "require-aws-amplify-artifacts-base-directory",
    "require-aws-amplify-artifacts-base-directory-relative-path",
    "require-aws-amplify-artifacts-files",
    "require-aws-amplify-artifacts-files-non-empty",
    "require-aws-amplify-build-commands",
    "require-aws-amplify-config-file",
    "require-aws-amplify-version",
    "require-aws-amplify-version-value",
    "require-azure-pipelines-config-file",
    "require-azure-pipelines-execution-plan",
    "require-azure-pipelines-name",
    "require-azure-pipelines-pr-branches",
    "require-azure-pipelines-pr-trigger",
    "require-azure-pipelines-trigger",
    "require-azure-pipelines-trigger-branches",
    "require-azure-pipelines-trigger-include-branches",
    "require-bitbucket-pipelines-clone-depth",
    "require-bitbucket-pipelines-config-file",
    "require-bitbucket-pipelines-default-pipeline",
    "require-bitbucket-pipelines-image-pinned-tag",
    "require-bitbucket-pipelines-max-time",
    "require-bitbucket-pipelines-pull-requests",
    "require-bitbucket-pipelines-pull-requests-target-branches",
    "require-bitbucket-pipelines-step-name",
    "require-changelog-file",
    "require-code-of-conduct-file",
    "require-codeowners-file",
    "require-codeowners-reviewable-patterns",
    "require-contributing-file",
    "require-copilot-instructions-file",
    "require-dependabot-config-file",
    "require-dependabot-grouping",
    "require-dependabot-reviewers",
    "require-dependabot-schedule",
    "require-dependabot-update-entries",
    "require-dependency-update-config",
    "require-digitalocean-app-spec-component",
    "require-digitalocean-app-spec-file",
    "require-digitalocean-app-spec-name",
    "require-digitalocean-app-spec-name-value",
    "require-digitalocean-app-spec-region",
    "require-digitalocean-app-spec-region-lowercase",
    "require-digitalocean-app-spec-region-value",
    "require-dockerfile",
    "require-dockerfile-base-image-tag",
    "require-dockerfile-cmd-or-entrypoint",
    "require-dockerfile-first-instruction-from",
    "require-dockerfile-from-instruction",
    "require-dockerfile-user",
    "require-dockerfile-workdir",
    "require-dockerignore-file",
    "require-forgejo-actions-concurrency",
    "require-forgejo-actions-job-timeout-minutes",
    "require-forgejo-actions-no-write-all-permissions",
    "require-forgejo-actions-pinned-sha",
    "require-forgejo-actions-workflow-dispatch",
    "require-forgejo-actions-workflow-file",
    "require-forgejo-actions-workflow-name",
    "require-forgejo-actions-workflow-permissions",
    "require-forgejo-actions-workflow-trigger-coverage",
    "require-gitattributes-file",
    "require-github-actions-workflow-file",
    "require-github-actions-workflow-name",
    "require-github-code-scanning-workflow",
    "require-github-issue-template-labels",
    "require-gitignore-file",
    "require-gitlab-ci-cache-policy",
    "require-gitlab-ci-config-file",
    "require-gitlab-ci-default-timeout",
    "require-gitlab-ci-interruptible",
    "require-gitlab-ci-merge-request-pipelines",
    "require-gitlab-ci-needs-dag",
    "require-gitlab-ci-rules-over-only-except",
    "require-gitlab-ci-security-scanning",
    "require-gitlab-ci-stages",
    "require-gitlab-ci-workflow-rules",
    "require-gitlab-issue-template-file",
    "require-gitlab-merge-request-template-file",
    "require-google-cloud-build-config-file",
    "require-google-cloud-build-step-name",
    "require-google-cloud-build-steps",
    "require-google-cloud-build-steps-non-empty",
    "require-google-cloud-build-timeout",
    "require-google-cloud-build-timeout-format",
    "require-google-cloud-build-timeout-max",
    "require-google-cloud-build-timeout-positive",
    "require-issue-template-file",
    "require-license-file",
    "require-license-spdx-identifier",
    "require-netlify-build-command",
    "require-netlify-build-command-non-empty",
    "require-netlify-build-publish-directory",
    "require-netlify-build-section",
    "require-netlify-config-file",
    "require-netlify-publish-directory-no-trailing-slash",
    "require-netlify-publish-directory-non-empty",
    "require-netlify-publish-relative-path",
    "require-node-version-file",
    "require-nvmrc-file",
    "require-pr-template-checklist-items",
    "require-pull-request-template-file",
    "require-readme-badges",
    "require-readme-file",
    "require-readme-sections",
    "require-release-config-file",
    "require-secret-scanning-config",
    "require-security-policy-contact-channel",
    "require-security-policy-file",
    "require-single-codeowners-file",
    "require-support-file",
    "require-vercel-build-command",
    "require-vercel-config-file",
    "require-vercel-config-object",
    "require-vercel-schema",
    "require-vercel-schema-url",
    "require-vercel-valid-json",
    "require-vercel-version-value",
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
