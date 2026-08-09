import pc from "picocolors";
import {
    createTypecheckConfig,
    createVitestConfig,
    type VitestConfig,
} from "vitest-config-nick2bad4u";
import { defaultExclude, defineConfig } from "vitest/config";

const enabledValues: ReadonlySet<string> = new Set([
    "1",
    "on",
    "true",
    "yes",
]);

const isEnabled = (value: string | undefined): boolean =>
    typeof value === "string" && enabledValues.has(value.toLowerCase());

/** Vitest configuration for eslint-plugin-repo. */
const vitestConfig: VitestConfig = createVitestConfig({
    test: {
        bail: 200,
        benchmark: {
            exclude: [
                "**/dist*/**",
                "**/html/**",
                ...defaultExclude,
            ],
            include: ["benchmarks/**/*.bench.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
            includeSamples: true,
            includeSource: ["src/**/*.ts"],
            outputJson: "./coverage/bench-results.json",
            reporters: ["default", "verbose"],
        },
        coverage: {
            exclude: [
                "**/*.bench.{js,mjs,cjs,ts,mts,cts,jsx,tsx,css}",
                "**/*.config.*",
                "**/*.{css,less,sass,scss}",
                "**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx,css}",
                "**/assets/**",
                "**/config/**",
                "**/docs/**",
                "**/html/**",
                "**/index.{ts,tsx}",
                "**/playwright/**",
                "**/types.{ts,tsx}",
                "**/types/**",
                ".storybook/**",
                "benchmarks/**",
                "electron/**",
                "out/**",
                "release/**",
                "report/**",
                "reports/**",
                "scripts/**",
                "shared/**",
                "src/**/baseTypes.ts",
                "src/test/**",
                "storybook-static/**",
                "storybook/**",
                "stryker_prompts_by_mutator/**",
                "temp/**",
            ],
            include: ["plugin.mjs", "src/**/*.ts"],
            provider: "v8",
            thresholds: {
                // Dynamic configs cannot be safely rewritten by Magicast.
                autoUpdate: false,
                branches: 80,
                functions: 80,
                lines: 80,
                statements: 80,
            },
        },
        css: false,
        deps: {
            optimizer: {
                web: { enabled: false },
            },
        },
        diff: {
            aIndicator: pc.magenta(pc.bold("--")),
            bIndicator: pc.green(pc.bold("++")),
            expand: true,
            maxDepth: 20,
            omitAnnotationLines: true,
            printBasicPrototype: false,
            truncateAnnotation: pc.yellow(
                pc.bold("... Diff output truncated for readability")
            ),
            truncateThreshold: 250,
        },
        env: {
            NODE_ENV: "test",
            PACKAGE_VERSION: process.env["PACKAGE_VERSION"] ?? "unknown",
        },
        environment: "node",
        exclude: ["**/docs/**"],
        fakeTimers: {
            advanceTimeDelta: 20,
            loopLimit: 10_000,
            now: Date.now(),
            shouldAdvanceTime: false,
            shouldClearNativeTimers: true,
        },
        globals: false,
        hookTimeout: 10_000,
        include: ["test/**/*.{test,spec}.{ts,tsx,js,mjs,cjs,mts,cts}"],
        includeTaskLocation: true,
        logHeapUsage: true,
        name: {
            color: "cyan",
            label: "Test",
        },
        outputFile: {
            json: "./coverage/test-results.json",
        },
        pool: "threads",
        printConsoleTrace: false,
        restoreMocks: true,
        sequence: {
            concurrent: false,
            groupOrder: 0,
            setupFiles: "parallel",
        },
        setupFiles: ["./test/_internal/vitest-setup.ts"],
        slowTestThreshold: 300,
        teardownTimeout: 10_000,
        testTimeout: 15_000,
        typecheck: createTypecheckConfig("./tsconfig.vitest-typecheck.json", {
            enabled: isEnabled(process.env["VITEST_TYPECHECK"] ?? "true"),
            exclude: ["**/html/**"],
            include: [
                "**/*.{test,spec}-d.{ts,tsx,mts,cts}",
                "**/*.{test,spec}.{ts,tsx,mts,cts}",
            ],
        }),
    },
});

const validatedVitestConfig: VitestConfig = defineConfig(vitestConfig);

export default validatedVitestConfig;
