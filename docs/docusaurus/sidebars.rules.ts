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
            customProps: {
                badge: "presets",
            },
            type: "category",
            label: "Presets",
            link: {
                type: "doc",
                id: "presets/index",
            },
            items: [
                {
                    id: "presets/recommended",
                    label: "✅ Recommended",
                    type: "doc",
                },
                { id: "presets/strict", label: "🔒 Strict", type: "doc" },
                { id: "presets/github", label: "🐙 GitHub", type: "doc" },
                { id: "presets/gitlab", label: "🦊 GitLab", type: "doc" },
                { id: "presets/codeberg", label: "🗻 Codeberg", type: "doc" },
                { id: "presets/bitbucket", label: "🪣 Bitbucket", type: "doc" },
                { id: "presets/all", label: "🧩 All", type: "doc" },
            ],
        },
        {
            className: "sb-cat-rules",
            collapsed: true,
            type: "category",
            label: "Rules",
            link: {
                type: "generated-index",
                title: "Rule Reference",
                description:
                    "Rule documentation for every eslint-plugin-repo rule.",
            },
            items: [
                {
                    type: "category",
                    label: "Repository baseline",
                    link: {
                        type: "generated-index",
                        title: "Repository baseline rules",
                        description:
                            "Cross-provider repository policy file checks.",
                    },
                    items: createRuleItemsByKeyword("require-").filter(
                        (item) =>
                            !item.id.includes("github") &&
                            !item.id.includes("gitlab") &&
                            !item.id.includes("bitbucket") &&
                            !item.id.includes("forgejo")
                    ),
                },
                {
                    type: "category",
                    label: "GitHub",
                    link: {
                        type: "generated-index",
                        title: "GitHub compliance rules",
                        description:
                            "Rules for GitHub-specific repository requirements.",
                    },
                    items: createRuleItemsByKeyword("github"),
                },
                {
                    type: "category",
                    label: "GitLab",
                    link: {
                        type: "generated-index",
                        title: "GitLab compliance rules",
                        description:
                            "Rules for GitLab-specific repository requirements.",
                    },
                    items: createRuleItemsByKeyword("gitlab"),
                },
                {
                    type: "category",
                    label: "Bitbucket",
                    link: {
                        type: "generated-index",
                        title: "Bitbucket compliance rules",
                        description:
                            "Rules for Bitbucket-specific repository requirements.",
                    },
                    items: createRuleItemsByKeyword("bitbucket"),
                },
                {
                    type: "category",
                    label: "Codeberg / Forgejo",
                    link: {
                        type: "generated-index",
                        title: "Codeberg and Forgejo compliance rules",
                        description:
                            "Rules for Codeberg/Forgejo workflow requirements.",
                    },
                    items: createRuleItemsByKeyword("forgejo"),
                },
            ],
        },
    ],
} satisfies SidebarsConfig;

export default sidebars;
