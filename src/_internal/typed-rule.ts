/* eslint-disable typedoc/require-exported-doc-comment -- migration scaffold stage: exported APIs are still being documented. */
import type { UnknownArray } from "type-fest";
import type ts from "typescript";

import { ESLintUtils, type TSESLint } from "@typescript-eslint/utils";

import { getRuleCatalogEntryForRuleNameOrNull } from "./rule-catalog.js";
import { createRuleDocsUrl } from "./rule-docs-url.js";

export type RuleDocs = {
    recommended?: boolean;
    repoConfigs?: readonly string[] | string;
    requiresTypeChecking?: boolean;
    ruleId?: string;
    ruleNumber?: number;
};

export type TypedRuleServices = {
    checker: ts.TypeChecker;
    parserServices: ReturnType<typeof ESLintUtils.getParserServices>;
};

type RuleCreator = ReturnType<typeof ESLintUtils.RuleCreator<RuleDocs>>;

type TypedRuleContext = Readonly<
    TSESLint.RuleContext<string, Readonly<UnknownArray>>
>;

export const createTypedRule: RuleCreator = (ruleDefinition) => {
    const catalogEntry = getRuleCatalogEntryForRuleNameOrNull(
        ruleDefinition.name
    );
    const createdRule = ESLintUtils.RuleCreator.withoutDocs(ruleDefinition);
    const ruleDocs = createdRule.meta.docs;

    if (ruleDocs === undefined) {
        throw new TypeError(
            `Rule '${ruleDefinition.name}' must define meta.docs.`
        );
    }

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
/* eslint-enable typedoc/require-exported-doc-comment */
