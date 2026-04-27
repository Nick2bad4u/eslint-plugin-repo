/**
 * @packageDocumentation
 * Sidebar structure for the primary documentation section under `docs/`.
 */
import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

/** Main sidebar configuration for the default docs plugin instance. */
const sidebars = {
    docs: [
        {
            className: "sb-doc-overview",
            id: "intro",
            label: "🏁 Overview",
            type: "doc",
        },
        {
            className: "sb-doc-getting-started",
            id: "getting-started",
            label: "🚀 Getting Started",
            type: "doc",
        },
        {
            className: "sb-cat-developer",
            collapsed: false,
            collapsible: true,
            customProps: {
                badge: "developer",
            },
            description:
                "Maintainer docs, API references, architecture notes, and publishing workflows.",
            items: [
                {
                    className: "sb-cat-developer-home",
                    id: "developer/index",
                    label: "🛠️ Development Guide",
                    type: "doc",
                },
                {
                    className: "sb-cat-developer-ops",
                    id: "developer/deploy-pages-seo-and-indexnow",
                    label: "🚀 Pages SEO & IndexNow",
                    type: "doc",
                },
                {
                    className: "sb-api-overview-item",
                    id: "developer/typed-paths",
                    label: "🧬 Typed paths inventory",
                    type: "doc",
                },
                {
                    className: "sb-cat-api-overview",
                    collapsed: true,
                    collapsible: true,
                    customProps: {
                        badge: "api-overview",
                    },
                    description:
                        "Entry point for generated API docs and highlighted plugin exports.",
                    items: [
                        {
                            className: "sb-api-overview-item",
                            id: "developer/api/plugin/index",
                            label: "🧩 Plugin API index",
                            type: "doc",
                        },
                        {
                            className: "sb-api-overview-item",
                            id: "developer/api/plugin/type-aliases/RepoComplianceConfigName",
                            label: "🧠 Type aliases · RepoComplianceConfigName",
                            type: "doc",
                        },
                        {
                            className: "sb-api-overview-item",
                            id: "developer/api/plugin/variables/plugin",
                            label: "⚙️ Runtime exports · plugin",
                            type: "doc",
                        },
                        {
                            className: "sb-api-overview-item",
                            id: "developer/api/plugin/variables/ruleDocsByName",
                            label: "⚙️ Runtime exports · ruleDocsByName",
                            type: "doc",
                        },
                        {
                            className: "sb-api-overview-item",
                            id: "developer/api/plugin/variables/typeCheckedRules",
                            label: "⚙️ Runtime exports · typeCheckedRules",
                            type: "doc",
                        },
                    ],
                    label: "📘 API Overview",
                    link: {
                        id: "developer/api/index",
                        type: "doc",
                    },
                    type: "category",
                },
                {
                    className: "sb-cat-developer-adr",
                    collapsed: true,
                    collapsible: true,
                    customProps: {
                        badge: "adr",
                    },
                    description:
                        "Architectural decisions and design rationale for eslint-plugin-repo.",
                    items: [
                        {
                            id: "developer/adr/index",
                            label: "📚 ADR Index",
                            type: "doc",
                        },
                        {
                            id: "developer/adr/adr-0001-docusaurus-information-architecture",
                            label: "ADR 0001 · Information Architecture",
                            type: "doc",
                        },
                        {
                            id: "developer/adr/adr-0002-generated-api-docs-boundary",
                            label: "ADR 0002 · Generated API Boundary",
                            type: "doc",
                        },
                    ],
                    label: "🧭 Architecture Decisions",
                    link: {
                        id: "developer/adr/index",
                        type: "doc",
                    },
                    type: "category",
                },
                {
                    className: "sb-cat-dev-charts",
                    collapsed: true,
                    collapsible: true,
                    customProps: {
                        badge: "charts",
                    },
                    description:
                        "Visual aids for understanding docs generation and rule delivery workflows.",
                    items: [
                        {
                            id: "developer/charts/index",
                            label: "📊 Charts Index",
                            type: "doc",
                        },
                        {
                            id: "developer/charts/system-architecture-overview",
                            label: "System Architecture",
                            type: "doc",
                        },
                        {
                            id: "developer/charts/docs-and-api-pipeline",
                            label: "Docs & API Pipeline",
                            type: "doc",
                        },
                    ],
                    label: "📊 Charts",
                    link: {
                        id: "developer/charts/index",
                        type: "doc",
                    },
                    type: "category",
                },
                {
                    className: "sb-cat-api-types",
                    collapsed: true,
                    collapsible: true,
                    customProps: {
                        badge: "types",
                    },
                    description:
                        "Type-level contracts and shared type aliases exposed by the plugin.",
                    items: [
                        {
                            dirName: "developer/api/plugin/type-aliases",
                            type: "autogenerated",
                        },
                    ],
                    label: "🧠 Types",
                    link: {
                        description:
                            "Type-level contracts and shared type aliases exposed by the plugin.",
                        title: "Type Aliases",
                        type: "generated-index",
                    },
                    type: "category",
                },
                {
                    className: "sb-cat-api-runtime",
                    collapsed: true,
                    collapsible: true,
                    customProps: {
                        badge: "runtime",
                    },
                    description:
                        "Runtime exports and internal utility API references from eslint-plugin-repo.",
                    items: [
                        {
                            collapsed: true,
                            collapsible: true,
                            items: [
                                {
                                    dirName: "developer/api/plugin/variables",
                                    type: "autogenerated",
                                },
                            ],
                            label: "Plugin variables",
                            type: "category",
                        },
                        {
                            collapsed: true,
                            collapsible: true,
                            items: [
                                {
                                    dirName: "developer/api/internal",
                                    type: "autogenerated",
                                },
                            ],
                            label: "Internal API",
                            type: "category",
                        },
                    ],
                    label: "⚙️ Runtime",
                    link: {
                        description:
                            "Runtime exports and internal utility API references from eslint-plugin-repo.",
                        title: "Runtime Exports",
                        type: "generated-index",
                    },
                    type: "category",
                },
                {
                    className: "sb-cat-dev-links",
                    collapsed: true,
                    collapsible: true,
                    customProps: {
                        badge: "links",
                    },
                    description:
                        "External package docs, project blog resources, and issue tracker links.",
                    items: [
                        {
                            href: "/blog",
                            label: "📰 Blog posts",
                            type: "link",
                        },
                        {
                            href: "/blog/the-thinking-behind-eslint-plugin-repo",
                            label: "🧠 Blog · Thinking behind plugin",
                            type: "link",
                        },
                        {
                            href: "/blog/designing-safe-autofixes-for-eslint-plugin-repo",
                            label: "🛡️ Blog · Designing safe autofixes",
                            type: "link",
                        },
                        {
                            href: "/blog/type-aware-linting-without-surprises",
                            label: "🧪 Blog · Type-aware linting without surprises",
                            type: "link",
                        },
                        {
                            href: "/blog/keeping-rule-docs-and-presets-in-sync",
                            label: "🧭 Blog · Keeping docs and presets in sync",
                            type: "link",
                        },
                        {
                            href: "/blog/archive",
                            label: "🗂 Blog archive",
                            type: "link",
                        },
                        {
                            href: "https://docs.github.com/en/repositories",
                            label: "🐙 GitHub Docs",
                            type: "link",
                        },
                        {
                            href: "https://docs.gitlab.com/user/project/repository/",
                            label: "🦊 GitLab Docs",
                            type: "link",
                        },
                        {
                            href: "https://support.atlassian.com/bitbucket-cloud/docs/get-started-with-bitbucket-cloud/",
                            label: "🪣 Bitbucket Docs",
                            type: "link",
                        },
                        {
                            href: "https://docs.codeberg.org/getting-started/what-is-codeberg/",
                            label: "🗻 Codeberg Docs",
                            type: "link",
                        },
                        {
                            href: "https://forgejo.org/docs/latest/user/actions/",
                            label: "⚒️ Forgejo Docs",
                            type: "link",
                        },
                        {
                            href: "https://docs.aws.amazon.com/amplify/latest/userguide/edit-build-settings.html",
                            label: "☁️ AWS Amplify Docs",
                            type: "link",
                        },
                        {
                            href: "https://learn.microsoft.com/azure/devops/pipelines/?view=azure-devops",
                            label: "🔷 Azure Pipelines Docs",
                            type: "link",
                        },
                        {
                            href: "https://cloud.google.com/build/docs/build-config-file-schema",
                            label: "🌤️ Google Cloud Build Docs",
                            type: "link",
                        },
                        {
                            href: "https://docs.docker.com/reference/dockerfile/",
                            label: "🐳 Docker Docs",
                            type: "link",
                        },
                        {
                            href: "https://vercel.com/docs/project-configuration",
                            label: "▲ Vercel Docs",
                            type: "link",
                        },
                        {
                            href: "https://docs.netlify.com/configure-builds/file-based-configuration/",
                            label: "🌐 Netlify Docs",
                            type: "link",
                        },
                        {
                            href: "https://docs.digitalocean.com/products/app-platform/reference/app-spec/",
                            label: "🌊 DigitalOcean Docs",
                            type: "link",
                        },
                        {
                            href: "https://github.com/Nick2bad4u/eslint-plugin-repo/issues?q=is%3Aissue%20is%3Aopen",
                            label: "🐛 Open issues",
                            type: "link",
                        },
                        {
                            href: "https://github.com/Nick2bad4u/eslint-plugin-repo/issues?q=is%3Aissue%20is%3Aopen%20label%3Adocumentation",
                            label: "📚 Issues · documentation",
                            type: "link",
                        },
                    ],
                    label: "🌐 Links",
                    type: "category",
                },
            ],
            label: "Developer",
            link: {
                id: "developer/index",
                type: "doc",
            },
            type: "category",
        },
    ],
} satisfies SidebarsConfig;

export default sidebars;
