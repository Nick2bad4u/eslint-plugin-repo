# require-security-policy-contact-channel

Require a contact channel (URL or email) in the security policy file.

## Targeted pattern scope

This rule checks `SECURITY.md` or `.github/SECURITY.md` for a URL (`https://`)
or email address pattern, or for common contact keywords (`contact`, `report`,
`email`, `reach`, `discord`, `slack`).

## What this rule reports

This rule reports when the security policy file exists but does not appear to
contain any actionable contact channel for reporting vulnerabilities.

## Why this rule exists

A `SECURITY.md` that only describes a disclosure policy without providing a way
to actually report a vulnerability is incomplete. Security researchers need a
concrete contact channel — a private email, a security advisory URL, or a chat
invitation link — to responsibly disclose issues. An absent contact channel
discourages responsible disclosure and may result in public disclosure by default.

## ❌ Incorrect

```markdown
# Security Policy

We take security seriously. Please do not open public issues for vulnerabilities.
(No contact information provided)
```

## ✅ Correct

```markdown
# Security Policy

## Reporting a Vulnerability

Please report security vulnerabilities by emailing **security@example.com** or
by opening a [GitHub Security Advisory](https://github.com/owner/repo/security/advisories/new).

We aim to respond within 72 hours.
```

## ESLint flat config example

```js
import repoPlugin from "eslint-plugin-repo";

export default [
  repoPlugin.configs.strict,
  {
    plugins: { "repo-compliance": repoPlugin },
    rules: {
      "repo-compliance/require-security-policy-contact-channel": "warn",
    },
  },
];
```

## When not to use it

Disable this rule if your project deliberately keeps contact details out of the
repository (e.g., the contact channel is documented only in an internal wiki) and
your security policy still meets your organisation's requirements.

> **Rule catalog ID:** R046

## Further reading

- [GitHub Docs: Adding a security policy to your repository](https://docs.github.com/en/code-security/getting-started/adding-a-security-policy-to-your-repository)
- [FIRST: Coordinated Vulnerability Disclosure](https://www.first.org/global/sigs/vulnerability-coordination/)
