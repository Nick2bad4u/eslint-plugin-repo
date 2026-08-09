import {
    createVitestConfig,
    type VitestConfig,
} from "vitest-config-nick2bad4u";
import { defineConfig } from "vitest/config";

/**
 * Resource-bounded Vitest policy used exclusively by Stryker mutation runs.
 */
const strykerVitestConfig: VitestConfig = createVitestConfig({
    test: {
        css: false,
        env: {
            NODE_ENV: "test",
        },
        environment: "node",
        exclude: ["test/fixtures/**", "docs/**"],
        fileParallelism: false,
        globals: true,
        hookTimeout: 15_000,
        include: ["test/**/*.{test,spec}.ts"],
        maxWorkers: 1,
        name: {
            color: "yellow",
            label: "Stryker",
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
        teardownTimeout: 15_000,
        testTimeout: 15_000,
    },
});

const validatedStrykerVitestConfig: VitestConfig =
    defineConfig(strykerVitestConfig);

export default validatedStrykerVitestConfig;
