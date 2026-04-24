import Link from "@docusaurus/Link";

import styles from "./GitHubStats.module.css";

type GitHubStatsProps = {
    readonly className?: string;
};

type LiveBadge = {
    readonly alt: string;
    readonly href: string;
    readonly src: string;
};

const packageName = "eslint-plugin-repo-compliance";
const repositorySlug = "Nick2bad4u/eslint-plugin-repo-compliance";

const liveBadges = [
    {
        alt: "npm license",
        href: `https://github.com/${repositorySlug}/blob/main/LICENSE`,
        src: `https://flat.badgen.net/npm/license/${packageName}?color=purple`,
    },
    {
        alt: "npm total downloads",
        href: `https://www.npmjs.com/package/${packageName}`,
        src: `https://flat.badgen.net/npm/dt/${packageName}?color=pink`,
    },
    {
        alt: "latest GitHub release",
        href: `https://github.com/${repositorySlug}/releases`,
        src: `https://flat.badgen.net/github/release/${repositorySlug}?color=cyan`,
    },
    {
        alt: "GitHub stars",
        href: `https://github.com/${repositorySlug}/stargazers`,
        src: `https://flat.badgen.net/github/stars/${repositorySlug}?color=yellow`,
    },
] as const satisfies readonly LiveBadge[];

/**
 * Render live repository/package badges for the docs homepage.
 *
 * @param props - Optional class name override.
 *
 * @returns Badge list component.
 */
export default function GitHubStats({ className = "" }: GitHubStatsProps) {
    const badgeListClassName = [styles.liveBadgeList, className]
        .filter(Boolean)
        .join(" ");

    return (
        <ul className={badgeListClassName}>
            {liveBadges.map((badge) => (
                <li key={badge.src} className={styles.liveBadgeListItem}>
                    <Link
                        className={styles.liveBadgeAnchor}
                        href={badge.href}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            alt={badge.alt}
                            className={styles.liveBadgeImage}
                            src={badge.src}
                            loading="lazy"
                            decoding="async"
                        />
                    </Link>
                </li>
            ))}
        </ul>
    );
}
