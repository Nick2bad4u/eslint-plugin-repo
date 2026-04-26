import type { TSESLint } from "@typescript-eslint/utils";

import { describe, expect, it } from "vitest";

import { deriveRuleDocsMetadataByName } from "../../src/_internal/rule-docs-metadata";

type FixtureDocs = Readonly<{
    description: string;
    recommended: boolean;
    repoConfigs: readonly string[] | string;
    requiresTypeChecking: boolean;
    ruleId: string;
    ruleNumber: number;
    url: string;
}>;

type FixtureRule = TSESLint.RuleModule<"fixtureMessage", readonly []>;

type RulesParameter = Parameters<typeof deriveRuleDocsMetadataByName>[0];

const createFixtureRule = (docs: FixtureDocs): FixtureRule => ({
    create() {
        return {};
    },
    defaultOptions: [],
    meta: {
        docs,
        messages: {
            fixtureMessage: "fixture",
        },
        schema: [],
        type: "problem",
    },
});

describe(deriveRuleDocsMetadataByName, () => {
    it("normalizes string and repeated repo config references", () => {
        expect.hasAssertions();

        const metadata = deriveRuleDocsMetadataByName({
            "require-fixture-doc-rule": createFixtureRule({
                description: "fixture docs description",
                recommended: false,
                repoConfigs: [
                    "repoPlugin.configs.recommended",
                    "repoPlugin.configs.recommended",
                    "repoPlugin.configs.strict",
                ],
                requiresTypeChecking: false,
                ruleId: "R999",
                ruleNumber: 999,
                url: "https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-fixture-doc-rule",
            }),
        });

        expect(metadata["require-fixture-doc-rule"]?.configNames).toStrictEqual(
            ["recommended", "strict"]
        );
    });

    it("accepts a single repoConfigs string reference", () => {
        expect.hasAssertions();

        const metadata = deriveRuleDocsMetadataByName({
            "require-fixture-single-config": createFixtureRule({
                description: "fixture docs description",
                recommended: true,
                repoConfigs: "repoPlugin.configs.github",
                requiresTypeChecking: false,
                ruleId: "R998",
                ruleNumber: 998,
                url: "https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-fixture-single-config",
            }),
        });

        expect(
            metadata["require-fixture-single-config"]?.configNames
        ).toStrictEqual(["github"]);
    });

    it("throws on invalid preset references", () => {
        expect.hasAssertions();

        expect(() =>
            deriveRuleDocsMetadataByName({
                "require-fixture-invalid-config": createFixtureRule({
                    description: "fixture docs description",
                    recommended: false,
                    repoConfigs: "repoPlugin.configs.not-real",
                    requiresTypeChecking: false,
                    ruleId: "R997",
                    ruleNumber: 997,
                    url: "https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-fixture-invalid-config",
                }),
            })
        ).toThrow("invalid docs.repoConfigs reference");
    });

    it("throws when docs.description is missing", () => {
        expect.hasAssertions();

        expect(() =>
            deriveRuleDocsMetadataByName({
                "require-fixture-missing-description": createFixtureRule({
                    description: "",
                    recommended: false,
                    repoConfigs: "repoPlugin.configs.recommended",
                    requiresTypeChecking: false,
                    ruleId: "R996",
                    ruleNumber: 996,
                    url: "https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-fixture-missing-description",
                }),
            })
        ).toThrow("must define docs.description");
    });

    it("throws when docs.url is missing", () => {
        expect.hasAssertions();

        expect(() =>
            deriveRuleDocsMetadataByName({
                "require-fixture-missing-url": createFixtureRule({
                    description: "fixture docs description",
                    recommended: false,
                    repoConfigs: "repoPlugin.configs.recommended",
                    requiresTypeChecking: false,
                    ruleId: "R995",
                    ruleNumber: 995,
                    url: "",
                }),
            })
        ).toThrow("must define docs.url");
    });

    it("throws when docs.repoConfigs has an invalid type", () => {
        expect.hasAssertions();

        expect(() =>
            deriveRuleDocsMetadataByName({
                "require-fixture-invalid-repo-configs-type": createFixtureRule({
                    description: "fixture docs description",
                    recommended: false,
                    repoConfigs: 123 as unknown as FixtureDocs["repoConfigs"],
                    requiresTypeChecking: false,
                    ruleId: "R994",
                    ruleNumber: 994,
                    url: "https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-fixture-invalid-repo-configs-type",
                }),
            })
        ).toThrow("must define docs.repoConfigs as a string or string array");
    });

    it("throws when docs.repoConfigs resolves to no presets", () => {
        expect.hasAssertions();

        expect(() =>
            deriveRuleDocsMetadataByName({
                "require-fixture-empty-repo-configs": createFixtureRule({
                    description: "fixture docs description",
                    recommended: false,
                    repoConfigs: [],
                    requiresTypeChecking: false,
                    ruleId: "R993",
                    ruleNumber: 993,
                    url: "https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-fixture-empty-repo-configs",
                }),
            })
        ).toThrow("must belong to at least one preset");
    });

    it("throws when a rule key does not match the require-* contract", () => {
        expect.hasAssertions();

        const invalidRuleMap = {
            "fixture-invalid-rule-name": createFixtureRule({
                description: "fixture docs description",
                recommended: false,
                repoConfigs: "repoPlugin.configs.recommended",
                requiresTypeChecking: false,
                ruleId: "R992",
                ruleNumber: 992,
                url: "https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/fixture-invalid-rule-name",
            }),
        } as unknown as RulesParameter;

        expect(() => deriveRuleDocsMetadataByName(invalidRuleMap)).toThrow(
            "Unexpected rule name"
        );
    });
});
