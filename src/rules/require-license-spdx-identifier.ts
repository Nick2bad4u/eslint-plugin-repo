import { existsSync } from "node:fs";
import * as path from "node:path";
import { setHas, stringSplit } from "ts-extras";

import { providerRuleTriggerFileNames } from "../_internal/config-file-scanner.js";
import { readTextFileIfExists } from "../_internal/repository-text-files.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

/**
 * A non-exhaustive list of common SPDX identifiers that appear in the first few
 * lines of LICENSE files. Matching is case-insensitive.
 */
const spdxIdentifiers = [
    "MIT",
    "Apache-2.0",
    "GPL-2.0",
    "GPL-2.0-only",
    "GPL-2.0-or-later",
    "GPL-3.0",
    "GPL-3.0-only",
    "GPL-3.0-or-later",
    "LGPL-2.0",
    "LGPL-2.0-only",
    "LGPL-2.0-or-later",
    "LGPL-2.1",
    "LGPL-2.1-only",
    "LGPL-2.1-or-later",
    "LGPL-3.0",
    "LGPL-3.0-only",
    "LGPL-3.0-or-later",
    "MPL-2.0",
    "AGPL-3.0",
    "AGPL-3.0-only",
    "AGPL-3.0-or-later",
    "BSD-2-Clause",
    "BSD-3-Clause",
    "ISC",
    "CC0-1.0",
    "CC-BY-4.0",
    "CC-BY-SA-4.0",
    "Unlicense",
    "WTFPL",
    "0BSD",
    "Artistic-2.0",
    "EUPL-1.2",
    "CDDL-1.0",
    "EPL-1.0",
    "EPL-2.0",
    "EUPL-1.1",
    "OSL-3.0",
    "SSPL-1.0",
    "BUSL-1.1",
    "PolyForm-Noncommercial-1.0.0",
    "PolyForm-Small-Business-1.0.0",
];

const SPDX_EXPRESSION_PATTERN = /\bspdx-license-identifier:\s*[\w+\-.]+\b/iu;

const lowerCasedIdentifiers = new Set(
    spdxIdentifiers.map((id) => id.toLowerCase())
);

const getLicensePath = (rootDirectoryPath: string): null | string => {
    for (const candidate of [
        "LICENSE",
        "LICENSE.md",
        "LICENSE.txt",
        "LICENCE",
        "LICENCE.md",
        "LICENCE.txt",
    ]) {
        const absolutePath = path.join(rootDirectoryPath, candidate);

        if (existsSync(absolutePath)) {
            return absolutePath;
        }
    }

    return null;
};

const hasKnownSpdxIdentifier = (source: string): boolean => {
    if (SPDX_EXPRESSION_PATTERN.test(source)) {
        return true;
    }

    const lines = stringSplit(source.replaceAll(/\r\n?/gv, "\n"), "\n");

    for (const line of lines.slice(0, 5)) {
        const lower = line.trim().toLowerCase();

        for (const id of lowerCasedIdentifiers) {
            if (lower.includes(id)) {
                return true;
            }
        }
    }

    return false;
};

/** Rule enforcing an SPDX licence identifier in the repository's LICENSE file. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const lintedFilePath = context.physicalFilename;
        const lintedFileName = path.basename(lintedFilePath);

        if (!setHas(providerRuleTriggerFileNames, lintedFileName)) {
            return {};
        }

        const rootDirectoryPath = path.dirname(lintedFilePath);
        const licensePath = getLicensePath(rootDirectoryPath);

        if (licensePath === null) {
            return {};
        }

        return {
            Program(node): void {
                const licenseSource = readTextFileIfExists(licensePath);

                if (
                    licenseSource === null ||
                    licenseSource.trim().length === 0 ||
                    hasKnownSpdxIdentifier(licenseSource)
                ) {
                    return;
                }

                context.report({
                    data: {
                        licensePath: path.relative(
                            rootDirectoryPath,
                            licensePath
                        ),
                    },
                    messageId: "missingSpdxIdentifier",
                    node,
                });
            },
        };
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            description:
                "require a recognised SPDX licence identifier in the repository's LICENSE file",
            frozen: false,
            recommended: true,
            repoConfigs: [
                "repoPlugin.configs.recommended",
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            ruleId: "",
            ruleNumber: 0,
            url: createRuleDocsUrl("require-license-spdx-identifier"),
        },
        messages: {
            missingSpdxIdentifier:
                "{{ licensePath }} does not contain a recognised SPDX licence identifier. Add an SPDX-License-Identifier tag or ensure the licence text matches a known open-source licence name (e.g. MIT, Apache-2.0).",
        },
        schema: [],
        type: "suggestion",
    },
    name: "require-license-spdx-identifier",
});

export default rule;
