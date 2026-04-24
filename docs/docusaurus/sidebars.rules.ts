/**
 * @packageDocumentation
 * Sidebar generation for repository-compliance rule documentation.
 */
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

type SidebarDocItem = {
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

const toNumberedRuleLabel = (ruleNumber: number, ruleDocId: string): string =>
    `${String(ruleNumber).padStart(2, "0")} ${ruleDocId}`;

const ruleItems: SidebarDocItem[] = allRequireRuleDocIds.map(
    (ruleDocId, index) => ({
        id: ruleDocId,
        label: toNumberedRuleLabel(index + 1, ruleDocId),
        type: "doc",
    })
);

const createRuleItemsByKeyword = (keyword: string): SidebarDocItem[] =>
    ruleItems.filter((item) => item.id.includes(keyword));

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
                    items: createRuleItemsByKeyword("require-").filter(
                        (item) =>
                            !item.id.includes("github") &&
                            !item.id.includes("gitlab") &&
                            !item.id.includes("bitbucket") &&
                            !item.id.includes("forgejo")
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
