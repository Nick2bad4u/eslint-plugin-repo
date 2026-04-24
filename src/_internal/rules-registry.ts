/* eslint-disable typedoc/require-exported-doc-comment -- migration scaffold stage: exported APIs are still being documented. */
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

export type RuleNamePattern = `require-${string}`;

export type RuleWithDocs = TSESLint.RuleModule<string, Readonly<UnknownArray>>;

export const repoComplianceRules: Readonly<
    Record<RuleNamePattern, RuleWithDocs>
> = {
    "require-bitbucket-pipelines-config-file":
        requireBitbucketPipelinesConfigFileRule,
    "require-code-of-conduct-file": requireCodeOfConductFileRule,
    "require-codeowners-file": requireCodeownersFileRule,
    "require-contributing-file": requireContributingFileRule,
    "require-dependabot-config-file": requireDependabotConfigFileRule,
    "require-forgejo-actions-workflow-file":
        requireForgejoActionsWorkflowFileRule,
    "require-github-actions-workflow-file":
        requireGitHubActionsWorkflowFileRule,
    "require-gitlab-ci-config-file": requireGitLabCiConfigFileRule,
    "require-gitlab-issue-template-file": requireGitLabIssueTemplateFileRule,
    "require-gitlab-merge-request-template-file":
        requireGitLabMergeRequestTemplateFileRule,
    "require-issue-template-file": requireIssueTemplateFileRule,
    "require-license-file": requireLicenseFileRule,
    "require-pull-request-template-file": requirePullRequestTemplateFileRule,
    "require-readme-file": requireReadmeFileRule,
    "require-security-policy-file": requireSecurityPolicyFileRule,
    "require-support-file": requireSupportFileRule,
};

export default repoComplianceRules;
/* eslint-enable typedoc/require-exported-doc-comment */
