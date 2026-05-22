import nick2bad4u from "eslint-config-nick2bad4u";

import repoCompliance from "./plugin.mjs";

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...nick2bad4u.configs.withoutRepo,

    // Local Plugin Config
    // This lets us use the plugin's rules in this repository without needing to publish the plugin first.
    {
        files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
        name: "Local Repo Compliance",
        plugins: {
            "repo-compliance": repoCompliance,
        },
        rules: {
            // @ts-expect-error -- plugin.mjs is typed as generic ESLint.Plugin.
            ...repoCompliance.configs.all.rules,
        },
    },
    {
        files: [
            "src/_internal/repo-file-rule.ts",
            "src/_internal/repository-text-files.ts",
            "src/rules/require-bitbucket-pipelines-clone-depth.ts",
            "src/rules/require-bitbucket-pipelines-default-pipeline.ts",
            "src/rules/require-bitbucket-pipelines-image-pinned-tag.ts",
            "src/rules/require-bitbucket-pipelines-max-time.ts",
            "src/rules/require-bitbucket-pipelines-pull-requests-target-branches.ts",
            "src/rules/require-bitbucket-pipelines-pull-requests.ts",
            "src/rules/require-bitbucket-pipelines-step-name.ts",
            "src/rules/require-codeowners-reviewable-patterns.ts",
            "src/rules/require-dockerignore-file.ts",
            "src/rules/require-forgejo-actions-no-write-all-permissions.ts",
            "src/rules/require-forgejo-actions-pinned-sha.ts",
            "src/rules/require-forgejo-actions-workflow-permissions.ts",
            "src/rules/require-github-actions-workflow-name.ts",
            "src/rules/require-github-issue-template-labels.ts",
            "src/rules/require-license-spdx-identifier.ts",
            "src/rules/require-pr-template-checklist-items.ts",
            "src/rules/require-security-policy-contact-channel.ts",
            "src/rules/require-single-codeowners-file.ts",
        ],
        name: "Rule Runtime Filesystem Access",
        rules: {
            // ESLint rules run synchronously; these files intentionally inspect
            // repository files during lint execution.
            "n/no-sync": "off",
            "security/detect-non-literal-fs-filename": "off",
        },
    },
    {
        files: ["src/_internal/rules-registry.ts", "src/plugin.ts"],
        name: "Rule Registry Aliases",
        rules: {
            // Registry files intentionally alias many default exports to unique
            // rule identifiers for plugin metadata.
            "import-x/no-rename-default": "off",
        },
    },
    // Add repository-specific config entries below as needed.
];

export default config;
