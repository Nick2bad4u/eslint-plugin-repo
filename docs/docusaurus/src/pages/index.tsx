import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import GitHubStats from "../components/GitHubStats";
import HomepageFeatures from "../components/HomepageFeatures";
import styles from "./index.module.css";

type HeroBadge = {
    readonly title: string;
    readonly icon: string;
    readonly description: string;
};

type HeroStat = {
    readonly value: string;
    readonly label: string;
};

type AdoptionStep = {
    readonly step: string;
    readonly title: string;
    readonly description: string;
};

const homepageDescription =
    "Repository compliance docs, presets, and rule references for GitHub, GitLab, Bitbucket, and Forgejo teams.";
const homepageKeywords =
    "eslint-plugin-repo, repository compliance, github actions, gitlab ci, bitbucket pipelines, forgejo, eslint flat config";

const heroBadges = [
    {
        description:
            "Start with recommended coverage and layer in provider presets as your repository policies mature.",
        icon: "🧩",
        title: "Preset-driven rollout",
    },
    {
        description:
            "Rule docs, generated API references, ADRs, charts, and inspector builds now live in one coherent docs app.",
        icon: "📘",
        title: "Docs that explain intent",
    },
    {
        description:
            "Catch drift in workflow files, governance defaults, and repository hygiene before CI or review queues do.",
        icon: "🛡️",
        title: "Governance before drift",
    },
] as const satisfies readonly HeroBadge[];

const heroStats = [
    {
        label: "Hosting providers covered",
        value: "4 providers",
    },
    {
        label: "Entry points to adopt",
        value: "Preset-first",
    },
    {
        label: "Maintainer surfaces",
        value: "Docs + API",
    },
] as const satisfies readonly HeroStat[];

const adoptionSteps = [
    {
        description:
            "Enable the recommended baseline, then add the host preset that matches the repository you actually run.",
        step: "01",
        title: "Adopt incrementally",
    },
    {
        description:
            "Use rule docs, generated API pages, and inspector builds to understand what the plugin is enforcing.",
        step: "02",
        title: "Inspect confidently",
    },
    {
        description:
            "Ratchet toward strict coverage only after the baseline is stable and noisy migrations are under control.",
        step: "03",
        title: "Scale deliberately",
    },
] as const satisfies readonly AdoptionStep[];

const homepageStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    codeRepository: "https://github.com/Nick2bad4u/eslint-plugin-repo",
    description: homepageDescription,
    image: "https://nick2bad4u.github.io/eslint-plugin-repo/img/social-card.png",
    license:
        "https://github.com/Nick2bad4u/eslint-plugin-repo/blob/main/LICENSE",
    name: "eslint-plugin-repo",
    programmingLanguage: "TypeScript",
    runtimePlatform: "Node.js",
    url: "https://nick2bad4u.github.io/eslint-plugin-repo/",
} as const;

/**
 * Render docs homepage content for eslint-plugin-repo.
 *
 * @returns Homepage route element.
 */
export default function HomePage() {
    const logoUrl = useBaseUrl("img/logo.svg");
    const socialCardUrl = useBaseUrl("img/social-card.png");

    return (
        <Layout title="eslint-plugin-repo" description={homepageDescription}>
            <Head>
                <meta content={homepageKeywords} name="keywords" />
                <meta content={socialCardUrl} property="og:image" />
                <meta content="summary_large_image" name="twitter:card" />
                <meta content={socialCardUrl} name="twitter:image" />
                <script type="application/ld+json">
                    {JSON.stringify(homepageStructuredData)}
                </script>
            </Head>
            <main className={styles.homepage}>
                <section className={styles.hero}>
                    <div className={`container ${styles.heroGrid}`}>
                        <div className={styles.heroCopy}>
                            <span className={styles.eyebrow}>
                                Repository compliance for modern teams
                            </span>
                            <Heading as="h1" className={styles.title}>
                                Enforce repository rules before CI bites back.
                            </Heading>
                            <p className={styles.lead}>
                                <code>eslint-plugin-repo</code> helps teams
                                standardize repository policy files, CI workflow
                                structure, and provider-specific governance
                                across GitHub, GitLab, Bitbucket, and Forgejo /
                                Codeberg.
                            </p>

                            <div className={styles.badgeGrid}>
                                {heroBadges.map((badge) => (
                                    <article
                                        key={badge.title}
                                        className={styles.badgeCard}
                                    >
                                        <p className={styles.badgeTitleRow}>
                                            <span
                                                className={styles.badgeIcon}
                                                aria-hidden="true"
                                            >
                                                {badge.icon}
                                            </span>
                                            {badge.title}
                                        </p>
                                        <p className={styles.badgeDescription}>
                                            {badge.description}
                                        </p>
                                    </article>
                                ))}
                            </div>

                            <div className={styles.actions}>
                                <Link
                                    className={`button button--primary button--lg ${styles.actionButton}`}
                                    to="/docs/rules/overview"
                                >
                                    Browse Rules
                                </Link>
                                <Link
                                    className={`button button--secondary button--lg ${styles.actionButton}`}
                                    to="/docs/rules/presets"
                                >
                                    Explore Presets
                                </Link>
                                <Link
                                    className={`button button--outline button--lg ${styles.actionButton}`}
                                    to="/docs/developer"
                                >
                                    Maintainer Docs
                                </Link>
                            </div>

                            <GitHubStats />

                            <div className={styles.heroStats}>
                                {heroStats.map((stat) => (
                                    <article
                                        key={stat.label}
                                        className={styles.statCard}
                                    >
                                        <span className={styles.statValue}>
                                            {stat.value}
                                        </span>
                                        <span className={styles.statLabel}>
                                            {stat.label}
                                        </span>
                                    </article>
                                ))}
                            </div>
                        </div>

                        <div className={styles.panelStack}>
                            <aside
                                className={styles.panel}
                                aria-label="Project summary"
                            >
                                <div className={styles.panelHeader}>
                                    <div className={styles.logoWrap}>
                                        <img
                                            alt="eslint-plugin-repo logo"
                                            className={styles.logo}
                                            src={logoUrl}
                                        />
                                    </div>
                                    <div>
                                        <p className={styles.panelTitle}>
                                            eslint-plugin-repo
                                        </p>
                                        <p className={styles.panelSubtitle}>
                                            Flat-config-first repository linting
                                            with provider-aware rule groups.
                                        </p>
                                    </div>
                                </div>

                                <ul className={styles.chipList}>
                                    <li className={styles.chip}>🐙 GitHub</li>
                                    <li className={styles.chip}>🦊 GitLab</li>
                                    <li className={styles.chip}>
                                        🪣 Bitbucket
                                    </li>
                                    <li className={styles.chip}>🗻 Forgejo</li>
                                </ul>

                                <pre className={styles.codeBlock}>
                                    <code>{`import plugin from "eslint-plugin-repo";

export default [
  plugin.configs.recommended,
  plugin.configs.github,
];`}</code>
                                </pre>

                                <ul className={styles.checklist}>
                                    <li className={styles.checklistItem}>
                                        Repository baseline and provider presets
                                    </li>
                                    <li className={styles.checklistItem}>
                                        Generated API docs and config inspectors
                                    </li>
                                    <li className={styles.checklistItem}>
                                        Maintainer ADRs, charts, and rollout
                                        guidance
                                    </li>
                                </ul>

                                <div className={styles.meta}>
                                    <div className={styles.metaCard}>
                                        <span className={styles.metaLabel}>
                                            Coverage
                                        </span>
                                        <span className={styles.metaValue}>
                                            4 providers
                                        </span>
                                    </div>
                                    <div className={styles.metaCard}>
                                        <span className={styles.metaLabel}>
                                            Docs
                                        </span>
                                        <span className={styles.metaValue}>
                                            Rules + API
                                        </span>
                                    </div>
                                    <div className={styles.metaCard}>
                                        <span className={styles.metaLabel}>
                                            Workflow
                                        </span>
                                        <span className={styles.metaValue}>
                                            Flat Config
                                        </span>
                                    </div>
                                </div>
                            </aside>

                            <aside
                                className={styles.roadmap}
                                aria-label="Adoption roadmap"
                            >
                                <p className={styles.roadmapTitle}>
                                    Adoption path
                                </p>
                                <ol className={styles.roadmapList}>
                                    {adoptionSteps.map((item) => (
                                        <li
                                            key={item.step}
                                            className={styles.roadmapItem}
                                        >
                                            <span
                                                className={styles.roadmapStep}
                                            >
                                                {item.step}
                                            </span>
                                            <div className={styles.roadmapCopy}>
                                                <strong>{item.title}</strong>
                                                <p>{item.description}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>

                                <div className={styles.quickLinks}>
                                    <Link
                                        className={styles.quickLink}
                                        to="/docs/getting-started"
                                    >
                                        Quick start guide
                                    </Link>
                                    <Link
                                        className={styles.quickLink}
                                        to="/docs/rules/presets"
                                    >
                                        Compare presets
                                    </Link>
                                    <Link
                                        className={styles.quickLink}
                                        to="/docs/developer"
                                    >
                                        Maintainer workflows
                                    </Link>
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>

                <HomepageFeatures />
            </main>
        </Layout>
    );
}
