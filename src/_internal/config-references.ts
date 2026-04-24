/* eslint-disable typedoc/require-exported-doc-comment -- config reference table exports are self-descriptive constants and types. */
export const configNames = [
    "all",
    "recommended",
    "strict",
    "github",
    "gitlab",
    "bitbucket",
    "codeberg",
] as const;

export type ConfigMetadata = Readonly<{
    icon: string;
    presetName: `repo-compliance:${ConfigName}`;
    readmeOrder: number;
    requiresTypeChecking: boolean;
}>;

export type ConfigName = (typeof configNames)[number];

export const configMetadataByName: Readonly<
    Record<ConfigName, ConfigMetadata>
> = {
    all: {
        icon: "🧩",
        presetName: "repo-compliance:all",
        readmeOrder: 7,
        requiresTypeChecking: false,
    },
    bitbucket: {
        icon: "🪣",
        presetName: "repo-compliance:bitbucket",
        readmeOrder: 6,
        requiresTypeChecking: false,
    },
    codeberg: {
        icon: "🗻",
        presetName: "repo-compliance:codeberg",
        readmeOrder: 5,
        requiresTypeChecking: false,
    },
    github: {
        icon: "🐙",
        presetName: "repo-compliance:github",
        readmeOrder: 3,
        requiresTypeChecking: false,
    },
    gitlab: {
        icon: "🦊",
        presetName: "repo-compliance:gitlab",
        readmeOrder: 4,
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

export const configNamesByReadmeOrder: readonly ConfigName[] = [
    "recommended",
    "strict",
    "github",
    "gitlab",
    "codeberg",
    "bitbucket",
    "all",
];

export const configReferenceToName: Readonly<
    Record<`repo-compliance.configs.${ConfigName}`, ConfigName>
> = {
    "repo-compliance.configs.all": "all",
    "repo-compliance.configs.bitbucket": "bitbucket",
    "repo-compliance.configs.codeberg": "codeberg",
    "repo-compliance.configs.github": "github",
    "repo-compliance.configs.gitlab": "gitlab",
    "repo-compliance.configs.recommended": "recommended",
    "repo-compliance.configs.strict": "strict",
};

export type ConfigReference = keyof typeof configReferenceToName;

export const isConfigReference = (value: unknown): value is ConfigReference =>
    typeof value === "string" && Object.hasOwn(configReferenceToName, value);

/* eslint-enable typedoc/require-exported-doc-comment */
