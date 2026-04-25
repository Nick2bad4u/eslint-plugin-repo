import { objectHasOwn } from "ts-extras";

/**
 * Canonical preset names exposed by this plugin.
 */
export const configNames = [
    "ai",
    "all",
    "bitbucket",
    "codeberg",
    "github",
    "gitlab",
    "recommended",
    "strict",
] as const;

/**
 * Metadata describing each preset.
 */
export type ConfigMetadata = Readonly<{
    icon: string;
    presetName: `repo-compliance:${ConfigName}`;
    readmeOrder: number;
    requiresTypeChecking: boolean;
}>;

/**
 * Union of supported preset names.
 */
export type ConfigName = (typeof configNames)[number];

/**
 * Lookup table of preset metadata keyed by preset name.
 */
export const configMetadataByName: Readonly<
    Record<ConfigName, ConfigMetadata>
> = {
    ai: {
        icon: "🤖",
        presetName: "repo-compliance:ai",
        readmeOrder: 8,
        requiresTypeChecking: false,
    },
    all: {
        icon: "🧩",
        presetName: "repo-compliance:all",
        readmeOrder: 9,
        requiresTypeChecking: false,
    },
    bitbucket: {
        icon: "🪣",
        presetName: "repo-compliance:bitbucket",
        readmeOrder: 7,
        requiresTypeChecking: false,
    },
    codeberg: {
        icon: "🗻",
        presetName: "repo-compliance:codeberg",
        readmeOrder: 6,
        requiresTypeChecking: false,
    },
    github: {
        icon: "🐙",
        presetName: "repo-compliance:github",
        readmeOrder: 4,
        requiresTypeChecking: false,
    },
    gitlab: {
        icon: "🦊",
        presetName: "repo-compliance:gitlab",
        readmeOrder: 5,
        requiresTypeChecking: false,
    },
    recommended: {
        icon: "✅",
        presetName: "repo-compliance:recommended",
        readmeOrder: 1,
        requiresTypeChecking: false,
    },
    strict: {
        icon: "🔒",
        presetName: "repo-compliance:strict",
        readmeOrder: 2,
        requiresTypeChecking: false,
    },
};

/**
 * Preset order used when rendering README and docs tables.
 */
export const configNamesByReadmeOrder: readonly ConfigName[] = [
    "recommended",
    "strict",
    "github",
    "gitlab",
    "codeberg",
    "bitbucket",
    "ai",
    "all",
];

/**
 * Mapping from rule metadata preset references to preset names.
 */
export const configReferenceToName: Readonly<
    Record<`repoPlugin.configs.${ConfigName}`, ConfigName>
> = {
    "repoPlugin.configs.ai": "ai",
    "repoPlugin.configs.all": "all",
    "repoPlugin.configs.bitbucket": "bitbucket",
    "repoPlugin.configs.codeberg": "codeberg",
    "repoPlugin.configs.github": "github",
    "repoPlugin.configs.gitlab": "gitlab",
    "repoPlugin.configs.recommended": "recommended",
    "repoPlugin.configs.strict": "strict",
};

/**
 * Union of fully qualified preset-reference keys used in rule metadata.
 */
export type ConfigReference = keyof typeof configReferenceToName;

/**
 * Determines whether a value is a valid preset-reference key.
 */
export const isConfigReference = (value: unknown): value is ConfigReference =>
    typeof value === "string" && objectHasOwn(configReferenceToName, value);
