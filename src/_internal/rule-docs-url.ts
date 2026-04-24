/* eslint-disable typedoc/require-exported-doc-comment -- migration scaffold stage: exported APIs are still being documented. */
export const RULE_DOCS_URL_BASE =
    "https://nick2bad4u.github.io/eslint-plugin-repo-compliance/docs/rules/" as const;

export const createRuleDocsUrl = (ruleName: string): string =>
    `${RULE_DOCS_URL_BASE}${ruleName}`;
/* eslint-enable typedoc/require-exported-doc-comment */
