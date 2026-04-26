/**
 * @packageDocumentation
 * Sidebar generation for repository-compliance rule documentation.
 */
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

type SidebarDocItem = {
    readonly className?: string;
    readonly label: string;
    readonly id: string;
    readonly type: "doc";
};

const sidebarDirectoryPath = dirname(fileURLToPath(import.meta.url));
const rulesDirectoryPath = join(sidebarDirectoryPath, "..", "rules");

const isMarkdownFile = (fileName: string): boolean => fileName.endsWith(".md");
const toRuleDocId = (fileName: string): string => fileName.slice(0, -3);

const allRuleDocIds = readdirSync(rulesDirectoryPath, {
    withFileTypes: true,
})
    .filter((entry) => entry.isFile() && isMarkdownFile(entry.name))
    .map((entry) => toRuleDocId(entry.name))
    .sort((left, right) => left.localeCompare(right));

const allRequireRuleDocIds = allRuleDocIds.filter((ruleDocId) =>
    ruleDocId.startsWith("require-")
);

const isAiRuleDocId = (ruleDocId: string): boolean =>
    ruleDocId.includes("copilot") || /(?:^|-)ai(?:-|$)/u.test(ruleDocId);

const deriveRuleSidebarClassName = (ruleDocId: string): string => {
    if (ruleDocId.includes("github")) {
        return "sb-rule-item sb-rule-github";
    }

    if (ruleDocId.includes("gitlab")) {
        return "sb-rule-item sb-rule-gitlab";
    }

    if (ruleDocId.includes("bitbucket")) {
        return "sb-rule-item sb-rule-bitbucket";
    }

    if (ruleDocId.includes("forgejo")) {
        return "sb-rule-item sb-rule-forgejo";
    }

    if (ruleDocId.includes("aws")) {
        return "sb-rule-item sb-rule-aws";
    }

    if (ruleDocId.includes("azure")) {
        return "sb-rule-item sb-rule-azure";
    }

    if (ruleDocId.includes("google-cloud")) {
        return "sb-rule-item sb-rule-google-cloud";
    }

    if (ruleDocId.includes("docker")) {
        return "sb-rule-item sb-rule-docker";
    }

    if (ruleDocId.includes("vercel")) {
        return "sb-rule-item sb-rule-vercel";
    }

    if (ruleDocId.includes("netlify")) {
        return "sb-rule-item sb-rule-netlify";
    }

    if (ruleDocId.includes("digitalocean")) {
        return "sb-rule-item sb-rule-digitalocean";
    }

    if (isAiRuleDocId(ruleDocId)) {
        return "sb-rule-item sb-rule-ai";
    }

    return "sb-rule-item sb-rule-repository";
};

const ruleItems: SidebarDocItem[] = allRequireRuleDocIds.map((ruleDocId) => ({
    className: deriveRuleSidebarClassName(ruleDocId),
    id: ruleDocId,
    label: ruleDocId,
    type: "doc",
}));

const createRuleItemsByKeyword = (keyword: string): SidebarDocItem[] =>
    ruleItems.filter((item) => item.id.includes(keyword));

const createRuleItemsByPredicate = (
    predicate: (item: SidebarDocItem) => boolean
): SidebarDocItem[] => ruleItems.filter(predicate);

const sidebars = {
    rules: [
        {
            className: "sb-doc-overview",
            id: "overview",
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
            className: "sb-cat-presets",
            collapsed: true,
            collapsible: true,
            customProps: {
                badge: "presets",
            },
            items: [
                {
                    className: "sb-preset-recommended",
                    id: "presets/recommended",
                    label: "✅ Recommended",
                    type: "doc",
                },
                {
                    className: "sb-preset-strict",
                    id: "presets/strict",
                    label: "🔒 Strict",
                    type: "doc",
                },
                {
                    className: "sb-preset-github",
                    id: "presets/github",
                    label: "🐙 GitHub",
                    type: "doc",
                },
                {
                    className: "sb-preset-gitlab",
                    id: "presets/gitlab",
                    label: "🦊 GitLab",
                    type: "doc",
                },
                {
                    className: "sb-preset-codeberg",
                    id: "presets/codeberg",
                    label: "🗻 Codeberg / Forgejo",
                    type: "doc",
                },
                {
                    className: "sb-preset-bitbucket",
                    id: "presets/bitbucket",
                    label: "🪣 Bitbucket",
                    type: "doc",
                },
                {
                    className: "sb-preset-aws",
                    id: "presets/aws",
                    label: "☁️ AWS",
                    type: "doc",
                },
                {
                    className: "sb-preset-azure",
                    id: "presets/azure",
                    label: "🔷 Azure",
                    type: "doc",
                },
                {
                    className: "sb-preset-google-cloud",
                    id: "presets/google-cloud",
                    label: "🌤️ Google Cloud",
                    type: "doc",
                },
                {
                    className: "sb-preset-docker",
                    id: "presets/docker",
                    label: "🐳 Docker",
                    type: "doc",
                },
                {
                    className: "sb-preset-vercel",
                    id: "presets/vercel",
                    label: "▲ Vercel",
                    type: "doc",
                },
                {
                    className: "sb-preset-netlify",
                    id: "presets/netlify",
                    label: "🌐 Netlify",
                    type: "doc",
                },
                {
                    className: "sb-preset-digitalocean",
                    id: "presets/digitalocean",
                    label: "🌊 DigitalOcean",
                    type: "doc",
                },
                {
                    className: "sb-preset-ai",
                    id: "presets/ai",
                    label: "🤖 AI",
                    type: "doc",
                },
                {
                    className: "sb-preset-all",
                    id: "presets/all",
                    label: "🧩 All",
                    type: "doc",
                },
            ],
            label: "🛠️ Presets",
            link: {
                id: "presets/index",
                type: "doc",
            },
            type: "category",
        },
        {
            className: "sb-cat-rules",
            collapsed: true,
            collapsible: true,
            customProps: {
                badge: "rules",
            },
            items: [
                {
                    className: "sb-cat-rules-repository",
                    collapsed: true,
                    collapsible: true,
                    items: createRuleItemsByKeyword("require-").filter(
                        (item) =>
                            !item.id.includes("github") &&
                            !item.id.includes("gitlab") &&
                            !item.id.includes("bitbucket") &&
                            !item.id.includes("forgejo") &&
                            !item.id.includes("aws") &&
                            !item.id.includes("azure") &&
                            !item.id.includes("google-cloud") &&
                            !item.id.includes("docker") &&
                            !item.id.includes("vercel") &&
                            !item.id.includes("netlify") &&
                            !item.id.includes("digitalocean") &&
                            !isAiRuleDocId(item.id)
                    ),
                    label: "📁 Repository baseline",
                    link: {
                        description:
                            "Cross-provider repository policy file checks.",
                        slug: "/category/repository-baseline",
                        title: "Repository baseline rules",
                        type: "generated-index",
                    },
                    type: "category",
                },
                {
                    className: "sb-cat-rules-github",
                    collapsed: true,
                    collapsible: true,
                    items: createRuleItemsByKeyword("github"),
                    label: "🐙 GitHub",
                    link: {
                        description:
                            "Rules for GitHub-specific repository requirements.",
                        slug: "/category/github",
                        title: "GitHub compliance rules",
                        type: "generated-index",
                    },
                    type: "category",
                },
                {
                    className: "sb-cat-rules-gitlab",
                    collapsed: true,
                    collapsible: true,
                    items: createRuleItemsByKeyword("gitlab"),
                    label: "🦊 GitLab",
                    link: {
                        description:
                            "Rules for GitLab-specific repository requirements.",
                        slug: "/category/gitlab",
                        title: "GitLab compliance rules",
                        type: "generated-index",
                    },
                    type: "category",
                },
                {
                    className: "sb-cat-rules-bitbucket",
                    collapsed: true,
                    collapsible: true,
                    items: createRuleItemsByKeyword("bitbucket"),
                    label: "🪣 Bitbucket",
                    link: {
                        description:
                            "Rules for Bitbucket-specific repository requirements.",
                        slug: "/category/bitbucket",
                        title: "Bitbucket compliance rules",
                        type: "generated-index",
                    },
                    type: "category",
                },
                {
                    className: "sb-cat-rules-forgejo",
                    collapsed: true,
                    collapsible: true,
                    items: createRuleItemsByKeyword("forgejo"),
                    label: "🗻 Codeberg / Forgejo",
                    link: {
                        description:
                            "Rules for Codeberg and Forgejo workflow requirements.",
                        slug: "/category/codeberg--forgejo",
                        title: "Codeberg and Forgejo compliance rules",
                        type: "generated-index",
                    },
                    type: "category",
                },
                {
                    className: "sb-cat-rules-aws",
                    collapsed: true,
                    collapsible: true,
                    items: createRuleItemsByKeyword("aws"),
                    label: "☁️ AWS",
                    link: {
                        description:
                            "Rules for AWS Amplify repository requirements.",
                        slug: "/category/aws",
                        title: "AWS compliance rules",
                        type: "generated-index",
                    },
                    type: "category",
                },
                {
                    className: "sb-cat-rules-azure",
                    collapsed: true,
                    collapsible: true,
                    items: createRuleItemsByKeyword("azure"),
                    label: "🔷 Azure",
                    link: {
                        description:
                            "Rules for Azure Pipelines-specific repository requirements.",
                        slug: "/category/azure",
                        title: "Azure compliance rules",
                        type: "generated-index",
                    },
                    type: "category",
                },
                {
                    className: "sb-cat-rules-google-cloud",
                    collapsed: true,
                    collapsible: true,
                    items: createRuleItemsByKeyword("google-cloud"),
                    label: "🌤️ Google Cloud",
                    link: {
                        description:
                            "Rules for Google Cloud Build repository requirements.",
                        slug: "/category/google-cloud",
                        title: "Google Cloud compliance rules",
                        type: "generated-index",
                    },
                    type: "category",
                },
                {
                    className: "sb-cat-rules-docker",
                    collapsed: true,
                    collapsible: true,
                    items: createRuleItemsByKeyword("docker"),
                    label: "🐳 Docker",
                    link: {
                        description:
                            "Rules for Docker repository packaging requirements.",
                        slug: "/category/docker",
                        title: "Docker compliance rules",
                        type: "generated-index",
                    },
                    type: "category",
                },
                {
                    className: "sb-cat-rules-vercel",
                    collapsed: true,
                    collapsible: true,
                    items: createRuleItemsByKeyword("vercel"),
                    label: "▲ Vercel",
                    link: {
                        description:
                            "Rules for Vercel deployment configuration.",
                        slug: "/category/vercel",
                        title: "Vercel compliance rules",
                        type: "generated-index",
                    },
                    type: "category",
                },
                {
                    className: "sb-cat-rules-netlify",
                    collapsed: true,
                    collapsible: true,
                    items: createRuleItemsByKeyword("netlify"),
                    label: "🌐 Netlify",
                    link: {
                        description:
                            "Rules for Netlify deployment configuration.",
                        slug: "/category/netlify",
                        title: "Netlify compliance rules",
                        type: "generated-index",
                    },
                    type: "category",
                },
                {
                    className: "sb-cat-rules-digitalocean",
                    collapsed: true,
                    collapsible: true,
                    items: createRuleItemsByKeyword("digitalocean"),
                    label: "🌊 DigitalOcean",
                    link: {
                        description:
                            "Rules for DigitalOcean App Platform repository requirements.",
                        slug: "/category/digitalocean",
                        title: "DigitalOcean compliance rules",
                        type: "generated-index",
                    },
                    type: "category",
                },
                {
                    className: "sb-cat-rules-ai",
                    collapsed: true,
                    collapsible: true,
                    items: createRuleItemsByPredicate((item) =>
                        isAiRuleDocId(item.id)
                    ),
                    label: "🤖 AI",
                    link: {
                        description:
                            "Rules for AI-assistance repository guidance files.",
                        slug: "/category/ai",
                        title: "AI guidance rules",
                        type: "generated-index",
                    },
                    type: "category",
                },
            ],
            label: "📜 Rules",
            link: {
                description:
                    "Rule documentation for every eslint-plugin-repo rule.",
                title: "Rule Reference",
                type: "generated-index",
            },
            type: "category",
        },
    ],
} satisfies SidebarsConfig;

export default sidebars;
