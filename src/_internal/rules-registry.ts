import type { TSESLint } from "@typescript-eslint/utils";
import type { UnknownArray } from "type-fest";

import requireBitbucketPipelinesConfigFileRule from "../rules/require-bitbucket-pipelines-config-file.js";
import requireCodeOfConductFileRule from "../rules/require-code-of-conduct-file.js";
import requireCodeownersFileRule from "../rules/require-codeowners-file.js";
import requireContributingFileRule from "../rules/require-contributing-file.js";
import requireDependabotConfigFileRule from "../rules/require-dependabot-config-file.js";
import requireForgejoActionsWorkflowFileRule from "../rules/require-forgejo-actions-workflow-file.js";
import requireGitHubActionsWorkflowFileRule from "../rules/require-github-actions-workflow-file.js";
import requireGitLabCiConfigFileRule from "../rules/require-gitlab-ci-config-file.js";
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
    "require-bitbucket-pipelines-config-file":
        asRuleWithDocs(requireBitbucketPipelinesConfigFileRule),
    "require-code-of-conduct-file": asRuleWithDocs(
        requireCodeOfConductFileRule
    ),
    "require-codeowners-file": asRuleWithDocs(requireCodeownersFileRule),
    "require-contributing-file": asRuleWithDocs(requireContributingFileRule),
    "require-dependabot-config-file": asRuleWithDocs(
        requireDependabotConfigFileRule
    ),
    "require-forgejo-actions-workflow-file":
        asRuleWithDocs(requireForgejoActionsWorkflowFileRule),
    "require-github-actions-workflow-file":
        asRuleWithDocs(requireGitHubActionsWorkflowFileRule),
    "require-gitlab-ci-config-file": asRuleWithDocs(requireGitLabCiConfigFileRule),
    "require-gitlab-issue-template-file": asRuleWithDocs(
        requireGitLabIssueTemplateFileRule
    ),
    "require-gitlab-merge-request-template-file":
        asRuleWithDocs(requireGitLabMergeRequestTemplateFileRule),
    "require-issue-template-file": asRuleWithDocs(requireIssueTemplateFileRule),
    "require-license-file": asRuleWithDocs(requireLicenseFileRule),
    "require-pull-request-template-file": asRuleWithDocs(
        requirePullRequestTemplateFileRule
    ),
    "require-readme-file": asRuleWithDocs(requireReadmeFileRule),
    "require-security-policy-file": asRuleWithDocs(requireSecurityPolicyFileRule),
    "require-support-file": asRuleWithDocs(requireSupportFileRule),
};

export default repoComplianceRules;
