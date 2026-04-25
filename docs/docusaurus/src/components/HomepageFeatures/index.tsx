import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

type FeatureCard = {
    readonly description: string;
    readonly href: string;
    readonly icon: string;
    readonly title: string;
};

const featureCards = [
    {
        description:
            "Install the plugin, enable a preset, and start enforcing repository policy before CI catches drift.",
        href: "/docs/getting-started",
        icon: "🚀",
        title: "Get Started",
    },
    {
        description:
            "Choose the right rollout path for your team, from minimal baseline coverage to stricter provider-aware configs.",
        href: "/docs/rules/presets",
        icon: "🧩",
        title: "Presets",
    },
    {
        description:
            "Browse every rule with concrete incorrect/correct examples, plus generated API documentation for maintainers.",
        href: "/docs/rules/overview",
        icon: "📚",
        title: "Rule Reference",
    },
] as const satisfies readonly FeatureCard[];

/**
 * Render homepage feature cards for the docs landing page.
 *
 * @returns Homepage features section.
 */
export default function HomepageFeatures() {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className={styles.grid}>
                    {featureCards.map((feature) => (
                        <article key={feature.title} className={styles.card}>
                            <span className={styles.iconBadge}>
                                {feature.icon}
                            </span>
                            <Heading as="h3" className={styles.cardTitle}>
                                {feature.title}
                            </Heading>
                            <p className={styles.description}>
                                {feature.description}
                            </p>
                            <Link className={styles.link} to={feature.href}>
                                Open section
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
