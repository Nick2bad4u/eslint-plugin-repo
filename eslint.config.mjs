import nick2bad4u from "eslint-config-nick2bad4u";

import repoCompliance from "./plugin.mjs";

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...nick2bad4u.configs.withoutRepo,

    {
        ignores: [
            "docs/docusaurus/typedoc-plugins/**",
            "knip.config.ts",
            "plugin.d.mts",
            "vitest.stryker.config.ts",
        ],
        name: "Tooling Shims Outside Typed Lint Projects",
    },

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
        files: ["src/**/*.ts", "docs/docusaurus/sidebars.rules.ts"],
        name: "Repository Rule Source Compatibility",
        rules: {
            // The repository rule files heavily use node:path named imports and
            // inline iterable expressions. Migrating those patterns rule-by-rule
            // is unrelated to this shared-config migration.
            "@typescript-eslint/restrict-template-expressions": "off",
            "unicorn/consistent-boolean-name": "off",
            "unicorn/import-style": "off",
            "unicorn/no-break-in-nested-loop": "off",
            "unicorn/no-declarations-before-early-exit": "off",
            "unicorn/no-unreadable-for-of-expression": "off",
            "unicorn/prefer-minimal-ternary": "off",
            "unicorn/prefer-number-coercion": "off",
            "unicorn/prefer-temporal": "off",
        },
    },
    {
        files: ["docs/docusaurus/**/*.{ts,tsx}"],
        name: "Docusaurus Runtime Compatibility",
        rules: {
            "@typescript-eslint/no-dynamic-delete": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-type-assertion": "off",
            "@typescript-eslint/prefer-readonly-parameter-types": "off",
            "canonical/filename-no-index": "off",
            "n/no-process-env": "off",
            "n/no-sync": "off",
            "n/no-unsupported-features/node-builtins": "off",
            "no-underscore-dangle": "off",
            "prefer-named-capture-group": "off",
            "regexp/no-super-linear-backtracking": "off",
            "regexp/prefer-named-capture-group": "off",
            "regexp/require-unicode-sets-regexp": "off",
            "runtime-cleanup/no-unmanaged-event-listeners": "off",
            "unicorn/filename-case": "off",
            "unicorn/no-array-callback-reference": "off",
            "unicorn/no-array-sort": "off",
            "unicorn/no-break-in-nested-loop": "off",
            "unicorn/no-global-object-property-assignment": "off",
            "unicorn/no-immediate-mutation": "off",
            "unicorn/no-incorrect-template-string-interpolation": "off",
            "unicorn/no-non-function-verb-prefix": "off",
            "unicorn/no-unnecessary-global-this": "off",
            "unicorn/no-unreadable-new-expression": "off",
            "unicorn/prefer-global-this": "off",
            "unicorn/prefer-import-meta-properties": "off",
            "unicorn/prefer-short-arrow-method": "off",
            "unicorn/prefer-single-call": "off",
            "unicorn/prefer-temporal": "off",
        },
    },
    {
        files: ["docs/docusaurus/src/**/*.css"],
        name: "Docusaurus Presentation CSS",
        rules: {
            // Docusaurus theme selectors are intentionally broad and are checked
            // by the dedicated stylelint task with repo-specific overrides.
            "stylelint-2/stylelint": "off",
        },
    },
    {
        files: ["docs/**/*.md", "docs/**/*.mdx"],
        name: "Docusaurus Markdown Frontmatter",
        rules: {
            // Docusaurus title frontmatter plus an H1 is valid site content.
            "markdown/no-multiple-h1": "off",
        },
    },
    {
        files: [".github/pull_request_template.md"],
        name: "GitHub Template Markdown",
        rules: {
            // GitHub templates intentionally contain empty prompt sections.
            "remark/remark": "off",
        },
    },
    {
        files: [".ncurc.json"],
        name: "npm Check Updates Config Schema",
        rules: {
            "json-schema-validator-2/no-invalid": "off",
        },
    },
    {
        files: ["test/**/*.ts"],
        name: "Legacy Test Conventions",
        rules: {
            "test-signal/require-negative-path": "off",
            "unicorn/no-computed-property-existence-check": "off",
            "unicorn/no-top-level-side-effects": "off",
            "unicorn/no-unreadable-for-of-expression": "off",
            "unicorn/prefer-short-arrow-method": "off",
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
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/restrict-template-expressions": "off",
            "import-x/max-dependencies": "off",
            "import-x/no-rename-default": "off",
        },
    },
    {
        files: [
            "eslint.config.mjs",
            "stylelint.config.mjs",
            "stryker.config.mjs",
            "vite.config.ts",
        ],
        name: "Config Tooling Compatibility",
        rules: {
            "@typescript-eslint/dot-notation": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "unicorn/prefer-number-coercion": "off",
        },
    },
    // Add repository-specific config entries below as needed.
];

export default config;
