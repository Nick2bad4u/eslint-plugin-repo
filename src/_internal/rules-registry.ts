import type { TSESLint } from "@typescript-eslint/utils";
import type { UnknownArray } from "type-fest";

import requireBitbucketPipelinesCloneDepthRule from "../rules/require-bitbucket-pipelines-clone-depth.js";
import requireBitbucketPipelinesConfigFileRule from "../rules/require-bitbucket-pipelines-config-file.js";
import requireBitbucketPipelinesDefaultPipelineRule from "../rules/require-bitbucket-pipelines-default-pipeline.js";
import requireBitbucketPipelinesImagePinnedTagRule from "../rules/require-bitbucket-pipelines-image-pinned-tag.js";
import requireBitbucketPipelinesMaxTimeRule from "../rules/require-bitbucket-pipelines-max-time.js";
import requireBitbucketPipelinesPullRequestsTargetBranchesRule from "../rules/require-bitbucket-pipelines-pull-requests-target-branches.js";
import requireBitbucketPipelinesPullRequestsRule from "../rules/require-bitbucket-pipelines-pull-requests.js";
import requireBitbucketPipelinesStepNameRule from "../rules/require-bitbucket-pipelines-step-name.js";
import requireChangelogFileRule from "../rules/require-changelog-file.js";
import requireCodeOfConductFileRule from "../rules/require-code-of-conduct-file.js";
import requireCodeScanningWorkflowRule from "../rules/require-code-scanning-workflow.js";
import requireCodeownersFileRule from "../rules/require-codeowners-file.js";
import requireCodeownersReviewablePatternsRule from "../rules/require-codeowners-reviewable-patterns.js";
import requireContributingFileRule from "../rules/require-contributing-file.js";
import requireCopilotInstructionsFileRule from "../rules/require-copilot-instructions-file.js";
import requireDependabotConfigFileRule from "../rules/require-dependabot-config-file.js";
import requireDependabotEcosystemCoverageRule from "../rules/require-dependabot-ecosystem-coverage.js";
import requireDependabotGroupingRule from "../rules/require-dependabot-grouping.js";
import requireDependabotReviewersRule from "../rules/require-dependabot-reviewers.js";
import requireDependabotScheduleRule from "../rules/require-dependabot-schedule.js";
import requireForgejoActionsConcurrencyRule from "../rules/require-forgejo-actions-concurrency.js";
import requireForgejoActionsJobTimeoutMinutesRule from "../rules/require-forgejo-actions-job-timeout-minutes.js";
import requireForgejoActionsNoWriteAllPermissionsRule from "../rules/require-forgejo-actions-no-write-all-permissions.js";
import requireForgejoActionsPinnedShaRule from "../rules/require-forgejo-actions-pinned-sha.js";
import requireForgejoActionsWorkflowDispatchRule from "../rules/require-forgejo-actions-workflow-dispatch.js";
import requireForgejoActionsWorkflowFileRule from "../rules/require-forgejo-actions-workflow-file.js";
import requireForgejoActionsWorkflowNameRule from "../rules/require-forgejo-actions-workflow-name.js";
import requireForgejoActionsWorkflowPermissionsRule from "../rules/require-forgejo-actions-workflow-permissions.js";
import requireForgejoActionsWorkflowTriggerCoverageRule from "../rules/require-forgejo-actions-workflow-trigger-coverage.js";
import requireGitattributesFileRule from "../rules/require-gitattributes-file.js";
import requireGitHubActionsWorkflowFileRule from "../rules/require-github-actions-workflow-file.js";
import requireGitHubActionsWorkflowNameRule from "../rules/require-github-actions-workflow-name.js";
import requireGitignoreFileRule from "../rules/require-gitignore-file.js";
import requireGitLabCiCachePolicyRule from "../rules/require-gitlab-ci-cache-policy.js";
import requireGitLabCiConfigFileRule from "../rules/require-gitlab-ci-config-file.js";
import requireGitLabCiDefaultTimeoutRule from "../rules/require-gitlab-ci-default-timeout.js";
import requireGitLabCiInterruptibleRule from "../rules/require-gitlab-ci-interruptible.js";
import requireGitLabCiMergeRequestPipelinesRule from "../rules/require-gitlab-ci-merge-request-pipelines.js";
import requireGitLabCiNeedsDagRule from "../rules/require-gitlab-ci-needs-dag.js";
import requireGitLabCiRulesOverOnlyExceptRule from "../rules/require-gitlab-ci-rules-over-only-except.js";
import requireGitLabCiSecurityScanningRule from "../rules/require-gitlab-ci-security-scanning.js";
import requireGitLabCiStagesRule from "../rules/require-gitlab-ci-stages.js";
import requireGitLabCiWorkflowRulesRule from "../rules/require-gitlab-ci-workflow-rules.js";
import requireGitLabIssueTemplateFileRule from "../rules/require-gitlab-issue-template-file.js";
import requireGitLabMergeRequestTemplateFileRule from "../rules/require-gitlab-merge-request-template-file.js";
import requireIssueTemplateFileRule from "../rules/require-issue-template-file.js";
import requireIssueTemplateLabelsRule from "../rules/require-issue-template-labels.js";
import requireLicenseFileRule from "../rules/require-license-file.js";
import requireLicenseSpdxIdentifierRule from "../rules/require-license-spdx-identifier.js";
import requireNodeVersionFileRule from "../rules/require-node-version-file.js";
import requirePrTemplateChecklistItemsRule from "../rules/require-pr-template-checklist-items.js";
import requirePullRequestTemplateFileRule from "../rules/require-pull-request-template-file.js";
import requireReadmeBadgesRule from "../rules/require-readme-badges.js";
import requireReadmeFileRule from "../rules/require-readme-file.js";
import requireReadmeSectionsRule from "../rules/require-readme-sections.js";
import requireReleaseConfigFileRule from "../rules/require-release-config-file.js";
import requireRenovateOrDependabotRule from "../rules/require-renovate-or-dependabot.js";
import requireSecretScanningConfigRule from "../rules/require-secret-scanning-config.js";
import requireSecurityPolicyContactChannelRule from "../rules/require-security-policy-contact-channel.js";
import requireSecurityPolicyFileRule from "../rules/require-security-policy-file.js";
import requireSupportFileRule from "../rules/require-support-file.js";

/**
 * Rule-name pattern used by this plugin.
 */
export type RuleNamePattern = `require-${string}`;

/**
 * Rule module shape for rules with docs metadata.
 */
export type RuleWithDocs = TSESLint.RuleModule<string, Readonly<UnknownArray>>;

const asRuleWithDocs = (rule: Readonly<RuleWithDocs>): RuleWithDocs => rule;

/**
 * Canonical registry of plugin rules keyed by rule name.
 */
export const repoComplianceRules: Readonly<
    Record<RuleNamePattern, RuleWithDocs>
> = {
    "require-bitbucket-pipelines-clone-depth": asRuleWithDocs(
        requireBitbucketPipelinesCloneDepthRule
    ),
    "require-bitbucket-pipelines-config-file": asRuleWithDocs(
        requireBitbucketPipelinesConfigFileRule
    ),
    "require-bitbucket-pipelines-default-pipeline": asRuleWithDocs(
        requireBitbucketPipelinesDefaultPipelineRule
    ),
    "require-bitbucket-pipelines-image-pinned-tag": asRuleWithDocs(
        requireBitbucketPipelinesImagePinnedTagRule
    ),
    "require-bitbucket-pipelines-max-time": asRuleWithDocs(
        requireBitbucketPipelinesMaxTimeRule
    ),
    "require-bitbucket-pipelines-pull-requests": asRuleWithDocs(
        requireBitbucketPipelinesPullRequestsRule
    ),
    "require-bitbucket-pipelines-pull-requests-target-branches": asRuleWithDocs(
        requireBitbucketPipelinesPullRequestsTargetBranchesRule
    ),
    "require-bitbucket-pipelines-step-name": asRuleWithDocs(
        requireBitbucketPipelinesStepNameRule
    ),
    "require-changelog-file": asRuleWithDocs(requireChangelogFileRule),
    "require-code-of-conduct-file": asRuleWithDocs(
        requireCodeOfConductFileRule
    ),
    "require-code-scanning-workflow": asRuleWithDocs(
        requireCodeScanningWorkflowRule
    ),
    "require-codeowners-file": asRuleWithDocs(requireCodeownersFileRule),
    "require-codeowners-reviewable-patterns": asRuleWithDocs(
        requireCodeownersReviewablePatternsRule
    ),
    "require-contributing-file": asRuleWithDocs(requireContributingFileRule),
    "require-copilot-instructions-file": asRuleWithDocs(
        requireCopilotInstructionsFileRule
    ),
    "require-dependabot-config-file": asRuleWithDocs(
        requireDependabotConfigFileRule
    ),
    "require-dependabot-ecosystem-coverage": asRuleWithDocs(
        requireDependabotEcosystemCoverageRule
    ),
    "require-dependabot-grouping": asRuleWithDocs(
        requireDependabotGroupingRule
    ),
    "require-dependabot-reviewers": asRuleWithDocs(
        requireDependabotReviewersRule
    ),
    "require-dependabot-schedule": asRuleWithDocs(
        requireDependabotScheduleRule
    ),
    "require-forgejo-actions-concurrency": asRuleWithDocs(
        requireForgejoActionsConcurrencyRule
    ),
    "require-forgejo-actions-job-timeout-minutes": asRuleWithDocs(
        requireForgejoActionsJobTimeoutMinutesRule
    ),
    "require-forgejo-actions-no-write-all-permissions": asRuleWithDocs(
        requireForgejoActionsNoWriteAllPermissionsRule
    ),
    "require-forgejo-actions-pinned-sha": asRuleWithDocs(
        requireForgejoActionsPinnedShaRule
    ),
    "require-forgejo-actions-workflow-dispatch": asRuleWithDocs(
        requireForgejoActionsWorkflowDispatchRule
    ),
    "require-forgejo-actions-workflow-file": asRuleWithDocs(
        requireForgejoActionsWorkflowFileRule
    ),
    "require-forgejo-actions-workflow-name": asRuleWithDocs(
        requireForgejoActionsWorkflowNameRule
    ),
    "require-forgejo-actions-workflow-permissions": asRuleWithDocs(
        requireForgejoActionsWorkflowPermissionsRule
    ),
    "require-forgejo-actions-workflow-trigger-coverage": asRuleWithDocs(
        requireForgejoActionsWorkflowTriggerCoverageRule
    ),
    "require-gitattributes-file": asRuleWithDocs(requireGitattributesFileRule),
    "require-github-actions-workflow-file": asRuleWithDocs(
        requireGitHubActionsWorkflowFileRule
    ),
    "require-github-actions-workflow-name": asRuleWithDocs(
        requireGitHubActionsWorkflowNameRule
    ),
    "require-gitignore-file": asRuleWithDocs(requireGitignoreFileRule),
    "require-gitlab-ci-cache-policy": asRuleWithDocs(
        requireGitLabCiCachePolicyRule
    ),
    "require-gitlab-ci-config-file": asRuleWithDocs(
        requireGitLabCiConfigFileRule
    ),
    "require-gitlab-ci-default-timeout": asRuleWithDocs(
        requireGitLabCiDefaultTimeoutRule
    ),
    "require-gitlab-ci-interruptible": asRuleWithDocs(
        requireGitLabCiInterruptibleRule
    ),
    "require-gitlab-ci-merge-request-pipelines": asRuleWithDocs(
        requireGitLabCiMergeRequestPipelinesRule
    ),
    "require-gitlab-ci-needs-dag": asRuleWithDocs(requireGitLabCiNeedsDagRule),
    "require-gitlab-ci-rules-over-only-except": asRuleWithDocs(
        requireGitLabCiRulesOverOnlyExceptRule
    ),
    "require-gitlab-ci-security-scanning": asRuleWithDocs(
        requireGitLabCiSecurityScanningRule
    ),
    "require-gitlab-ci-stages": asRuleWithDocs(requireGitLabCiStagesRule),
    "require-gitlab-ci-workflow-rules": asRuleWithDocs(
        requireGitLabCiWorkflowRulesRule
    ),
    "require-gitlab-issue-template-file": asRuleWithDocs(
        requireGitLabIssueTemplateFileRule
    ),
    "require-gitlab-merge-request-template-file": asRuleWithDocs(
        requireGitLabMergeRequestTemplateFileRule
    ),
    "require-issue-template-file": asRuleWithDocs(requireIssueTemplateFileRule),
    "require-issue-template-labels": asRuleWithDocs(
        requireIssueTemplateLabelsRule
    ),
    "require-license-file": asRuleWithDocs(requireLicenseFileRule),
    "require-license-spdx-identifier": asRuleWithDocs(
        requireLicenseSpdxIdentifierRule
    ),
    "require-node-version-file": asRuleWithDocs(requireNodeVersionFileRule),
    "require-pr-template-checklist-items": asRuleWithDocs(
        requirePrTemplateChecklistItemsRule
    ),
    "require-pull-request-template-file": asRuleWithDocs(
        requirePullRequestTemplateFileRule
    ),
    "require-readme-badges": asRuleWithDocs(requireReadmeBadgesRule),
    "require-readme-file": asRuleWithDocs(requireReadmeFileRule),
    "require-readme-sections": asRuleWithDocs(requireReadmeSectionsRule),
    "require-release-config-file": asRuleWithDocs(requireReleaseConfigFileRule),
    "require-renovate-or-dependabot": asRuleWithDocs(
        requireRenovateOrDependabotRule
    ),
    "require-secret-scanning-config": asRuleWithDocs(
        requireSecretScanningConfigRule
    ),
    "require-security-policy-contact-channel": asRuleWithDocs(
        requireSecurityPolicyContactChannelRule
    ),
    "require-security-policy-file": asRuleWithDocs(
        requireSecurityPolicyFileRule
    ),
    "require-support-file": asRuleWithDocs(requireSupportFileRule),
};

export default repoComplianceRules;
