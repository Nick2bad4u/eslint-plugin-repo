import Link from "@docusaurus/Link";

import styles from "./GitHubStats.module.css";

interface GitHubStatsProps {
    readonly className?: string;
}

interface LiveBadge {
    readonly alt: string;
    readonly href: string;
    readonly src: string;
}

const packageName = "eslint-plugin-repo";
const repositorySlug = "Nick2bad4u/eslint-plugin-repo";

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
    {
        alt: "GitHub forks",
        href: `https://github.com/${repositorySlug}/forks`,
        src: `https://flat.badgen.net/github/forks/${repositorySlug}?color=green`,
    },
    {
        alt: "GitHub open issues",
        href: `https://github.com/${repositorySlug}/issues`,
        src: `https://flat.badgen.net/github/open-issues/${repositorySlug}?color=red`,
    },
    {
        alt: "Codecov",
        href: `https://app.codecov.io/gh/${repositorySlug}`,
        src: `https://flat.badgen.net/codecov/github/${repositorySlug}?color=blue`,
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
                <li className={styles.liveBadgeListItem} key={badge.src}>
                    <Link
                        className={styles.liveBadgeAnchor}
                        href={badge.href}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <img
                            alt={badge.alt}
                            className={styles.liveBadgeImage}
                            decoding="async"
                            loading="lazy"
                            src={badge.src}
                        />
                    </Link>
                </li>
            ))}
        </ul>
    );
}
