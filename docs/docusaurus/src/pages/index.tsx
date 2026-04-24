import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import GitHubStats from "../components/GitHubStats";

/**
 * Render docs homepage content for eslint-plugin-repo-compliance.
 *
 * @returns Homepage route element.
 */
export default function HomePage() {
    return (
        <Layout
            title="eslint-plugin-repo-compliance"
            description="ESLint rules for repository compliance across major hosting providers."
        >
            <main className="container padding-vert--xl">
                <Heading as="h1">eslint-plugin-repo-compliance</Heading>
                <p>
                    Enforce repository policy files and provider-specific
                    workflows for GitHub, GitLab, Bitbucket, and
                    Codeberg/Forgejo.
                </p>

                <div className="margin-bottom--md">
                    <Link
                        className="button button--primary"
                        to="/docs/rules/overview"
                    >
                        Documentation
                    </Link>
                    <Link
                        className="button button--secondary"
                        to="/docs/rules/presets"
                    >
                        Presets
                    </Link>
                </div>

                <GitHubStats />
            </main>
        </Layout>
    );
}
