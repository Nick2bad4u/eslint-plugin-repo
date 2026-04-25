import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import GitHubStats from "../components/GitHubStats";
import HomepageFeatures from "../components/HomepageFeatures";
import styles from "./index.module.css";

type HeroBadge = {
    readonly description: string;
    readonly icon: string;
    readonly title: string;
};

const homepageDescription =
    "Repository compliance docs, presets, and rule references for GitHub, GitLab, Bitbucket, Codeberg/Forgejo, AWS, Azure, Google Cloud, Docker, Vercel, Netlify, and DigitalOcean teams.";
const homepageKeywords =
    "eslint-plugin-repo, repository compliance, github actions, gitlab ci, bitbucket pipelines, forgejo, aws amplify, azure pipelines, google cloud build, docker, vercel, netlify, digitalocean, eslint flat config";

const heroBadges = [
    {
        description:
            "Start with recommended coverage, then layer in the provider preset that matches the host you actually use.",
        icon: "🧩",
        title: "Flat Config native",
    },
    {
        description:
            "Repository-baseline and provider presets stay focused on the policy files and workflow structure teams actually drift on.",
        icon: "📘",
        title: "Provider-aware presets",
    },
    {
        description:
            "Rule docs and generated API pages explain what the plugin is enforcing before CI or review queues discover drift for you.",
        icon: "🛡️",
        title: "Actionable rule docs",
    },
] as const satisfies readonly HeroBadge[];

const heroStats = [
    {
        label: "Hosting providers covered",
        value: "11 providers",
    },
    {
        label: "Start small, scale later",
        value: "Presets first",
    },
    {
        label: "Reference surface",
        value: "Rules + API",
    },
] as const satisfies readonly {
    readonly label: string;
    readonly value: string;
}[];

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
                    <div className={`container ${styles.heroInner}`}>
                        <div className={styles.copyColumn}>
                            <span className={styles.eyebrow}>
                                ESLint plugin for modern repository teams
                            </span>
                            <Heading as="h1" className={styles.title}>
                                eslint-plugin-repo
                            </Heading>
                            <p className={styles.lead}>
                                <code>eslint-plugin-repo</code> helps teams
                                enforce repository policy files, CI workflow
                                structure, and provider-specific governance
                                across major repository and hosting providers.
                            </p>

                            <div className={styles.infoGrid}>
                                {heroBadges.map((badge) => (
                                    <article
                                        key={badge.title}
                                        className={styles.infoCard}
                                    >
                                        <p className={styles.infoTitle}>
                                            <span
                                                className={styles.infoIcon}
                                                aria-hidden="true"
                                            >
                                                {badge.icon}
                                            </span>
                                            {badge.title}
                                        </p>
                                        <p className={styles.infoDescription}>
                                            {badge.description}
                                        </p>
                                    </article>
                                ))}
                            </div>

                            <div className={styles.actions}>
                                <Link
                                    className={`button button--primary button--lg ${styles.actionButton}`}
                                    to="/docs/intro"
                                >
                                    Start with Overview
                                </Link>
                                <Link
                                    className={`button button--secondary button--lg ${styles.actionButton}`}
                                    to="/docs/rules/presets"
                                >
                                    Compare Presets
                                </Link>
                            </div>

                            <GitHubStats className={styles.badges} />

                            <div className={styles.statGrid}>
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

                        <aside
                            className={styles.visualPanel}
                            aria-label="Project summary"
                        >
                            <div className={styles.visualHeader}>
                                <div className={styles.logoFrame}>
                                    <img
                                        alt="eslint-plugin-repo logo"
                                        className={styles.logo}
                                        src={logoUrl}
                                    />
                                </div>
                                <div>
                                    <p className={styles.visualTitle}>
                                        Repository rules, not generic lint
                                        vanity
                                    </p>
                                    <p className={styles.visualLead}>
                                        Provider-aware repository policy linting
                                        with docs and generated API references.
                                    </p>
                                </div>
                            </div>

                            <pre className={styles.codeBlock}>
                                <code>{`import plugin from "eslint-plugin-repo";

export default [
  plugin.configs.recommended,
  plugin.configs.github,
];`}</code>
                            </pre>

                            <ul className={styles.chipList}>
                                <li className={styles.chip}>🐙 GitHub</li>
                                <li className={styles.chip}>🦊 GitLab</li>
                                <li className={styles.chip}>🪣 Bitbucket</li>
                                <li className={styles.chip}>🗻 Forgejo</li>
                                <li className={styles.chip}>☁️ AWS</li>
                                <li className={styles.chip}>🔷 Azure</li>
                                <li className={styles.chip}>🐳 Docker</li>
                            </ul>

                            <ul className={styles.visualList}>
                                <li className={styles.visualListItem}>
                                    Start with the recommended baseline.
                                </li>
                                <li className={styles.visualListItem}>
                                    Add the provider preset your repository
                                    actually uses.
                                </li>
                                <li className={styles.visualListItem}>
                                    Browse rule docs before CI surprises you.
                                </li>
                            </ul>
                        </aside>
                    </div>
                </section>

                <HomepageFeatures />
            </main>
        </Layout>
    );
}
