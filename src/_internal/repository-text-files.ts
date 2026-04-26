import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { setHas } from "ts-extras";

// File content cache to avoid repeated disk reads for the same file.
// This is safe because ESLint rules are ephemeral and run on snapshot data.
const fileContentCache = new Map<string, null | string>();

const dependabotRelativePaths = [
    ".github/dependabot.yml",
    ".github/dependabot.yaml",
] as const;

const readmeRelativePaths = [
    "README.md",
    "README",
    "README.txt",
] as const;

const amplifyRelativePaths = ["amplify.yml", "amplify.yaml"] as const;
const azurePipelinesRelativePaths = [
    "azure-pipelines.yml",
    "azure-pipelines.yaml",
] as const;
const cloudBuildRelativePaths = ["cloudbuild.yaml", "cloudbuild.yml"] as const;
const digitalOceanAppSpecRelativePaths = [
    ".do/app.yaml",
    ".do/app.yml",
] as const;
const dockerfileRelativePaths = ["Dockerfile"] as const;
const gitlabCiRelativePaths = [".gitlab-ci.yml", ".gitlab-ci.yaml"] as const;
const netlifyRelativePaths = ["netlify.toml"] as const;
const vercelRelativePaths = ["vercel.json"] as const;
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
 * Resolves the first supported AWS Amplify build specification from the
 * repository root.
 */
export const getAwsAmplifyConfigPath = (
    rootDirectoryPath: string
): null | string =>
    findFirstExistingRepositoryFile(rootDirectoryPath, amplifyRelativePaths);

/**
 * Resolves the first supported Azure Pipelines configuration file from the
 * repository root.
 */
export const getAzurePipelinesConfigPath = (
    rootDirectoryPath: string
): null | string =>
    findFirstExistingRepositoryFile(
        rootDirectoryPath,
        azurePipelinesRelativePaths
    );

/**
 * Resolves the first supported Google Cloud Build configuration file from the
 * repository root.
 */
export const getGoogleCloudBuildConfigPath = (
    rootDirectoryPath: string
): null | string =>
    findFirstExistingRepositoryFile(rootDirectoryPath, cloudBuildRelativePaths);

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
 * Resolves the repository-root Dockerfile path when present.
 */
export const getRepositoryDockerfilePath = (
    rootDirectoryPath: string
): null | string =>
    findFirstExistingRepositoryFile(rootDirectoryPath, dockerfileRelativePaths);

/**
 * Resolves the Netlify configuration file from the repository root.
 */
export const getNetlifyConfigPath = (
    rootDirectoryPath: string
): null | string =>
    findFirstExistingRepositoryFile(rootDirectoryPath, netlifyRelativePaths);

/**
 * Resolves the Vercel configuration file from the repository root.
 */
export const getVercelConfigPath = (rootDirectoryPath: string): null | string =>
    findFirstExistingRepositoryFile(rootDirectoryPath, vercelRelativePaths);

/**
 * Resolves the first supported DigitalOcean App Platform specification from the
 * repository root.
 */
export const getDigitalOceanAppSpecPath = (
    rootDirectoryPath: string
): null | string =>
    findFirstExistingRepositoryFile(
        rootDirectoryPath,
        digitalOceanAppSpecRelativePaths
    );

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
 * Results are cached to avoid repeated disk I/O for the same file path.
 *
 * @param filePath - Absolute path to the file to read
 *
 * @returns File contents or null if file cannot be read
 */
export const readTextFileIfExists = (filePath: string): null | string => {
    // Return cached result if available (including null for non-existent files)
    if (fileContentCache.has(filePath)) {
        return fileContentCache.get(filePath) ?? null;
    }

    let content: null | string = null;
    try {
        content = readFileSync(filePath, "utf8");
    } catch {
        // Intentionally silent: file may not exist, may lack permissions,
        // or may have encoding issues. ESLint rules should handle null gracefully.
    }

    fileContentCache.set(filePath, content);
    return content;
};

/**
 * Clears the file content cache. Used for testing purposes to ensure a fresh
 * state when re-running tests or when fixtures are modified between test runs.
 *
 * @internal
 */
export const clearFileContentCache = (): void => {
    fileContentCache.clear();
};
