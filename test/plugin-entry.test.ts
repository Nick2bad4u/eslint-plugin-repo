import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

import { configNames } from "../src/_internal/config-references";
import plugin from "../src/plugin";

const requireFromTestModule = createRequire(import.meta.url);
const packageJson = requireFromTestModule("../package.json") as {
    version: string;
};

function assertHasLanguagesMetadata(
    value: unknown
): asserts value is { readonly languages: readonly string[] } {
    if (
        typeof value === "object" &&
        value !== null &&
        Object.hasOwn(value, "languages") &&
        Array.isArray(Reflect.get(value, "languages"))
    ) {
        return;
    }

    throw new TypeError("Expected rule metadata to declare languages");
}

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

    it("declares JavaScript language support for every rule", () => {
        expect.hasAssertions();

        for (const rule of Object.values(plugin.rules)) {
            assertHasLanguagesMetadata(rule.meta);

            expect(rule.meta.languages).toStrictEqual(["js/*"]);
        }
    });

    it("registers only repo-compliance rule ids in presets", () => {
        expect.hasAssertions();

        const ruleIds: string[] = [];

        for (const configName of configNames) {
            const config = plugin.configs[configName];

            ruleIds.push(...Object.keys(config.rules));
        }

        expect(
            ruleIds.every((ruleId) => ruleId.startsWith("repo-compliance/"))
        ).toBe(true);
    });
});
