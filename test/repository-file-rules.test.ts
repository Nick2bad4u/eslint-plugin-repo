import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import * as path from "node:path";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

type RuleFixtureDescriptor = Readonly<{
    messageId: string;
    name: string;
    satisfyingFiles: readonly string[];
}>;

const ruleTester = createRuleTester();
const moduleSource = "export const lintTarget = 1;\n";

const fixtureRoot = path.join(tmpdir(), "repo-compliance-rule-fixtures");
mkdirSync(fixtureRoot, { recursive: true });

const ensureFixtureRepo = (
    ruleName: string,
    variant: "invalid" | "valid",
    filesToCreate: readonly string[]
): string => {
    const rootDirectory = path.join(fixtureRoot, `${ruleName}-${variant}`);
    mkdirSync(rootDirectory, { recursive: true });

    for (const relativePath of filesToCreate) {
        const absolutePath = path.join(rootDirectory, relativePath);
        mkdirSync(path.dirname(absolutePath), { recursive: true });
        writeFileSync(absolutePath, "placeholder\n", "utf8");
    }

    const lintTargetPath = path.join(rootDirectory, "eslint.config.mjs");
    writeFileSync(lintTargetPath, moduleSource, "utf8");

    return lintTargetPath;
};

const descriptors: readonly RuleFixtureDescriptor[] = [
    {
        messageId: "missingAwsAmplifyConfigFile",
        name: "require-aws-amplify-config-file",
        satisfyingFiles: ["amplify.yml"],
    },
    {
        messageId: "missingAzurePipelinesConfigFile",
        name: "require-azure-pipelines-config-file",
        satisfyingFiles: ["azure-pipelines.yml"],
    },
    {
        messageId: "missingReadmeFile",
        name: "require-readme-file",
        satisfyingFiles: ["README.md"],
    },
    {
        messageId: "missingLicenseFile",
        name: "require-license-file",
        satisfyingFiles: ["LICENSE"],
    },
    {
        messageId: "missingContributingFile",
        name: "require-contributing-file",
        satisfyingFiles: ["CONTRIBUTING.md"],
    },
    {
        messageId: "missingCopilotInstructionsFile",
        name: "require-copilot-instructions-file",
        satisfyingFiles: [".github/instructions/copilot-instructions.md"],
    },
    {
        messageId: "missingCodeOfConductFile",
        name: "require-code-of-conduct-file",
        satisfyingFiles: ["CODE_OF_CONDUCT.md"],
    },
    {
        messageId: "missingSecurityPolicyFile",
        name: "require-security-policy-file",
        satisfyingFiles: ["SECURITY.md"],
    },
    {
        messageId: "missingSupportFile",
        name: "require-support-file",
        satisfyingFiles: ["SUPPORT.md"],
    },
    {
        messageId: "missingCodeownersFile",
        name: "require-codeowners-file",
        satisfyingFiles: ["CODEOWNERS"],
    },
    {
        messageId: "missingIssueTemplateFile",
        name: "require-issue-template-file",
        satisfyingFiles: [".github/ISSUE_TEMPLATE/bug.md"],
    },
    {
        messageId: "missingPullRequestTemplateFile",
        name: "require-pull-request-template-file",
        satisfyingFiles: [
            ".github/PULL_REQUEST_TEMPLATE/pull_request_template.md",
        ],
    },
    {
        messageId: "missingDependabotConfigFile",
        name: "require-dependabot-config-file",
        satisfyingFiles: [".github/dependabot.yml"],
    },
    {
        messageId: "missingReleaseConfigFile",
        name: "require-release-config-file",
        satisfyingFiles: [".changeset/config.json"],
    },
    {
        messageId: "missingDependencyUpdateConfig",
        name: "require-dependency-update-config",
        satisfyingFiles: ["updatecli.yaml"],
    },
    {
        messageId: "missingSecretScanningConfig",
        name: "require-secret-scanning-config",
        satisfyingFiles: [".github/secret-scanning/custom-patterns.yml"],
    },
    {
        messageId: "missingDockerfile",
        name: "require-dockerfile",
        satisfyingFiles: ["Dockerfile"],
    },
    {
        messageId: "missingGitHubActionsWorkflowFile",
        name: "require-github-actions-workflow-file",
        satisfyingFiles: [".github/workflows/ci.yml"],
    },
    {
        messageId: "missingGoogleCloudBuildConfigFile",
        name: "require-google-cloud-build-config-file",
        satisfyingFiles: ["cloudbuild.yaml"],
    },
    {
        messageId: "missingGitLabCiConfigFile",
        name: "require-gitlab-ci-config-file",
        satisfyingFiles: [".gitlab-ci.yml"],
    },
    {
        messageId: "missingGitLabIssueTemplateFile",
        name: "require-gitlab-issue-template-file",
        satisfyingFiles: [".gitlab/issue_templates/default.md"],
    },
    {
        messageId: "missingGitLabMergeRequestTemplateFile",
        name: "require-gitlab-merge-request-template-file",
        satisfyingFiles: [".gitlab/merge_request_templates/default.md"],
    },
    {
        messageId: "missingBitbucketPipelinesConfigFile",
        name: "require-bitbucket-pipelines-config-file",
        satisfyingFiles: ["bitbucket-pipelines.yml"],
    },
    {
        messageId: "missingNetlifyConfigFile",
        name: "require-netlify-config-file",
        satisfyingFiles: ["netlify.toml"],
    },
    {
        messageId: "missingVercelConfigFile",
        name: "require-vercel-config-file",
        satisfyingFiles: ["vercel.json"],
    },
    {
        messageId: "missingDigitalOceanAppSpecFile",
        name: "require-digitalocean-app-spec-file",
        satisfyingFiles: [".do/app.yaml"],
    },
    {
        messageId: "missingForgejoActionsWorkflowFile",
        name: "require-forgejo-actions-workflow-file",
        satisfyingFiles: [".forgejo/workflows/ci.yml"],
    },
];

for (const descriptor of descriptors) {
    const invalidFilename = ensureFixtureRepo(descriptor.name, "invalid", []);
    const validFilename = ensureFixtureRepo(
        descriptor.name,
        "valid",
        descriptor.satisfyingFiles
    );

    ruleTester.run(descriptor.name, getPluginRule(descriptor.name), {
        invalid: [
            {
                code: moduleSource,
                errors: [{ messageId: descriptor.messageId }],
                filename: invalidFilename,
                name: `${descriptor.name} reports when required repository files are missing`,
            },
        ],
        valid: [
            {
                code: moduleSource,
                filename: validFilename,
                name: `${descriptor.name} passes when required repository files exist`,
            },
        ],
    });
}
