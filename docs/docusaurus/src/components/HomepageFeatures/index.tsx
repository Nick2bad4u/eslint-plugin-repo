import Link from "@docusaurus/Link";

import type { ReactNode } from "react";

import styles from "./index.module.css";

type PrimaryFeature = {
    readonly title: string;
    readonly icon: string;
    readonly eyebrow: string;
    readonly description: string;
    readonly bullets: readonly string[];
    readonly href: string;
};

type SecondaryFeature = {
    readonly title: string;
    readonly description: string;
    readonly href: string;
};

const primaryFeatures = [
    {
        title: "Repository compliance without CI surprises",
        eyebrow: "Adoption",
        icon: "🧭",
        description:
            "Push repository policy checks into local linting so drift shows up during development instead of after a PR is opened.",
        bullets: [
            "Provider-specific rules for GitHub, GitLab, Bitbucket, and Forgejo.",
            "Rule docs organized by preset and host platform.",
            "A safer path to consistent repository hygiene.",
        ],
        href: "/docs/rules/overview",
    },
    {
        title: "Maintainer docs that explain the why",
        eyebrow: "Maintenance",
        icon: "📘",
        description:
            "The Docusaurus site now separates end-user rule docs, developer guides, ADRs, and generated API references.",
        bullets: [
            "Focused development guide and publishing notes.",
            "Generated TypeDoc output wired into the docs app.",
            "Architecture charts and ADRs for long-term maintenance.",
        ],
        href: "/docs/developer",
    },
    {
        title: "Preset-driven rollout strategy",
        eyebrow: "Scale",
        icon: "🛠️",
        description:
            "Adopt repository rules incrementally with provider presets and a clear path from recommended to stricter enforcement.",
        bullets: [
            "Start with recommended coverage.",
            "Layer in host-specific presets intentionally.",
            "Keep docs, presets, and generated API surfaces in sync.",
        ],
        href: "/docs/rules/presets",
    },
] as const satisfies readonly PrimaryFeature[];

const secondaryFeatures = [
    {
        description:
            "Understand how docs, generated API references, and inspector builds fit together before you change the site.",
        href: "/docs/developer/charts/docs-and-api-pipeline",
        title: "See the docs pipeline",
    },
    {
        description:
            "Use ADRs and the typed-paths inventory when you need to make maintainable changes without guessing at repo conventions.",
        href: "/docs/developer/adr",
        title: "Read the architecture decisions",
    },
    {
        description:
            "Jump straight into the generated plugin surface when you need runtime exports, type aliases, or internal API references.",
        href: "/docs/developer/api",
        title: "Inspect the generated API",
    },
] as const satisfies readonly SecondaryFeature[];

function renderBulletList(bullets: readonly string[]): ReactNode {
    return (
        <ul className={styles.list}>
            {bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
            ))}
        </ul>
    );
}

/**
 * Render homepage feature cards for the docs landing page.
 *
 * @returns Homepage features section.
 */
export default function HomepageFeatures() {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className={styles.heading}>
                    <span className={styles.eyebrow}>Why this plugin</span>
                    <h2 className={styles.title}>
                        Built for repository governance, not generic lint
                        vanity.
                    </h2>
                    <p className={styles.lead}>
                        <code>eslint-plugin-repo</code> targets the policies
                        that usually drift across repository hosts: workflow
                        conventions, CI defaults, Dependabot review flows, and
                        baseline repository files.
                    </p>
                </div>

                <div className={styles.grid}>
                    {primaryFeatures.map((feature) => (
                        <article key={feature.title} className={styles.card}>
                            <span className={styles.kicker}>
                                {feature.eyebrow}
                            </span>
                            <div className={styles.icon} aria-hidden="true">
                                {feature.icon}
                            </div>
                            <h3 className={styles.cardTitle}>
                                {feature.title}
                            </h3>
                            <p className={styles.description}>
                                {feature.description}
                            </p>
                            {renderBulletList(feature.bullets)}
                            <Link
                                className={`button button--sm button--secondary ${styles.action}`}
                                to={feature.href}
                            >
                                Explore
                            </Link>
                        </article>
                    ))}
                </div>

                <section
                    className={styles.secondarySection}
                    aria-label="Maintainer shortcuts"
                >
                    <div className={styles.secondaryIntro}>
                        <span className={styles.secondaryEyebrow}>
                            Maintainer shortcuts
                        </span>
                        <h3 className={styles.secondaryTitle}>
                            More than a rule catalog
                        </h3>
                        <p className={styles.secondaryLead}>
                            The docs app now doubles as a maintenance surface
                            for charts, ADRs, generated API output, and
                            validation workflows.
                        </p>
                    </div>

                    <div className={styles.secondaryGrid}>
                        {secondaryFeatures.map((feature) => (
                            <article
                                key={feature.title}
                                className={styles.secondaryCard}
                            >
                                <h4 className={styles.secondaryCardTitle}>
                                    {feature.title}
                                </h4>
                                <p className={styles.secondaryDescription}>
                                    {feature.description}
                                </p>
                                <Link
                                    className={styles.secondaryLink}
                                    to={feature.href}
                                >
                                    Open section
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </section>
    );
}
