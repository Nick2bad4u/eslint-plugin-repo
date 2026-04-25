import { existsSync, readFileSync } from "node:fs";
import * as path from "node:path";
import { setHas, stringSplit } from "ts-extras";

import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";
import { createTypedRule } from "../_internal/typed-rule.js";

const triggerFileNames = new Set([
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.ts",
    "package.json",
]);

const SECURITY_PATHS = [
    "SECURITY.md",
    "SECURITY.txt",
    ".github/SECURITY.md",
];

/**
 * Keywords that appear in headings or lines commonly used for contact info
 * sections in security policy files.
 */
const CONTACT_KEYWORDS = [
    "contact",
    "report",
    "responsible disclosure",
    "security@",
    "vulnerabilit",
    "submit",
    "email",
];

const getSecurityPolicyPath = (rootDirectoryPath: string): null | string => {
    for (const relativePath of SECURITY_PATHS) {
        const absolutePath = path.join(rootDirectoryPath, relativePath);

        if (existsSync(absolutePath)) {
            return absolutePath;
        }
    }

    return null;
};

const hasLikelyEmailAddress = (value: string): boolean => {
    const atSignIndex = value.indexOf("@");

    if (atSignIndex <= 0 || atSignIndex >= value.length - 1) {
        return false;
    }

    return value.slice(atSignIndex + 1).includes(".");
};

const hasContactChannel = (source: string): boolean => {
    const lowerSource = source.toLowerCase();

    if (lowerSource.includes("https://") || lowerSource.includes("mailto:")) {
        return true;
    }

    const lines = stringSplit(source.replaceAll(/\r\n?/gv, "\n"), "\n");

    return lines.some((line) => {
        const lower = line.toLowerCase();

        if (
            stringSplit(lower, " ").some((token) =>
                hasLikelyEmailAddress(token)
            )
        ) {
            return true;
        }

        return CONTACT_KEYWORDS.some((keyword) => lower.includes(keyword));
    });
};

/** Rule enforcing a contact channel in the security policy. */
const rule: ReturnType<typeof createTypedRule> = createTypedRule({
    create: (context) => {
        const lintedFilePath = context.physicalFilename;
        const lintedFileName = path.basename(lintedFilePath);

        if (!setHas(triggerFileNames, lintedFileName)) {
            return {};
        }

        const rootDirectoryPath = path.dirname(lintedFilePath);
        const securityPath = getSecurityPolicyPath(rootDirectoryPath);

        if (securityPath === null) {
            return {};
        }

        return {
            Program(node): void {
                const securitySource = (() => {
                    try {
                        return readFileSync(securityPath, "utf8");
                    } catch {
                        return null;
                    }
                })();

                if (
                    securitySource === null ||
                    securitySource.trim().length === 0 ||
                    hasContactChannel(securitySource)
                ) {
                    return;
                }

                context.report({
                    data: {
                        securityPath: path.relative(
                            rootDirectoryPath,
                            securityPath
                        ),
                    },
                    messageId: "missingSecurityPolicyContactChannel",
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
                "require a contact channel (URL or email) in the security policy file",
            frozen: false,
            recommended: false,
            repoConfigs: [
                "repoPlugin.configs.strict",
                "repoPlugin.configs.all",
            ],
            requiresTypeChecking: false,
            ruleId: "",
            ruleNumber: 0,
            url: createRuleDocsUrl("require-security-policy-contact-channel"),
        },
        messages: {
            missingSecurityPolicyContactChannel:
                "{{ securityPath }} does not contain a recognisable contact channel. Add an email address, URL, or reporting instructions so researchers can reach the maintainers.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "require-security-policy-contact-channel",
});

export default rule;
