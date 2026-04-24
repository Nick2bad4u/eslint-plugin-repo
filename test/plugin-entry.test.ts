import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

import { configNames } from "../src/_internal/config-references";
import plugin from "../src/plugin";

const requireFromTestModule = createRequire(import.meta.url);
const packageJson = requireFromTestModule("../package.json") as {
    version: string;
};

describe("plugin entry module", () => {
    it("exports plugin metadata with expected namespace", () => {
        expect.hasAssertions();

        expect(plugin.meta).toStrictEqual(
            expect.objectContaining({
                name: "eslint-plugin-repo",
                namespace: "repo-compliance",
                version: packageJson.version,
            })
        );
    });

    it("exposes all declared preset keys", () => {
        expect.hasAssertions();

        expect(new Set(Object.keys(plugin.configs ?? {}))).toStrictEqual(
            new Set(configNames)
        );
    });

    it("registers only repo-compliance rule ids in presets", () => {
        expect.hasAssertions();

        const ruleIds: string[] = [];

        for (const config of Object.values(plugin.configs ?? {})) {
            const isConfigObject =
                typeof config !== "object" ||
                config === null ||
                Array.isArray(config);

            if (!isConfigObject) {
                const maybeRules = (config as { rules?: unknown }).rules;

                const isRuleRecord =
                    typeof maybeRules === "object" &&
                    maybeRules !== null &&
                    !Array.isArray(maybeRules);

                if (isRuleRecord) {
                    ruleIds.push(...Object.keys(maybeRules));
                }
            }
        }

        expect(
            ruleIds.every((ruleId) => ruleId.startsWith("repo-compliance/"))
        ).toBeTruthy();
    });
});
