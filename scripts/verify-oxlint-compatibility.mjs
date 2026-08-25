import { ESLint } from "eslint";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

import plugin from "../dist/plugin.js";

/**
 * @typedef {Readonly<{
 *     column: number;
 *     line: number;
 *     message: string;
 *     ruleName: string;
 * }>} NormalizedDiagnostic
 */

/**
 * @typedef {Readonly<{
 *     code: string;
 *     labels: readonly Readonly<{
 *         span: Readonly<{ column: number; line: number }>;
 *     }>[];
 *     message: string;
 * }>} OxlintDiagnostic
 */

/** @typedef {Readonly<{ diagnostics: OxlintDiagnostic[] }>} OxlintOutput */

/**
 * @typedef {Readonly<{
 *     diagnosticsMatch: boolean;
 *     eslintDiagnostics: NormalizedDiagnostic[];
 *     oxlintDiagnostics: NormalizedDiagnostic[];
 *     scenarioName: string;
 * }>} ScenarioEvidence
 */

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const oxlintCliPath = path.join(
    repositoryRoot,
    "node_modules",
    "oxlint",
    "bin",
    "oxlint"
);
const suffix = `20260825-${process.pid}`;
const configPath = path.join(
    repositoryRoot,
    `.oxlint-compat-probe-repo-${suffix}.json`
);
const scenariosRoot = path.join(
    repositoryRoot,
    `.oxlint-compat-scenarios-repo-${suffix}`
);
const pluginNamespace = "repo-compliance";
const ruleNames = Object.keys(plugin.rules).toSorted();

/**
 * @param {string} ruleName
 */
const getRuleMeta = (ruleName) => {
    const rule = plugin.rules[ruleName];

    if (rule === undefined) {
        throw new Error(
            `Exported rule ${ruleName} is missing from the plugin.`
        );
    }

    if (rule.meta === undefined) {
        throw new Error(`Exported rule ${ruleName} has no metadata.`);
    }

    return rule.meta;
};

const allPresetRuleNames = Object.keys(plugin.configs.all.rules ?? {})
    .map((ruleId) => ruleId.replace(`${pluginNamespace}/`, ""))
    .toSorted();
const fixableRuleNames = ruleNames.filter(
    (ruleName) => getRuleMeta(ruleName).fixable !== undefined
);
const optionedRuleNames = ruleNames.filter((ruleName) => {
    const schema = getRuleMeta(ruleName).schema;

    return Array.isArray(schema) ? schema.length > 0 : schema !== false;
});
const suggestionRuleNames = ruleNames.filter(
    (ruleName) => getRuleMeta(ruleName).hasSuggestions === true
);
const typeAwareRuleNames = ruleNames.filter((ruleName) => {
    const docs = getRuleMeta(ruleName).docs;

    return (
        docs !== undefined && Reflect.get(docs, "requiresTypeChecking") === true
    );
});
/** @type {import("eslint").Linter.RulesRecord} */
const rules = Object.fromEntries(
    ruleNames.map((ruleName) => [`${pluginNamespace}/${ruleName}`, "error"])
);

const scenarioFiles = {
    empty: {},
    invalid: {
        ".do/app.yaml": "",
        ".dockerignore": "",
        ".forgejo/workflows/ci.yml": "",
        ".gitattributes": "",
        ".github/CODEOWNERS": "",
        ".github/ISSUE_TEMPLATE/bug.md": "---\n---\n",
        ".github/PULL_REQUEST_TEMPLATE.md": "",
        ".github/dependabot.yml": "",
        ".github/workflows/ci.yml": "",
        ".gitignore": "",
        ".gitlab-ci.yml": "",
        ".gitlab/issue_templates/bug.md": "",
        ".gitlab/merge_request_templates/default.md": "",
        ".node-version": "",
        ".nvmrc": "",
        ".releaserc.json": "{}\n",
        "CHANGELOG.md": "",
        CODEOWNERS: "",
        "CODE_OF_CONDUCT.md": "",
        "CONTRIBUTING.md": "",
        Dockerfile: "",
        LICENSE: "",
        "README.md": "",
        "SECURITY.md": "",
        "SUPPORT.md": "",
        "amplify.yml": "",
        "azure-pipelines.yml": "",
        "bitbucket-pipelines.yml": "",
        "cloudbuild.yaml": "",
        "netlify.toml": "",
        "vercel.json": "{}\n",
    },
    malformedVercel: {
        "vercel.json": "{\n",
    },
    invalidValues: {
        ".do/app.yaml": "name: App\nregion: NYC\n",
        ".forgejo/workflows/ci.yml": [
            "name: CI",
            "on: push",
            "permissions: write-all",
            "jobs:",
            "  build:",
            "    runs-on: ubuntu-latest",
            "    steps:",
            "      - uses: actions/checkout@main",
        ].join("\n"),
        ".github/CODEOWNERS": "src/**\n",
        ".github/ISSUE_TEMPLATE/bug.yml": "name: Bug\n",
        ".github/PULL_REQUEST_TEMPLATE.md": "Review this change.\n",
        ".github/dependabot.yml": [
            "version: 2",
            "updates:",
            "  - package-ecosystem: npm",
            '    directory: "/"',
            "    schedule:",
            "      interval: hourly",
        ].join("\n"),
        ".gitlab-ci.yml": [
            "cache:",
            "  paths:",
            "    - .cache",
            "build:",
            "  script: echo build",
            "  only:",
            "    - main",
        ].join("\n"),
        Dockerfile: "RUN echo first\nFROM node\n",
        LICENSE: "Custom License\n",
        "README.md": "# Project\n",
        "SECURITY.md": "Private policy.\n",
        "amplify.yml": "artifacts:\n  baseDirectory: /absolute/dist\n",
        "bitbucket-pipelines.yml": [
            "image: node",
            "options:",
            "pull-requests:",
            "pipelines:",
            "  default:",
            "    - step:",
            "        script:",
            "          - echo build",
        ].join("\n"),
        "cloudbuild.yaml": "timeout: invalid\nsteps:\n  - name: node\n",
        "netlify.toml": '[build]\ncommand = ""\npublish = "/dist/"\n',
    },
    googleTimeoutNegative: {
        "cloudbuild.yaml": "timeout: -1s\nsteps:\n  - name: node\n",
    },
    googleTimeoutLarge: {
        "cloudbuild.yaml": "timeout: 999999s\nsteps:\n  - name: node\n",
    },
};

/**
 * @param {import("eslint").Linter.LintMessage} message
 *
 * @returns {NormalizedDiagnostic}
 */
const normalizeEslintMessage = (message) => ({
    column: message.column,
    line: message.line,
    message: message.message,
    ruleName: message.ruleId?.replace(`${pluginNamespace}/`, "") ?? "<parser>",
});

/**
 * @param {OxlintDiagnostic} diagnostic
 *
 * @returns {NormalizedDiagnostic}
 */
const normalizeOxlintDiagnostic = (diagnostic) => {
    const codeMatch = new RegExp(
        `^${pluginNamespace}\\((?<ruleName>.+)\\)$`,
        "v"
    ).exec(diagnostic.code);
    const firstLabel = diagnostic.labels.at(0);

    return {
        column: firstLabel?.span.column ?? 0,
        line: firstLabel?.span.line ?? 0,
        message: diagnostic.message,
        ruleName: codeMatch?.groups?.["ruleName"] ?? diagnostic.code,
    };
};

/**
 * @param {readonly NormalizedDiagnostic[]} left
 * @param {readonly NormalizedDiagnostic[]} right
 */
const compareDiagnostics = (left, right) =>
    JSON.stringify(
        left.toSorted((a, b) =>
            `${a.ruleName}\0${a.message}\0${a.line}\0${a.column}`.localeCompare(
                `${b.ruleName}\0${b.message}\0${b.line}\0${b.column}`
            )
        )
    ) ===
    JSON.stringify(
        right.toSorted((a, b) =>
            `${a.ruleName}\0${a.message}\0${a.line}\0${a.column}`.localeCompare(
                `${b.ruleName}\0${b.message}\0${b.line}\0${b.column}`
            )
        )
    );

/**
 * @param {string} targetPath
 *
 * @returns {NormalizedDiagnostic[]}
 */
const runOxlint = (targetPath) => {
    const result = spawnSync(
        process.execPath,
        [
            oxlintCliPath,
            "--config",
            configPath,
            "--format",
            "json",
            targetPath,
        ],
        {
            cwd: repositoryRoot,
            encoding: "utf8",
            shell: false,
        }
    );

    if (result.error) {
        throw result.error;
    }

    if (result.status !== 1) {
        throw new Error(
            `Expected Oxlint to report diagnostics, got exit ${String(result.status)}.\n${result.stdout}\n${result.stderr}`
        );
    }

    const output = /** @type {OxlintOutput} */ (JSON.parse(result.stdout));

    return output.diagnostics.map(normalizeOxlintDiagnostic);
};

const main = async () => {
    const oxlintVersionResult = spawnSync(
        process.execPath,
        [oxlintCliPath, "--version"],
        {
            cwd: repositoryRoot,
            encoding: "utf8",
            shell: false,
        }
    );

    if (oxlintVersionResult.status !== 0) {
        throw new Error(
            `Unable to read the pinned Oxlint version.\n${oxlintVersionResult.stdout}\n${oxlintVersionResult.stderr}`
        );
    }

    const eslint = new ESLint({
        cwd: repositoryRoot,
        overrideConfig: [
            {
                files: ["**/*.{js,cjs,mjs,ts,cts,mts}"],
                plugins: { [pluginNamespace]: plugin },
                rules,
            },
        ],
        overrideConfigFile: true,
    });
    /** @type {ScenarioEvidence[]} */
    const evidence = [];

    await writeFile(
        configPath,
        `${JSON.stringify(
            {
                jsPlugins: [
                    {
                        name: pluginNamespace,
                        specifier: "./dist/plugin.js",
                    },
                ],
                overrides: [
                    {
                        files: ["**/*.{js,cjs,mjs,ts,cts,mts}"],
                        rules,
                    },
                ],
            },
            undefined,
            2
        )}\n`
    );

    for (const [scenarioName, files] of Object.entries(scenarioFiles)) {
        const scenarioRoot = path.join(scenariosRoot, scenarioName);
        const targetPath = path.join(scenarioRoot, "eslint.config.mjs");
        await mkdir(scenarioRoot, { recursive: true });
        await writeFile(targetPath, "export default [];\n");

        for (const [relativePath, contents] of Object.entries(files)) {
            const filePath = path.join(scenarioRoot, relativePath);
            await mkdir(path.dirname(filePath), { recursive: true });
            await writeFile(filePath, contents);
        }

        const [eslintResult] = await eslint.lintText("export default [];\n", {
            filePath: targetPath,
            warnIgnored: false,
        });

        if (eslintResult === undefined) {
            throw new Error(`ESLint returned no result for ${targetPath}.`);
        }

        const eslintDiagnostics = eslintResult.messages.map(
            normalizeEslintMessage
        );
        const oxlintDiagnostics = runOxlint(targetPath);
        evidence.push({
            diagnosticsMatch: compareDiagnostics(
                eslintDiagnostics,
                oxlintDiagnostics
            ),
            eslintDiagnostics,
            oxlintDiagnostics,
            scenarioName,
        });
    }

    const eslintRules = new Set(
        evidence.flatMap((scenario) =>
            scenario.eslintDiagnostics.map((diagnostic) => diagnostic.ruleName)
        )
    );
    const oxlintRules = new Set(
        evidence.flatMap((scenario) =>
            scenario.oxlintDiagnostics.map((diagnostic) => diagnostic.ruleName)
        )
    );
    const summary = {
        allPresetCoversEveryRule:
            JSON.stringify(allPresetRuleNames) === JSON.stringify(ruleNames),
        allScenarioDiagnosticsMatch: evidence.every(
            (scenario) => scenario.diagnosticsMatch
        ),
        eslintDiagnosticCounts: Object.fromEntries(
            evidence.map((scenario) => [
                scenario.scenarioName,
                scenario.eslintDiagnostics.length,
            ])
        ),
        missingFromEslint: ruleNames.filter(
            (ruleName) => !eslintRules.has(ruleName)
        ),
        missingFromOxlint: ruleNames.filter(
            (ruleName) => !oxlintRules.has(ruleName)
        ),
        fixableRuleNames,
        nodeVersion: process.version,
        optionedRuleNames,
        oxlintVersion: oxlintVersionResult.stdout.trim(),
        oxlintDiagnosticCounts: Object.fromEntries(
            evidence.map((scenario) => [
                scenario.scenarioName,
                scenario.oxlintDiagnostics.length,
            ])
        ),
        pluginVersion: plugin.meta.version,
        ruleCount: ruleNames.length,
        scenarioMismatches: evidence
            .filter((scenario) => !scenario.diagnosticsMatch)
            .map((scenario) => scenario.scenarioName),
        suggestionRuleNames,
        typeAwareRuleNames,
    };

    console.log(JSON.stringify(summary, undefined, 2));

    if (
        !summary.allScenarioDiagnosticsMatch ||
        !summary.allPresetCoversEveryRule ||
        summary.missingFromEslint.length > 0 ||
        summary.missingFromOxlint.length > 0 ||
        summary.fixableRuleNames.length > 0 ||
        summary.optionedRuleNames.length > 0 ||
        summary.suggestionRuleNames.length > 0 ||
        summary.typeAwareRuleNames.length > 0
    ) {
        throw new Error(
            "Oxlint compatibility verification did not cover the complete exported rule contract."
        );
    }
};

try {
    await main();
} finally {
    await Promise.all([
        rm(configPath, { force: true }),
        rm(scenariosRoot, { force: true, recursive: true }),
    ]);
}
