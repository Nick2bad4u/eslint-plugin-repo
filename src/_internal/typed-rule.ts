import type { UnknownArray } from "type-fest";
import type ts from "typescript";

import { ESLintUtils, type TSESLint } from "@typescript-eslint/utils";
import { assertDefined } from "ts-extras";

import { getRuleCatalogEntryForRuleNameOrNull } from "./rule-catalog.js";
import { createRuleDocsUrl } from "./rule-docs-url.js";

/**
 * Canonical typed rule creator signature for plugin rules.
 */
export type RuleCreator = ReturnType<typeof ESLintUtils.RuleCreator<RuleDocs>>;

/**
 * Additional docs metadata supported by plugin rules.
 */
type RuleDocs = {
    recommended?: boolean;
    repoConfigs?: readonly string[] | string;
    requiresTypeChecking?: boolean;
    ruleId?: string;
    ruleNumber?: number;
};

/**
 * Shared rule context type used by typed helper utilities.
 */
type TypedRuleContext = Readonly<
    TSESLint.RuleContext<string, Readonly<UnknownArray>>
>;

/**
 * Typed services exposed to rules that require type information.
 */
type TypedRuleServices = {
    checker: ts.TypeChecker;
    parserServices: ReturnType<typeof ESLintUtils.getParserServices>;
};

/**
 * Creates a typed rule with enforced canonical docs metadata.
 */
export const createTypedRule: RuleCreator = (ruleDefinition) => {
    const catalogEntry = getRuleCatalogEntryForRuleNameOrNull(
        ruleDefinition.name
    );
    const createdRule = ESLintUtils.RuleCreator.withoutDocs(ruleDefinition);
    const ruleDocs = createdRule.meta.docs;

    assertDefined(ruleDocs);

    const canonicalDocsUrl = createRuleDocsUrl(ruleDefinition.name);
    if (typeof ruleDocs.url === "string" && ruleDocs.url !== canonicalDocsUrl) {
        throw new TypeError(
            `Rule '${ruleDefinition.name}' has non-canonical docs.url '${ruleDocs.url}'. Expected '${canonicalDocsUrl}'.`
        );
    }

    const docsWithCatalog =
        catalogEntry === null
            ? {
                  ...ruleDocs,
                  url: canonicalDocsUrl,
              }
            : {
                  ...ruleDocs,
                  ruleId: catalogEntry.ruleId,
                  ruleNumber: catalogEntry.ruleNumber,
                  url: canonicalDocsUrl,
              };

    return {
        ...createdRule,
        meta: {
            ...createdRule.meta,
            docs: docsWithCatalog,
        },
        name: ruleDefinition.name,
    };
};

/**
 * Retrieves parser services and type checker for typed rules.
 */
export const getTypedRuleServices = (
    context: TypedRuleContext
): TypedRuleServices => {
    const parserServices = ESLintUtils.getParserServices(context, true);
    const program = parserServices.program;

    if (program === null) {
        throw new Error(
            "Typed rule requires parserServices.program; ensure projectService is enabled for this lint run."
        );
    }

    return {
        checker: program.getTypeChecker(),
        parserServices,
    };
};
