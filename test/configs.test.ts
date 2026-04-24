import { describe, expect, it } from "vitest";

import {
    configMetadataByName,
    configNames,
} from "../src/_internal/config-references";
import plugin from "../src/plugin";

describe("repo compliance preset contracts", () => {
    it("keeps metadata and runtime presets in sync", () => {
        expect.hasAssertions();

        const runtimeConfigNames = Object.keys(plugin.configs ?? {});

        expect(new Set(runtimeConfigNames)).toStrictEqual(new Set(configNames));

        for (const configName of configNames) {
            expect(plugin.configs).toHaveProperty(configName);
            expect(configMetadataByName).toHaveProperty(configName);
        }
    });

    it("enables all registered rules in all preset", () => {
        expect.hasAssertions();

        const allPresetRules = plugin.configs?.all?.rules ?? {};

        for (const ruleName of Object.keys(plugin.rules ?? {})) {
            expect(allPresetRules).toHaveProperty(
                `repo-compliance/${ruleName}`,
                "error"
            );
        }
    });

    it("keeps recommended subset inside strict", () => {
        expect.hasAssertions();

        const recommendedRules = plugin.configs?.recommended?.rules ?? {};
        const strictRules = plugin.configs?.strict?.rules ?? {};

        for (const recommendedRuleId of Object.keys(recommendedRules)) {
            expect(strictRules).toHaveProperty(recommendedRuleId, "error");
        }
    });
});
