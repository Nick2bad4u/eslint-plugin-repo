import { describe, expect, it } from "vitest";

import {
    getIndentationWidth,
    getTomlKeyValue,
    getTopLevelYamlKeyValue,
    hasTomlKey,
    hasTomlTableSection,
    hasTopLevelYamlKey,
    isBlankOrCommentLine,
    providerRuleTriggerFileNames,
    splitConfigLines,
} from "../../src/_internal/config-file-scanner";

describe("config-file-scanner helpers", () => {
    it("exports provider trigger filenames", () => {
        expect.hasAssertions();

        expect(providerRuleTriggerFileNames).toStrictEqual(
            new Set([
                "eslint.config.cjs",
                "eslint.config.js",
                "eslint.config.mjs",
                "eslint.config.ts",
                "package.json",
            ])
        );
    });

    it("normalizes CRLF and splits config lines", () => {
        expect.hasAssertions();

        expect(splitConfigLines("a\r\nb\n\r\nc")).toStrictEqual([
            "a",
            "b",
            "",
            "c",
        ]);
    });

    it("identifies blank/comment lines", () => {
        expect.hasAssertions();

        expect(isBlankOrCommentLine("")).toBeTruthy();
        expect(isBlankOrCommentLine("    ")).toBeTruthy();
        expect(isBlankOrCommentLine("   # comment")).toBeTruthy();
        expect(isBlankOrCommentLine("key: value")).toBeFalsy();
    });

    it("computes indentation width from leading spaces only", () => {
        expect.hasAssertions();

        expect(getIndentationWidth("    key: value")).toBe(4);
        expect(getIndentationWidth("\tkey: value")).toBe(0);
        expect(getIndentationWidth("  \tkey: value")).toBe(2);
    });

    it("reads root-level YAML key values and strips quotes", () => {
        expect.hasAssertions();

        const source = [
            "# top-level comment",
            "  name: nested",
            "name: 'project-alpha'",
            'region: "nyc1"',
        ].join("\n");

        expect(getTopLevelYamlKeyValue(source, "name")).toBe("project-alpha");
        expect(getTopLevelYamlKeyValue(source, "region")).toBe("nyc1");
    });

    it("returns null for missing YAML key and empty string for empty present key", () => {
        expect.hasAssertions();

        const source = [
            "version:",
            "build:",
            "  commands:",
            "    - npm test",
        ].join("\n");

        expect(getTopLevelYamlKeyValue(source, "version")).toBe("");
        expect(getTopLevelYamlKeyValue(source, "missing")).toBeNull();
    });

    it("detects root-level YAML key presence", () => {
        expect.hasAssertions();

        const source = [
            "  version: nested",
            "version:",
            "# version: comment",
        ].join("\n");

        expect(hasTopLevelYamlKey(source, "version")).toBeTruthy();
        expect(hasTopLevelYamlKey(source, "name")).toBeFalsy();
    });

    it("reads TOML key values while avoiding prefix collisions", () => {
        expect.hasAssertions();

        const source = [
            "# build settings",
            'commandExtra = "npm run nope"',
            "command = 'npm run build'",
            'publish = "dist"',
        ].join("\n");

        expect(getTomlKeyValue(source, "command")).toBe("npm run build");
        expect(getTomlKeyValue(source, "publish")).toBe("dist");
        expect(getTomlKeyValue(source, "missing")).toBeNull();
    });

    it("treats empty TOML values as missing", () => {
        expect.hasAssertions();

        const source = ["command =    ", "publish = ''"].join("\n");

        expect(getTomlKeyValue(source, "command")).toBeNull();
        expect(getTomlKeyValue(source, "publish")).toBe("");
        expect(hasTomlKey(source, "command")).toBeFalsy();
        expect(hasTomlKey(source, "publish")).toBeTruthy();
    });

    it("detects TOML table sections", () => {
        expect.hasAssertions();

        const source = [
            "# comment",
            "[build]",
            'command = "npm run build"',
        ].join("\n");

        expect(hasTomlTableSection(source, "build")).toBeTruthy();
        expect(hasTomlTableSection(source, "deploy")).toBeFalsy();
    });
});
