/**
 * Base URL for plugin rule documentation pages.
 */
export const RULE_DOCS_URL_BASE =
    "https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/" as const;

/**
 * Creates the canonical documentation URL for a rule.
 */
export const createRuleDocsUrl = (ruleName: string): string =>
    `${RULE_DOCS_URL_BASE}${ruleName}`;
