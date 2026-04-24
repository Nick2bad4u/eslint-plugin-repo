# require-gitlab-ci-security-scanning

Require at least one GitLab security scanning template or job in `.gitlab-ci.yml`.

## Targeted pattern scope

This rule checks `.gitlab-ci.yml` (or `.gitlab-ci.yaml`) and inspects the file content for any recognizable GitLab security scanning configuration.

Accepted patterns include:

- **GitLab-managed template includes** — `template: Security/SAST.gitlab-ci.yml`, `template: Security/Secret-Detection.gitlab-ci.yml`, `template: Security/Dependency-Scanning.gitlab-ci.yml`, `template: Security/DAST.gitlab-ci.yml`, `template: Security/Container-Scanning.gitlab-ci.yml`, `template: Jobs/SAST.latest.gitlab-ci.yml`.
- **Explicit security job definitions** — a top-level job named `sast:`, `secret_detection:`, `dependency_scanning:`, `dast:`, or `container_scanning:`.

## What this rule reports

This rule reports repositories where `.gitlab-ci.yml` does not contain any of the recognised security scanning templates or job names.

## Why this rule exists

GitLab provides built-in security scanning templates (SAST, Secret Detection, Dependency Scanning, DAST, Container Scanning) that integrate directly with GitLab's Security Dashboard and Merge Request vulnerability reports.

Requiring at least one security scan in the pipeline enforces a minimum supply-chain security posture and makes vulnerability data visible during code review.

Without this rule it is easy for a project to ship a functioning pipeline that produces zero security signal, leaving hidden vulnerabilities undetected until production.

## ❌ Incorrect

```ts
// .gitlab-ci.yml
stages:
  - build
  - test

build:
  stage: build
  script:
    - npm run build

test:
  stage: test
  script:
    - npm test
```

## ✅ Correct

```ts
// .gitlab-ci.yml — SAST template include
include:
  - template: Security/SAST.gitlab-ci.yml

stages:
  - test
  - sast
```

```ts
// .gitlab-ci.yml — multiple security templates
include:
  - template: Security/SAST.gitlab-ci.yml
  - template: Security/Secret-Detection.gitlab-ci.yml
  - template: Security/Dependency-Scanning.gitlab-ci.yml

stages:
  - build
  - test
  - security
```

```ts
// .gitlab-ci.yml — explicit sast job
stages:
  - test

sast:
  stage: test
  script:
    - run-custom-sast
```

## ESLint flat config example

```js
// eslint.config.mjs
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.gitlab,
  // or individually:
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-gitlab-ci-security-scanning": "error",
    },
  },
];
```

## When not to use it

Disable this rule only if your GitLab project intentionally runs all security scanning through an external pipeline system (such as a parent pipeline that invokes security templates) and cannot include the templates directly in the repository `.gitlab-ci.yml`.

> **Rule catalog ID:** R019

## Further reading

- [GitLab Docs: SAST](https://docs.gitlab.com/ee/user/application_security/sast/)
- [GitLab Docs: Secret Detection](https://docs.gitlab.com/ee/user/application_security/secret_detection/)
- [GitLab Docs: Dependency Scanning](https://docs.gitlab.com/ee/user/application_security/dependency_scanning/)
- [GitLab Docs: Container Scanning](https://docs.gitlab.com/ee/user/application_security/container_scanning/)
- [GitLab Docs: DAST](https://docs.gitlab.com/ee/user/application_security/dast/)
- [GitLab Docs: Security configuration](https://docs.gitlab.com/ee/user/application_security/configuration/)

## Adoption resources

- Enable `repo-compliance:gitlab` preset in your flat config to activate this rule alongside other GitLab-specific checks.
- Add the SAST template include as the minimal first step, then expand to additional templates as the project matures.
