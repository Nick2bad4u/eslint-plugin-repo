---
sidebar_position: 2
---

# Deploy Pages, SEO, and IndexNow

This guide covers the operational path for publishing the Docusaurus site and keeping discovery metadata healthy.

## Publish flow

From repository root, run the docs build chain used by CI:

```bash
npm run docs:api
npm run docs:build
```

For local iteration and CI parity:

```bash
npm run docs:api
npm run docs:build
```

## SEO and metadata surfaces

Primary metadata is configured in `docs/docusaurus/docusaurus.config.ts`:

- `url` and `baseUrl`
- Open Graph and Twitter card metadata
- sitemap configuration
- structured data (`WebSite` JSON-LD)

When repository identity changes, update these values together to avoid split canonical URLs.

## IndexNow and link quality checks

Use the repository scripts to keep discoverability stable:

- `npm run docs:check-links`
- `npm run docs:devtools:metadata`

These commands reduce broken-link churn and keep search/indexing metadata aligned with the current docs structure.

## Safe change checklist

- Do not hand-edit generated TypeDoc output in `site-docs/developer/api/**`.
- Prefer updating source docs, then regenerate.
- Keep sidebar IDs stable where possible; avoid route churn unless necessary.
