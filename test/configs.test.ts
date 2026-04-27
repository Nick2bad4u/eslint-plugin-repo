import { describe, expect, it } from "vitest";

import {
    configMetadataByName,
    configNames,
} from "../src/_internal/config-references";
import plugin from "../src/plugin";

const hostingProviderRuleIdPrefixes = [
    "repo-compliance/require-aws-amplify-",
    "repo-compliance/require-azure-pipelines-",
    "repo-compliance/require-bitbucket-pipelines-",
    "repo-compliance/require-dependabot-",
    "repo-compliance/require-digitalocean-app-spec-",
    "repo-compliance/require-dockerfile",
    "repo-compliance/require-dockerignore-file",
    "repo-compliance/require-forgejo-actions-",
    "repo-compliance/require-github-actions-",
    "repo-compliance/require-github-issue-template-",
    "repo-compliance/require-gitlab-ci-",
    "repo-compliance/require-gitlab-issue-template-",
    "repo-compliance/require-gitlab-merge-request-template-",
    "repo-compliance/require-google-cloud-build-",
    "repo-compliance/require-netlify-",
    "repo-compliance/require-secret-scanning-config",
    "repo-compliance/require-vercel-",
] as const;

const providerPresetNames = [
    "aws",
    "azure",
    "bitbucket",
    "codeberg",
    "digitalOcean",
    "docker",
    "github",
    "gitlab",
    "googleCloud",
    "netlify",
    "vercel",
] as const;

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

    it("keeps strict provider-agnostic", () => {
        expect.hasAssertions();

        const strictRuleIds = Object.keys(plugin.configs?.strict?.rules ?? {});

        for (const ruleId of strictRuleIds) {
            expect(
                hostingProviderRuleIdPrefixes.some((prefix) =>
                    ruleId.startsWith(prefix)
                )
            ).toBeFalsy();
        }
    });

    it("keeps provider presets independent from strict baseline", () => {
        expect.hasAssertions();

        const strictRules = plugin.configs?.strict?.rules ?? {};
        const strictRuleIds = Object.keys(strictRules);

        expect(strictRuleIds.length).toBeGreaterThan(0);

        for (const presetName of providerPresetNames) {
            const providerRules = plugin.configs?.[presetName]?.rules ?? {};
            const missingStrictRuleIds = strictRuleIds.filter(
                (strictRuleId) => !(strictRuleId in providerRules)
            );

            expect(missingStrictRuleIds.length).toBeGreaterThan(0);
        }
    });
});
