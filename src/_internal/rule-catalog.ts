/* eslint-disable typedoc/require-exported-doc-comment -- migration scaffold stage: exported APIs are still being documented. */
export type RuleCatalogEntry = Readonly<{
    ruleId: RuleCatalogId;
    ruleName: string;
    ruleNumber: number;
}>;

export type RuleCatalogId = `R${string}`;

const orderedRuleNames = [
    "require-readme-file",
    "require-license-file",
    "require-contributing-file",
    "require-code-of-conduct-file",
    "require-security-policy-file",
    "require-support-file",
    "require-codeowners-file",
    "require-issue-template-file",
    "require-pull-request-template-file",
    "require-dependabot-config-file",
    "require-github-actions-workflow-file",
    "require-gitlab-ci-config-file",
    "require-gitlab-issue-template-file",
    "require-gitlab-merge-request-template-file",
    "require-bitbucket-pipelines-config-file",
    "require-forgejo-actions-workflow-file",
] as const;

const toRuleCatalogId = (ruleNumber: number): RuleCatalogId =>
    `R${String(ruleNumber).padStart(3, "0")}`;

export const ruleCatalogEntries: readonly RuleCatalogEntry[] =
    orderedRuleNames.map((ruleName, index) => {
        const ruleNumber = index + 1;

        return {
            ruleId: toRuleCatalogId(ruleNumber),
            ruleName,
            ruleNumber,
        };
    });

const ruleCatalogByRuleName = new Map(
    ruleCatalogEntries.map((entry) => [entry.ruleName, entry])
);

export const getRuleCatalogEntryForRuleNameOrNull = (
    ruleName: string
): null | RuleCatalogEntry => ruleCatalogByRuleName.get(ruleName) ?? null;
/* eslint-enable typedoc/require-exported-doc-comment */
