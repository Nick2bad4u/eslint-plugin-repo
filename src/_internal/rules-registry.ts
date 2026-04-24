import type { TSESLint } from "@typescript-eslint/utils";
import type { UnknownArray } from "type-fest";

import requireBitbucketPipelinesConfigFileRule from "../rules/require-bitbucket-pipelines-config-file.js";
import requireBitbucketPipelinesDefaultPipelineRule from "../rules/require-bitbucket-pipelines-default-pipeline.js";
import requireBitbucketPipelinesMaxTimeRule from "../rules/require-bitbucket-pipelines-max-time.js";
import requireBitbucketPipelinesPullRequestsTargetBranchesRule from "../rules/require-bitbucket-pipelines-pull-requests-target-branches.js";
import requireBitbucketPipelinesPullRequestsRule from "../rules/require-bitbucket-pipelines-pull-requests.js";
import requireBitbucketPipelinesStepNameRule from "../rules/require-bitbucket-pipelines-step-name.js";
import requireCodeOfConductFileRule from "../rules/require-code-of-conduct-file.js";
import requireCodeownersFileRule from "../rules/require-codeowners-file.js";
import requireContributingFileRule from "../rules/require-contributing-file.js";
import requireDependabotConfigFileRule from "../rules/require-dependabot-config-file.js";
import requireDependabotReviewersRule from "../rules/require-dependabot-reviewers.js";
import requireForgejoActionsJobTimeoutMinutesRule from "../rules/require-forgejo-actions-job-timeout-minutes.js";
import requireForgejoActionsNoWriteAllPermissionsRule from "../rules/require-forgejo-actions-no-write-all-permissions.js";
import requireForgejoActionsPinnedShaRule from "../rules/require-forgejo-actions-pinned-sha.js";
import requireForgejoActionsWorkflowDispatchRule from "../rules/require-forgejo-actions-workflow-dispatch.js";
import requireForgejoActionsWorkflowFileRule from "../rules/require-forgejo-actions-workflow-file.js";
import requireForgejoActionsWorkflowNameRule from "../rules/require-forgejo-actions-workflow-name.js";
import requireForgejoActionsWorkflowPermissionsRule from "../rules/require-forgejo-actions-workflow-permissions.js";
import requireGitHubActionsWorkflowFileRule from "../rules/require-github-actions-workflow-file.js";
import requireGitHubActionsWorkflowNameRule from "../rules/require-github-actions-workflow-name.js";
import requireGitLabCiConfigFileRule from "../rules/require-gitlab-ci-config-file.js";
import requireGitLabCiDefaultTimeoutRule from "../rules/require-gitlab-ci-default-timeout.js";
import requireGitLabCiMergeRequestPipelinesRule from "../rules/require-gitlab-ci-merge-request-pipelines.js";
import requireGitLabCiRulesOverOnlyExceptRule from "../rules/require-gitlab-ci-rules-over-only-except.js";
import requireGitLabCiSecurityScanningRule from "../rules/require-gitlab-ci-security-scanning.js";
import requireGitLabCiStagesRule from "../rules/require-gitlab-ci-stages.js";
import requireGitLabCiWorkflowRulesRule from "../rules/require-gitlab-ci-workflow-rules.js";
import requireGitLabIssueTemplateFileRule from "../rules/require-gitlab-issue-template-file.js";
import requireGitLabMergeRequestTemplateFileRule from "../rules/require-gitlab-merge-request-template-file.js";
import requireIssueTemplateFileRule from "../rules/require-issue-template-file.js";
import requireLicenseFileRule from "../rules/require-license-file.js";
import requirePullRequestTemplateFileRule from "../rules/require-pull-request-template-file.js";
import requireReadmeFileRule from "../rules/require-readme-file.js";
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
    "require-bitbucket-pipelines-config-file": asRuleWithDocs(
        requireBitbucketPipelinesConfigFileRule
    ),
    "require-bitbucket-pipelines-default-pipeline": asRuleWithDocs(
        requireBitbucketPipelinesDefaultPipelineRule
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
    "require-code-of-conduct-file": asRuleWithDocs(
        requireCodeOfConductFileRule
    ),
    "require-codeowners-file": asRuleWithDocs(requireCodeownersFileRule),
    "require-contributing-file": asRuleWithDocs(requireContributingFileRule),
    "require-dependabot-config-file": asRuleWithDocs(
        requireDependabotConfigFileRule
    ),
    "require-dependabot-reviewers": asRuleWithDocs(
        requireDependabotReviewersRule
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
    "require-github-actions-workflow-file": asRuleWithDocs(
        requireGitHubActionsWorkflowFileRule
    ),
    "require-github-actions-workflow-name": asRuleWithDocs(
        requireGitHubActionsWorkflowNameRule
    ),
    "require-gitlab-ci-config-file": asRuleWithDocs(
        requireGitLabCiConfigFileRule
    ),
    "require-gitlab-ci-default-timeout": asRuleWithDocs(
        requireGitLabCiDefaultTimeoutRule
    ),
    "require-gitlab-ci-merge-request-pipelines": asRuleWithDocs(
        requireGitLabCiMergeRequestPipelinesRule
    ),
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
    "require-license-file": asRuleWithDocs(requireLicenseFileRule),
    "require-pull-request-template-file": asRuleWithDocs(
        requirePullRequestTemplateFileRule
    ),
    "require-readme-file": asRuleWithDocs(requireReadmeFileRule),
    "require-security-policy-file": asRuleWithDocs(
        requireSecurityPolicyFileRule
    ),
    "require-support-file": asRuleWithDocs(requireSupportFileRule),
};

export default repoComplianceRules;
