import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { setHas } from "ts-extras";

const dependabotRelativePaths = [
    ".github/dependabot.yml",
    ".github/dependabot.yaml",
] as const;

const readmeRelativePaths = [
    "README.md",
    "README",
    "README.txt",
] as const;

const gitlabCiRelativePaths = [".gitlab-ci.yml", ".gitlab-ci.yaml"] as const;
const workflowExtensions = new Set([".yaml", ".yml"]);

const findFirstExistingRepositoryFile = (
    rootDirectoryPath: string,
    relativePaths: readonly string[]
): null | string => {
    for (const relativePath of relativePaths) {
        const absolutePath = resolve(rootDirectoryPath, relativePath);

        if (existsSync(absolutePath)) {
            return absolutePath;
        }
    }

    return null;
};

/**
 * Resolves the first supported Dependabot configuration file from the
 * repository root, preferring `.github/dependabot.yml` and then `.yaml`.
 */
export const getDependabotConfigPath = (
    rootDirectoryPath: string
): null | string =>
    findFirstExistingRepositoryFile(rootDirectoryPath, dependabotRelativePaths);

/**
 * Resolves the first supported repository README file from the repository root.
 */
export const getRepositoryReadmePath = (
    rootDirectoryPath: string
): null | string =>
    findFirstExistingRepositoryFile(rootDirectoryPath, readmeRelativePaths);

/**
 * Resolves the first supported GitLab CI configuration file from the repository
 * root, preferring `.gitlab-ci.yml` and then `.gitlab-ci.yaml`.
 */
export const getGitLabCiConfigPath = (
    rootDirectoryPath: string
): null | string =>
    findFirstExistingRepositoryFile(rootDirectoryPath, gitlabCiRelativePaths);

/**
 * Returns all readable Forgejo workflow file paths from `.forgejo/workflows`
 * using the supported `.yml` and `.yaml` extensions.
 */
export const getForgejoWorkflowPaths = (
    rootDirectoryPath: string
): readonly string[] => {
    const workflowsDirectoryPath = join(
        rootDirectoryPath,
        ".forgejo",
        "workflows"
    );

    if (!existsSync(workflowsDirectoryPath)) {
        return [];
    }

    const entries = readdirSync(workflowsDirectoryPath, {
        withFileTypes: true,
    });

    return entries
        .filter(
            (entry) =>
                entry.isFile() &&
                setHas(workflowExtensions, extname(entry.name).toLowerCase())
        )
        .map((entry) => join(workflowsDirectoryPath, entry.name));
};

/**
 * Normalizes CRLF and CR newlines to LF so text-based rules can parse files
 * deterministically across platforms.
 */
export const normalizeLineEndings = (source: string): string =>
    source.replaceAll(/\r\n?/gv, "\n");

/**
 * Reads a UTF-8 text file and returns `null` when the file cannot be read.
 */
export const readTextFileIfExists = (filePath: string): null | string => {
    try {
        return readFileSync(filePath, "utf8");
    } catch {
        return null;
    }
};
