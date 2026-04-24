import tsParser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";
import { afterAll, describe, it } from "vitest";

import plugin from "../../src/plugin";

type PluginRuleModule = Parameters<RuleTester["run"]>[1];

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it;

export const createRuleTester = (): RuleTester =>
    new RuleTester({
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
    });

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const isRuleModule = (value: unknown): value is PluginRuleModule => {
    if (!isRecord(value)) {
        return false;
    }

    const maybeCreate = (value as { create?: unknown }).create;

    return typeof maybeCreate === "function";
};

export const getPluginRule = (ruleId: string): PluginRuleModule => {
    const { rules } = plugin;
    const dynamicRules = rules as Record<string, unknown>;

    if (!Object.hasOwn(dynamicRules, ruleId)) {
        throw new Error(
            `Rule '${ruleId}' is not registered in repoCompliancePlugin`
        );
    }

    const rule = dynamicRules[ruleId];

    if (!isRuleModule(rule)) {
        throw new Error(`Rule '${ruleId}' is not a valid ESLint rule module`);
    }

    return rule;
};
