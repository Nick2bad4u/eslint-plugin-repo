import type { ESLint, Linter } from "eslint";

import typeScriptParser from "@typescript-eslint/parser";
import { isDefined, isEmpty, objectEntries, safeCastTo } from "ts-extras";

import packageJson from "../package.json" with { type: "json" };
import {
    configMetadataByName,
    configNames,
    type ConfigName as InternalConfigName,
} from "./_internal/config-references.js";
import {
    deriveRuleDocsMetadataByName,
    deriveRulePresetMembershipByRuleName,
    deriveTypeCheckedRuleNameSet,
    type RuleDocsMetadataByName,
    type RuleNamePattern,
} from "./_internal/rule-docs-metadata.js";
import { repoComplianceRules } from "./_internal/rules-registry.js";

const ERROR_SEVERITY = "error" as const;
const DEFAULT_PRESET_FILES = ["**/*.{js,cjs,mjs,ts,cts,mts}"] as const;

/**
 * Public preset names exposed by this plugin.
 */
export type RepoComplianceConfigName = InternalConfigName;

/**
 * Public flat-config preset shape exposed by this plugin.
 */
export type RepoCompliancePresetConfig = Linter.Config & {
    rules: NonNullable<Linter.Config["rules"]>;
};

type FlatConfig = Linter.Config;
type FlatLanguageOptions = NonNullable<FlatConfig["languageOptions"]>;
type FlatParserOptions = NonNullable<FlatLanguageOptions["parserOptions"]>;
type RepoComplianceConfigsContract = Record<
    RepoComplianceConfigName,
    RepoCompliancePresetConfig
>;

type RepoCompliancePluginContract = ESLint.Plugin & {
    configs: RepoComplianceConfigsContract;
    meta: {
        name: string;
        namespace: string;
        version: string;
    };
    rules: NonNullable<ESLint.Plugin["rules"]>;
};

type RulesConfig = RepoCompliancePresetConfig["rules"];

const getPackageVersion = (pkg: unknown): string => {
    if (typeof pkg !== "object" || pkg === null) {
        return "0.0.0";
    }

    const version = Reflect.get(pkg, "version");

    return typeof version === "string" ? version : "0.0.0";
};

const defaultParserOptions = {
    ecmaVersion: "latest",
    sourceType: "module",
} satisfies FlatParserOptions;

const ruleDocsMetadataByRuleName: RuleDocsMetadataByName =
    deriveRuleDocsMetadataByName(repoComplianceRules);
const rulePresetMembership = deriveRulePresetMembershipByRuleName(
    ruleDocsMetadataByRuleName
);
const typeCheckedRuleNames: ReadonlySet<RuleNamePattern> =
    deriveTypeCheckedRuleNameSet(ruleDocsMetadataByRuleName);

/**
 * Fully qualified rule identifier.
 */
export type RepoComplianceRuleId = `repo-compliance/${RepoComplianceRuleName}`;
/**
 * Public rule-name union.
 */
export type RepoComplianceRuleName = keyof typeof repoComplianceRules;

const ruleEntries = safeCastTo<readonly (readonly [
    RepoComplianceRuleName,
    (typeof repoComplianceRules)[RepoComplianceRuleName],
])[]>(objectEntries(repoComplianceRules));

const createEmptyPresetRuleMap = (): Record<
    RepoComplianceConfigName,
    RepoComplianceRuleName[]
> => {
    const map = {} as Record<
        RepoComplianceConfigName,
        RepoComplianceRuleName[]
    >;

    for (const configName of configNames) {
        map[configName] = [];
    }

    return map;
};

const derivePresetRuleNamesByConfig = (): Readonly<
    Record<RepoComplianceConfigName, readonly RepoComplianceRuleName[]>
> => {
    const presetRuleMap = createEmptyPresetRuleMap();

    for (const [ruleName] of ruleEntries) {
        const configMembership = rulePresetMembership[ruleName];

        if (!isDefined(configMembership) || isEmpty(configMembership)) {
            throw new TypeError(
                `Rule '${ruleName}' is missing preset membership metadata.`
            );
        }

        for (const configName of configMembership) {
            presetRuleMap[configName].push(ruleName);
        }
    }

    return {
        all: [...new Set(presetRuleMap.all)],
        bitbucket: [...new Set(presetRuleMap.bitbucket)],
        codeberg: [...new Set(presetRuleMap.codeberg)],
        github: [...new Set(presetRuleMap.github)],
        gitlab: [...new Set(presetRuleMap.gitlab)],
        recommended: [...new Set(presetRuleMap.recommended)],
        strict: [...new Set(presetRuleMap.strict)],
    };
};

const errorRulesFor = (
    ruleNames: readonly RepoComplianceRuleName[]
): RulesConfig => {
    const rules: RulesConfig = {};

    for (const ruleName of ruleNames) {
        rules[`repo-compliance/${ruleName}`] = ERROR_SEVERITY;
    }

    return rules;
};

const presetRuleNamesByConfig = derivePresetRuleNamesByConfig();

const buildPresetConfig = (
    pluginRef: Readonly<ESLint.Plugin>,
    configName: RepoComplianceConfigName,
    ruleNames: readonly RepoComplianceRuleName[]
): RepoCompliancePresetConfig => {
    const parserOptions: FlatParserOptions = {
        ...defaultParserOptions,
    };

    return {
        files: [...DEFAULT_PRESET_FILES],
        languageOptions: {
            parser: typeScriptParser,
            parserOptions,
        },
        name: configMetadataByName[configName].presetName,
        plugins: {
            "repo-compliance": pluginRef,
        },
        rules: errorRulesFor(ruleNames),
    };
};

/**
 * Main plugin object with rule registry and generated presets.
 */
const plugin: RepoCompliancePluginContract = {
    configs: {} as RepoComplianceConfigsContract,
    meta: {
        name: "eslint-plugin-repo",
        namespace: "repo-compliance",
        version: getPackageVersion(packageJson),
    },
    processors: {},
    rules: repoComplianceRules as unknown as NonNullable<
        ESLint.Plugin["rules"]
    >,
};

const configs: RepoComplianceConfigsContract = {
    all: buildPresetConfig(plugin, "all", presetRuleNamesByConfig.all),
    bitbucket: buildPresetConfig(
        plugin,
        "bitbucket",
        presetRuleNamesByConfig.bitbucket
    ),
    codeberg: buildPresetConfig(
        plugin,
        "codeberg",
        presetRuleNamesByConfig.codeberg
    ),
    github: buildPresetConfig(plugin, "github", presetRuleNamesByConfig.github),
    gitlab: buildPresetConfig(plugin, "gitlab", presetRuleNamesByConfig.gitlab),
    recommended: buildPresetConfig(
        plugin,
        "recommended",
        presetRuleNamesByConfig.recommended
    ),
    strict: buildPresetConfig(plugin, "strict", presetRuleNamesByConfig.strict),
};

plugin.configs = configs;

/**
 * Rule docs metadata derived from rule definitions.
 */
export const ruleDocsByName: typeof ruleDocsMetadataByRuleName =
    ruleDocsMetadataByRuleName;
/**
 * Set of rule names that require type checking.
 */
export const typeCheckedRules: typeof typeCheckedRuleNames =
    typeCheckedRuleNames;

export default plugin;
