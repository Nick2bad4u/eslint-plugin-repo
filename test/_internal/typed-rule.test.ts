import { describe, expect, it } from "vitest";

import {
    createTypedRule,
    getTypedRuleServices,
} from "../../src/_internal/typed-rule";

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

    it("returns checker and parserServices when program exists", () => {
        expect.hasAssertions();

        const checker = { kind: "fixture-checker" };
        const parserServices = {
            esTreeNodeToTSNodeMap: new WeakMap<object, object>(),
            program: {
                getTypeChecker: () => checker,
            },
            tsNodeToESTreeNodeMap: new WeakMap<object, object>(),
        };

        const context = {
            languageOptions: {
                parser: {
                    meta: {
                        name: "@typescript-eslint/parser",
                    },
                },
            },
            sourceCode: {
                parserServices,
            },
        } as unknown as Parameters<typeof getTypedRuleServices>[0];

        const services = getTypedRuleServices(context);

        expect(services).toStrictEqual({
            checker,
            parserServices,
        });
    });

    it("throws when parserServices.program is null", () => {
        expect.hasAssertions();

        const parserServices = {
            esTreeNodeToTSNodeMap: new WeakMap<object, object>(),
            program: null,
            tsNodeToESTreeNodeMap: new WeakMap<object, object>(),
        };

        const context = {
            languageOptions: {
                parser: {
                    meta: {
                        name: "@typescript-eslint/parser",
                    },
                },
            },
            sourceCode: {
                parserServices,
            },
        } as unknown as Parameters<typeof getTypedRuleServices>[0];

        expect(() => getTypedRuleServices(context)).toThrow(
            "Typed rule requires parserServices.program"
        );
    });
});
