# AI and contributor instructions

This repository is the source of the public website **Beyond the Standards** (wegotout.org), a survivor-run resource about high-control religious environments.

## Non-negotiable safeguards
- Never commit to `main` directly. Propose changes in a dedicated branch and pull request. Do not merge or deploy without the site owner's explicit approval.
- Never invent survivor testimony, quotes, citations, Scripture references, document provenance, or allegations. Distinguish firsthand experience, analysis, and independently supported facts.
- Never publish, modify, deanonymize, or remove a contributor's personal story without documented owner authorization and, when applicable, the contributor's consent. Treat form submissions and identities as sensitive.
- Do not include tokens, passwords, email submissions, unpublished testimony, or other private data in issues, pull requests, commits, or logs.
- Follow the site's existing `editorial-policy.html`. For claims concerning named people or organizations, request human review, ensure proportional and accurate sourcing, and provide a fair correction process.
- Cite Scripture accurately and in context, using the translation specified by the site owner. Do not present speculative theological interpretations as established facts.
- Never change Netlify settings, GitHub permissions, redirects, analytics, forms, or deployment settings without separate approval.

## Site architecture
- Netlify runs `node build.js` and publishes `dist/`, configured in `netlify.toml`.
- Add/edit stories in `js/stories-data.js`, blog posts in `js/blog-data.js`, documents in `js/documents-data.js`, and glossary terms in `js/glossary-data.js`.
- Every new story/post/document must have a unique, URL-safe `id`. Keep source material and provenance available for editorial review.
- `build.js` generates standalone pages, canonical/social tags, and the sitemap. Do not manually edit generated `dist/` files.

## Pull request process
1. State the purpose, files touched, user-visible changes, and potential safety/privacy concerns.
2. Keep editorial, design, and infrastructure changes separate where practical.
3. Run `npm ci` and `npm run build`; review build warnings and errors.
4. Verify generated routes, metadata, links, and relevant mobile/accessibility behavior for changes affecting presentation.
5. Use a Netlify Deploy Preview, if available. Do not treat a passing build as proof the public-facing site is correct.
6. Request the owner's approval before merging. Confirm no protected testimony or personal information appears in the diff.

These instructions guide proposed AI changes; they do **not** give an agent unattended publishing authority.
