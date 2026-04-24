/**
 * @packageDocumentation
 * Lightweight client-side enhancements for docs sidebar labels.
 */

type CleanupFunction = () => void;

declare global {
    interface Window {
        initializeAdvancedFeatures?: typeof initializeAdvancedFeatures;
    }
}

const runtimePrefixes = [
    "Function:",
    "Type:",
    "Variable:",
] as const;

function tokenizeRuntimeLabel(link: HTMLAnchorElement): void {
    const label = link.textContent?.trim() ?? "";
    const matchedPrefix = runtimePrefixes.find((prefix) =>
        label.startsWith(`${prefix} `)
    );

    if (matchedPrefix === undefined) {
        return;
    }

    const remainder = label.slice(matchedPrefix.length).trim();
    const token = document.createElement("span");
    token.className = "sb-inline-runtime-kind";
    token.textContent = matchedPrefix.replace(":", "");

    link.replaceChildren(token, document.createTextNode(` ${remainder}`));
}

function initializeAdvancedFeatures(): CleanupFunction {
    const links = document.querySelectorAll<HTMLAnchorElement>(
        ".theme-doc-sidebar-item-link-level-2 > .menu__link"
    );

    for (const link of links) {
        tokenizeRuntimeLabel(link);
    }

    return () => {
        // no-op cleanup for now
    };
}

const globalWithEnhancements = globalThis as typeof globalThis & {
    initializeAdvancedFeatures?: typeof initializeAdvancedFeatures;
};

globalWithEnhancements.initializeAdvancedFeatures = initializeAdvancedFeatures;

export { initializeAdvancedFeatures };
