import { createStrykerConfig } from "stryker-config-nick2bad4u";

/** Repository-specific mutation inputs layered onto the shared Stryker policy. */
const config = createStrykerConfig({
    coverageAnalysis: "perTest",
    incrementalFile: ".cache/stryker/incremental-full.json",
    mutate: [
        "src/**/*.ts",
        "!src/**/*.d.ts",
        "!src/**/*.{test,spec}.ts",
    ],
    vitest: {
        configFile: "./vitest.stryker.config.ts",
        related: false,
    },
});

export default config;
