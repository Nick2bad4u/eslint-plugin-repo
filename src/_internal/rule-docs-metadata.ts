/* eslint-disable typedoc/require-exported-doc-comment -- migration scaffold stage: exported APIs are still being documented. */
import type { TSESLint } from "@typescript-eslint/utils";

import {
    type ConfigName,
    configReferenceToName,
    isConfigReference,
} from "./config-references.js";

export type RuleDocsMetadata = Readonly<{
    configNames: readonly ConfigName[];
    description: string;
    recommended: boolean;
    requiresTypeChecking: boolean;
    ruleId: string;
    ruleNumber: number;
    url: string;
}>;

export type RuleDocsMetadataByName = Readonly<
    Record<RuleNamePattern, RuleDocsMetadata>
>;

export type RuleNamePattern = `require-${string}`;

type RuleDocsContract = Readonly<{
    description: string;
    recommended: boolean;
    repoConfigs: readonly string[] | string;
    requiresTypeChecking: boolean;
    ruleId: string;
    ruleNumber: number;
    url: string;
}>;

type RuleMap = Readonly<
    Record<RuleNamePattern, TSESLint.RuleModule<string, readonly unknown[]>>
>;

const isRuleNamePattern = (value: string): value is RuleNamePattern =>
    value.startsWith("require-");

const getRuleDocsContract = (
    ruleName: string,
    docs: unknown
): RuleDocsContract => {
    if (typeof docs !== "object" || docs === null || Array.isArray(docs)) {
        throw new TypeError(
            `Rule '${ruleName}' must define object-shaped meta.docs.`
        );
    }

    const candidate = docs as Record<string, unknown>;
    const description = candidate["description"];
    const recommended = candidate["recommended"];
    const requiresTypeChecking = candidate["requiresTypeChecking"];
    const ruleId = candidate["ruleId"];
    const ruleNumber = candidate["ruleNumber"];
    const repoConfigs = candidate["repoConfigs"];
    const url = candidate["url"];

    if (typeof description !== "string" || description.length === 0) {
        throw new TypeError(`Rule '${ruleName}' must define docs.description.`);
    }

    if (typeof recommended !== "boolean") {
        throw new TypeError(
            `Rule '${ruleName}' must define boolean docs.recommended.`
        );
    }

    if (typeof requiresTypeChecking !== "boolean") {
        throw new TypeError(
            `Rule '${ruleName}' must define boolean docs.requiresTypeChecking.`
        );
    }

    if (typeof ruleId !== "string" || !ruleId.startsWith("R")) {
        throw new TypeError(
            `Rule '${ruleName}' must define docs.ruleId in R### format.`
        );
    }

    if (
        typeof ruleNumber !== "number" ||
        !Number.isInteger(ruleNumber) ||
        ruleNumber < 1
    ) {
        throw new TypeError(
            `Rule '${ruleName}' must define positive integer docs.ruleNumber.`
        );
    }

    if (typeof url !== "string" || url.length === 0) {
        throw new TypeError(`Rule '${ruleName}' must define docs.url.`);
    }

    if (typeof repoConfigs !== "string" && !Array.isArray(repoConfigs)) {
        throw new TypeError(
            `Rule '${ruleName}' must define docs.repoConfigs as a string or string array.`
        );
    }

    return {
        description,
        recommended,
        repoConfigs,
        requiresTypeChecking,
        ruleId,
        ruleNumber,
        url,
    };
};

const normalizeConfigNames = (
    ruleName: string,
    repoConfigs: RuleDocsContract["repoConfigs"]
): ConfigName[] => {
    const rawReferences =
        typeof repoConfigs === "string" ? [repoConfigs] : repoConfigs;

    const configNames: ConfigName[] = [];

    for (const reference of rawReferences) {
        if (!isConfigReference(reference)) {
            throw new TypeError(
                `Rule '${ruleName}' has invalid docs.repoConfigs reference '${reference}'.`
            );
        }

        const configName = configReferenceToName[reference];
        if (!configNames.includes(configName)) {
            configNames.push(configName);
        }
    }

    if (configNames.length === 0) {
        throw new TypeError(
            `Rule '${ruleName}' must belong to at least one preset.`
        );
    }

    return configNames;
};

export const deriveRuleDocsMetadataByName = (
    rules: RuleMap
): RuleDocsMetadataByName => {
    const metadataByRuleName: Record<RuleNamePattern, RuleDocsMetadata> = {};

    for (const [ruleName, ruleModule] of Object.entries(rules)) {
        if (!isRuleNamePattern(ruleName)) {
            throw new TypeError(`Unexpected rule name '${ruleName}'.`);
        }

        const docs = getRuleDocsContract(ruleName, ruleModule.meta?.docs);

        metadataByRuleName[ruleName] = {
            configNames: normalizeConfigNames(ruleName, docs.repoConfigs),
            description: docs.description,
            recommended: docs.recommended,
            requiresTypeChecking: docs.requiresTypeChecking,
            ruleId: docs.ruleId,
            ruleNumber: docs.ruleNumber,
            url: docs.url,
        };
    }

    return metadataByRuleName;
};

export const deriveRulePresetMembershipByRuleName = (
    metadataByRuleName: RuleDocsMetadataByName
): Readonly<Record<RuleNamePattern, readonly ConfigName[]>> => {
    const membership: Record<RuleNamePattern, readonly ConfigName[]> = {};

    for (const [ruleName, metadata] of Object.entries(metadataByRuleName)) {
        if (!isRuleNamePattern(ruleName)) {
            throw new TypeError(`Unexpected rule name '${ruleName}'.`);
        }

        membership[ruleName] = metadata.configNames;
    }

    return membership;
};

export const deriveTypeCheckedRuleNameSet = (
    metadataByRuleName: RuleDocsMetadataByName
): ReadonlySet<RuleNamePattern> =>
    new Set(
        Object.entries(metadataByRuleName)
            .filter(([, metadata]) => metadata.requiresTypeChecking)
            .map(([ruleName]) => ruleName as RuleNamePattern)
    );
/* eslint-enable typedoc/require-exported-doc-comment */
