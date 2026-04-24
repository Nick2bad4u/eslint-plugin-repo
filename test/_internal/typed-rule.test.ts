import { describe, expect, it } from "vitest";

import { createTypedRule } from "../../src/_internal/typed-rule";

type FixtureRuleDefinition = Parameters<typeof createTypedRule>[0];

const createFixtureRuleDefinition = (
    name: string,
    docsOverrides: Readonly<Record<string, unknown>> = {}
): FixtureRuleDefinition => ({
    create() {
        return {};
    },
    defaultOptions: [],
    meta: {
        docs: {
            description: "fixture rule",
            recommended: false,
            repoConfigs: ["repoPlugin.configs.recommended"],
            requiresTypeChecking: false,
            ...docsOverrides,
        },
        messages: {
            fixtureMessage: "fixture",
        },
        schema: [],
        type: "problem",
    },
    name,
});

describe(createTypedRule, () => {
    it("injects canonical catalog metadata for known rules", () => {
        expect.hasAssertions();

        const rule = createTypedRule(
            createFixtureRuleDefinition("require-readme-file")
        );

        expect(rule.meta.docs).toStrictEqual(
            expect.objectContaining({
                ruleId: "R001",
                ruleNumber: 1,
                url: "https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-readme-file",
            })
        );
    });

    it("still injects a canonical docs url for uncatalogued rules", () => {
        expect.hasAssertions();

        const rule = createTypedRule(
            createFixtureRuleDefinition("require-fixture-uncatalogued-rule")
        );

        expect(rule.meta.docs).toStrictEqual(
            expect.objectContaining({
                url: "https://nick2bad4u.github.io/eslint-plugin-repo/docs/rules/require-fixture-uncatalogued-rule",
            })
        );
        expect(rule.meta.docs).not.toHaveProperty("ruleId");
    });

    it("throws when a rule declares a non-canonical docs url", () => {
        expect.hasAssertions();

        expect(() =>
            createTypedRule(
                createFixtureRuleDefinition("require-readme-file", {
                    url: "https://example.com/not-canonical",
                })
            )
        ).toThrow("non-canonical docs.url");
    });
});
