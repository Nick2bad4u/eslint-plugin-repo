import type { TSESLint } from "@typescript-eslint/utils";
import type { UnknownArray } from "type-fest";

import requireAwsAmplifyArtifactsBaseDirectoryRelativePathRule from "../rules/require-aws-amplify-artifacts-base-directory-relative-path.js";
import requireAwsAmplifyArtifactsBaseDirectoryRule from "../rules/require-aws-amplify-artifacts-base-directory.js";
import requireAwsAmplifyArtifactsFilesNonEmptyRule from "../rules/require-aws-amplify-artifacts-files-non-empty.js";
import requireAwsAmplifyArtifactsFilesRule from "../rules/require-aws-amplify-artifacts-files.js";
import requireAwsAmplifyBuildCommandsRule from "../rules/require-aws-amplify-build-commands.js";
import requireAwsAmplifyConfigFileRule from "../rules/require-aws-amplify-config-file.js";
import requireAwsAmplifyVersionValueRule from "../rules/require-aws-amplify-version-value.js";
import requireAwsAmplifyVersionRule from "../rules/require-aws-amplify-version.js";
import requireAzurePipelinesConfigFileRule from "../rules/require-azure-pipelines-config-file.js";
import requireAzurePipelinesExecutionPlanRule from "../rules/require-azure-pipelines-execution-plan.js";
import requireAzurePipelinesNameRule from "../rules/require-azure-pipelines-name.js";
import requireAzurePipelinesPrBranchesRule from "../rules/require-azure-pipelines-pr-branches.js";
import requireAzurePipelinesPrTriggerRule from "../rules/require-azure-pipelines-pr-trigger.js";
import requireAzurePipelinesTriggerBranchesRule from "../rules/require-azure-pipelines-trigger-branches.js";
import requireAzurePipelinesTriggerIncludeBranchesRule from "../rules/require-azure-pipelines-trigger-include-branches.js";
import requireAzurePipelinesTriggerRule from "../rules/require-azure-pipelines-trigger.js";
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
import requireCodeownersFileRule from "../rules/require-codeowners-file.js";
import requireCodeownersReviewablePatternsRule from "../rules/require-codeowners-reviewable-patterns.js";
import requireContributingFileRule from "../rules/require-contributing-file.js";
import requireCopilotInstructionsFileRule from "../rules/require-copilot-instructions-file.js";
import requireDependabotConfigFileRule from "../rules/require-dependabot-config-file.js";
import requireDependabotGroupingRule from "../rules/require-dependabot-grouping.js";
import requireDependabotReviewersRule from "../rules/require-dependabot-reviewers.js";
import requireDependabotScheduleRule from "../rules/require-dependabot-schedule.js";
import requireDependabotUpdateEntriesRule from "../rules/require-dependabot-update-entries.js";
import requireDependencyUpdateConfigRule from "../rules/require-dependency-update-config.js";
import requireDigitalOceanAppSpecComponentRule from "../rules/require-digitalocean-app-spec-component.js";
import requireDigitalOceanAppSpecFileRule from "../rules/require-digitalocean-app-spec-file.js";
import requireDigitalOceanAppSpecNameValueRule from "../rules/require-digitalocean-app-spec-name-value.js";
import requireDigitalOceanAppSpecNameRule from "../rules/require-digitalocean-app-spec-name.js";
import requireDigitalOceanAppSpecRegionLowercaseRule from "../rules/require-digitalocean-app-spec-region-lowercase.js";
import requireDigitalOceanAppSpecRegionValueRule from "../rules/require-digitalocean-app-spec-region-value.js";
import requireDigitalOceanAppSpecRegionRule from "../rules/require-digitalocean-app-spec-region.js";
import requireDockerfileBaseImageTagRule from "../rules/require-dockerfile-base-image-tag.js";
import requireDockerfileCmdOrEntrypointRule from "../rules/require-dockerfile-cmd-or-entrypoint.js";
import requireDockerfileFirstInstructionFromRule from "../rules/require-dockerfile-first-instruction-from.js";
import requireDockerfileFromInstructionRule from "../rules/require-dockerfile-from-instruction.js";
import requireDockerfileUserRule from "../rules/require-dockerfile-user.js";
import requireDockerfileWorkdirRule from "../rules/require-dockerfile-workdir.js";
import requireDockerfileRule from "../rules/require-dockerfile.js";
import requireDockerignoreFileRule from "../rules/require-dockerignore-file.js";
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
import requireGitHubCodeScanningWorkflowRule from "../rules/require-github-code-scanning-workflow.js";
import requireGitHubIssueTemplateLabelsRule from "../rules/require-github-issue-template-labels.js";
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
import requireGoogleCloudBuildConfigFileRule from "../rules/require-google-cloud-build-config-file.js";
import requireGoogleCloudBuildStepNameRule from "../rules/require-google-cloud-build-step-name.js";
import requireGoogleCloudBuildStepsNonEmptyRule from "../rules/require-google-cloud-build-steps-non-empty.js";
import requireGoogleCloudBuildStepsRule from "../rules/require-google-cloud-build-steps.js";
import requireGoogleCloudBuildTimeoutFormatRule from "../rules/require-google-cloud-build-timeout-format.js";
import requireGoogleCloudBuildTimeoutMaxRule from "../rules/require-google-cloud-build-timeout-max.js";
import requireGoogleCloudBuildTimeoutPositiveRule from "../rules/require-google-cloud-build-timeout-positive.js";
import requireGoogleCloudBuildTimeoutRule from "../rules/require-google-cloud-build-timeout.js";
import requireIssueTemplateFileRule from "../rules/require-issue-template-file.js";
import requireLicenseFileRule from "../rules/require-license-file.js";
import requireLicenseSpdxIdentifierRule from "../rules/require-license-spdx-identifier.js";
import requireNetlifyBuildCommandNonEmptyRule from "../rules/require-netlify-build-command-non-empty.js";
import requireNetlifyBuildCommandRule from "../rules/require-netlify-build-command.js";
import requireNetlifyBuildPublishDirectoryRule from "../rules/require-netlify-build-publish-directory.js";
import requireNetlifyBuildSectionRule from "../rules/require-netlify-build-section.js";
import requireNetlifyConfigFileRule from "../rules/require-netlify-config-file.js";
import requireNetlifyPublishDirectoryNoTrailingSlashRule from "../rules/require-netlify-publish-directory-no-trailing-slash.js";
import requireNetlifyPublishDirectoryNonEmptyRule from "../rules/require-netlify-publish-directory-non-empty.js";
import requireNetlifyPublishRelativePathRule from "../rules/require-netlify-publish-relative-path.js";
import requireNodeVersionFileRule from "../rules/require-node-version-file.js";
import requirePrTemplateChecklistItemsRule from "../rules/require-pr-template-checklist-items.js";
import requirePullRequestTemplateFileRule from "../rules/require-pull-request-template-file.js";
import requireReadmeBadgesRule from "../rules/require-readme-badges.js";
import requireReadmeFileRule from "../rules/require-readme-file.js";
import requireReadmeSectionsRule from "../rules/require-readme-sections.js";
import requireReleaseConfigFileRule from "../rules/require-release-config-file.js";
import requireSecretScanningConfigRule from "../rules/require-secret-scanning-config.js";
import requireSecurityPolicyContactChannelRule from "../rules/require-security-policy-contact-channel.js";
import requireSecurityPolicyFileRule from "../rules/require-security-policy-file.js";
import requireSupportFileRule from "../rules/require-support-file.js";
import requireVercelBuildCommandRule from "../rules/require-vercel-build-command.js";
import requireVercelConfigFileRule from "../rules/require-vercel-config-file.js";
import requireVercelConfigObjectRule from "../rules/require-vercel-config-object.js";
import requireVercelSchemaUrlRule from "../rules/require-vercel-schema-url.js";
import requireVercelSchemaRule from "../rules/require-vercel-schema.js";
import requireVercelValidJsonRule from "../rules/require-vercel-valid-json.js";
import requireVercelVersionValueRule from "../rules/require-vercel-version-value.js";

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
    "require-aws-amplify-artifacts-base-directory": asRuleWithDocs(
        requireAwsAmplifyArtifactsBaseDirectoryRule
    ),
    "require-aws-amplify-artifacts-base-directory-relative-path":
        asRuleWithDocs(requireAwsAmplifyArtifactsBaseDirectoryRelativePathRule),
    "require-aws-amplify-artifacts-files": asRuleWithDocs(
        requireAwsAmplifyArtifactsFilesRule
    ),
    "require-aws-amplify-artifacts-files-non-empty": asRuleWithDocs(
        requireAwsAmplifyArtifactsFilesNonEmptyRule
    ),
    "require-aws-amplify-build-commands": asRuleWithDocs(
        requireAwsAmplifyBuildCommandsRule
    ),
    "require-aws-amplify-config-file": asRuleWithDocs(
        requireAwsAmplifyConfigFileRule
    ),
    "require-aws-amplify-version": asRuleWithDocs(requireAwsAmplifyVersionRule),
    "require-aws-amplify-version-value": asRuleWithDocs(
        requireAwsAmplifyVersionValueRule
    ),
    "require-azure-pipelines-config-file": asRuleWithDocs(
        requireAzurePipelinesConfigFileRule
    ),
    "require-azure-pipelines-execution-plan": asRuleWithDocs(
        requireAzurePipelinesExecutionPlanRule
    ),
    "require-azure-pipelines-name": asRuleWithDocs(
        requireAzurePipelinesNameRule
    ),
    "require-azure-pipelines-pr-branches": asRuleWithDocs(
        requireAzurePipelinesPrBranchesRule
    ),
    "require-azure-pipelines-pr-trigger": asRuleWithDocs(
        requireAzurePipelinesPrTriggerRule
    ),
    "require-azure-pipelines-trigger": asRuleWithDocs(
        requireAzurePipelinesTriggerRule
    ),
    "require-azure-pipelines-trigger-branches": asRuleWithDocs(
        requireAzurePipelinesTriggerBranchesRule
    ),
    "require-azure-pipelines-trigger-include-branches": asRuleWithDocs(
        requireAzurePipelinesTriggerIncludeBranchesRule
    ),
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
    "require-dependabot-grouping": asRuleWithDocs(
        requireDependabotGroupingRule
    ),
    "require-dependabot-reviewers": asRuleWithDocs(
        requireDependabotReviewersRule
    ),
    "require-dependabot-schedule": asRuleWithDocs(
        requireDependabotScheduleRule
    ),
    "require-dependabot-update-entries": asRuleWithDocs(
        requireDependabotUpdateEntriesRule
    ),
    "require-dependency-update-config": asRuleWithDocs(
        requireDependencyUpdateConfigRule
    ),
    "require-digitalocean-app-spec-component": asRuleWithDocs(
        requireDigitalOceanAppSpecComponentRule
    ),
    "require-digitalocean-app-spec-file": asRuleWithDocs(
        requireDigitalOceanAppSpecFileRule
    ),
    "require-digitalocean-app-spec-name": asRuleWithDocs(
        requireDigitalOceanAppSpecNameRule
    ),
    "require-digitalocean-app-spec-name-value": asRuleWithDocs(
        requireDigitalOceanAppSpecNameValueRule
    ),
    "require-digitalocean-app-spec-region": asRuleWithDocs(
        requireDigitalOceanAppSpecRegionRule
    ),
    "require-digitalocean-app-spec-region-lowercase": asRuleWithDocs(
        requireDigitalOceanAppSpecRegionLowercaseRule
    ),
    "require-digitalocean-app-spec-region-value": asRuleWithDocs(
        requireDigitalOceanAppSpecRegionValueRule
    ),
    "require-dockerfile": asRuleWithDocs(requireDockerfileRule),
    "require-dockerfile-base-image-tag": asRuleWithDocs(
        requireDockerfileBaseImageTagRule
    ),
    "require-dockerfile-cmd-or-entrypoint": asRuleWithDocs(
        requireDockerfileCmdOrEntrypointRule
    ),
    "require-dockerfile-first-instruction-from": asRuleWithDocs(
        requireDockerfileFirstInstructionFromRule
    ),
    "require-dockerfile-from-instruction": asRuleWithDocs(
        requireDockerfileFromInstructionRule
    ),
    "require-dockerfile-user": asRuleWithDocs(requireDockerfileUserRule),
    "require-dockerfile-workdir": asRuleWithDocs(requireDockerfileWorkdirRule),
    "require-dockerignore-file": asRuleWithDocs(requireDockerignoreFileRule),
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
    "require-github-code-scanning-workflow": asRuleWithDocs(
        requireGitHubCodeScanningWorkflowRule
    ),
    "require-github-issue-template-labels": asRuleWithDocs(
        requireGitHubIssueTemplateLabelsRule
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
    "require-google-cloud-build-config-file": asRuleWithDocs(
        requireGoogleCloudBuildConfigFileRule
    ),
    "require-google-cloud-build-step-name": asRuleWithDocs(
        requireGoogleCloudBuildStepNameRule
    ),
    "require-google-cloud-build-steps": asRuleWithDocs(
        requireGoogleCloudBuildStepsRule
    ),
    "require-google-cloud-build-steps-non-empty": asRuleWithDocs(
        requireGoogleCloudBuildStepsNonEmptyRule
    ),
    "require-google-cloud-build-timeout": asRuleWithDocs(
        requireGoogleCloudBuildTimeoutRule
    ),
    "require-google-cloud-build-timeout-format": asRuleWithDocs(
        requireGoogleCloudBuildTimeoutFormatRule
    ),
    "require-google-cloud-build-timeout-max": asRuleWithDocs(
        requireGoogleCloudBuildTimeoutMaxRule
    ),
    "require-google-cloud-build-timeout-positive": asRuleWithDocs(
        requireGoogleCloudBuildTimeoutPositiveRule
    ),
    "require-issue-template-file": asRuleWithDocs(requireIssueTemplateFileRule),
    "require-license-file": asRuleWithDocs(requireLicenseFileRule),
    "require-license-spdx-identifier": asRuleWithDocs(
        requireLicenseSpdxIdentifierRule
    ),
    "require-netlify-build-command": asRuleWithDocs(
        requireNetlifyBuildCommandRule
    ),
    "require-netlify-build-command-non-empty": asRuleWithDocs(
        requireNetlifyBuildCommandNonEmptyRule
    ),
    "require-netlify-build-publish-directory": asRuleWithDocs(
        requireNetlifyBuildPublishDirectoryRule
    ),
    "require-netlify-build-section": asRuleWithDocs(
        requireNetlifyBuildSectionRule
    ),
    "require-netlify-config-file": asRuleWithDocs(requireNetlifyConfigFileRule),
    "require-netlify-publish-directory-no-trailing-slash": asRuleWithDocs(
        requireNetlifyPublishDirectoryNoTrailingSlashRule
    ),
    "require-netlify-publish-directory-non-empty": asRuleWithDocs(
        requireNetlifyPublishDirectoryNonEmptyRule
    ),
    "require-netlify-publish-relative-path": asRuleWithDocs(
        requireNetlifyPublishRelativePathRule
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
    "require-vercel-build-command": asRuleWithDocs(
        requireVercelBuildCommandRule
    ),
    "require-vercel-config-file": asRuleWithDocs(requireVercelConfigFileRule),
    "require-vercel-config-object": asRuleWithDocs(
        requireVercelConfigObjectRule
    ),
    "require-vercel-schema": asRuleWithDocs(requireVercelSchemaRule),
    "require-vercel-schema-url": asRuleWithDocs(requireVercelSchemaUrlRule),
    "require-vercel-valid-json": asRuleWithDocs(requireVercelValidJsonRule),
    "require-vercel-version-value": asRuleWithDocs(
        requireVercelVersionValueRule
    ),
};

export default repoComplianceRules;
