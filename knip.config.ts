/**
 * Repository-specific configuration for Knip dependency analysis.
 *
 * @packageDocumentation
 */
import type { KnipConfig } from "knip";

/**
 * Knip configuration that scopes entry points and dependency heuristics to the
 * repository layout.
 */
const knipConfig: KnipConfig = {
    $schema: "https://unpkg.com/knip@6/schema.json",
    ignoreBinaries: [
        "actionlint",
        "detect-secrets-hook",
        "gitleaks",
        "grype",
        "lychee",
        // Knip treats its config path as a binary when it appears after `-c`.
        "knip.config.ts",
    ],
    ignoreDependencies: [
        // Docusaurus resolves the configured search plugin and theme by name.
        "@easyops-cn/docusaurus-search-local",
        "@easyops-cn/docusaurus-theme-docusaurus-search-local",
        // Stryker resolves mutators from configuration strings.
        "@stryker-mutator/.*",
        // The shared Stylelint config resolves its plugin implementations.
        "@double-great/stylelint-a11y",
        "@stylistic/stylelint-plugin",
        "postcss-.*",
        "stylelint-.*",
        // These shared configs are consumed by non-JavaScript config files or
        // by explicit node_modules paths in package scripts.
        "gitcliff-config-nick2bad4u",
        "gitleaks-config-nick2bad4u",
        "grype-config-nick2bad4u",
        "jscpd-config-nick2bad4u",
        "lychee-config-nick2bad4u",
        "ncu-config-nick2bad4u",
        "yamllint-config-nick2bad4u",
        // These command/config package names are not statically resolvable by
        // Knip from package-script arguments and JSON configuration.
        "git-cliff",
        "tsdoc-config-nick2bad4u",
        "typed-css-modules",
        "typedoc-config-nick2bad4u",
        // JSDoc resolves these module names through @types packages.
        "mdast",
        "unist",
    ],
    ignoreFiles: ["plugin.d.mts"],
    ignoreIssues: {
        "scripts/**/*.d.mts": ["exports", "types"],
        // The README synchronizer imports this generated module from dist.
        "src/_internal/config-references.ts": ["exports"],
    },
    ignoreExportsUsedInFile: {
        interface: true,
        type: true,
    },
    rules: {
        binaries: "error",
        catalog: "error",
        dependencies: "error",
        devDependencies: "error",
        duplicates: "error",
        enumMembers: "warn",
        exports: "warn",
        files: "error",
        namespaceMembers: "warn",
        nsExports: "warn",
        nsTypes: "warn",
        optionalPeerDependencies: "error",
        types: "warn",
        unlisted: "error",
        unresolved: "error",
    },
    workspaces: {
        ".": {
            entry: [
                ".secretlintrc.cjs",
                "src/plugin.ts",
                "scripts/**/*.{js,mjs,cjs,ts,mts,cts}",
                "test/**/*.{js,ts,tsx,jsx,mts,cjs,cts,mjs}",
                "vitest.stryker.config.ts",
            ],
            project: [
                "*.{js,mjs,cjs,ts,mts,cts}",
                "scripts/**/*.{js,mjs,cjs,ts,mts,cts}",
                "src/**/*.{js,ts,tsx,jsx,mts,cjs,cts,mjs}",
                "test/**/*.{js,ts,tsx,jsx,mts,cjs,cts,mjs}",
            ],
        },
        "docs/docusaurus": {
            entry: ["sidebars*.ts", "src/**/*.{ts,tsx,mdx}"],
            project: ["**/*.{js,ts,tsx,jsx,mts,cjs,cts,mjs,mdx}"],
        },
    },
};

export default knipConfig;
