# Beyond the Standards (wegotout.org)

A static site. Content lives in four data files; a small build step turns them into real pages.

## Adding content

Edit the data file, commit, and Netlify does the rest:

| To add… | Edit |
| --- | --- |
| a story | `js/stories-data.js` |
| a blog post | `js/blog-data.js` |
| a document | `js/documents-data.js` |
| a glossary term | `js/glossary-data.js` |

Every story, post, and document needs a unique `id` (letters, numbers, and hyphens). The id becomes the URL:
`/story/<id>`, `/post/<id>`, `/document/<id>`.

## What the build does (`build.js`, run by Netlify per `netlify.toml`)

1. **Validates the data files.** A typo or duplicate id fails the build with a plain message, and Netlify keeps serving the last good deploy.
2. **Pre-renders the lists** (home, stories, blog, documents, glossary) so content is in the HTML, not only added by JavaScript.
3. **Generates one page per story, post, and document**, each with its own title, description, Open Graph / Twitter tags, canonical URL, and JSON-LD.
4. **Normalizes every page:** canonical + social tags in `<head>`, "Start Here" in the nav, `aria-current` on the current page, and one canonical footer.
5. **Writes `sitemap.xml`** from the real pages. (The `sitemap.xml` in this repo is ignored; the build generates it.)

Output goes to `dist/`, which is git-ignored. Source pages are never modified.

Old links like `/story.html?id=abc` are redirected (301) to `/story/abc`. `story.html`, `post.html`, and `document.html` remain as a fallback and are marked `noindex`.

## Run it locally

```
npm install
node build.js
```

Then serve `dist/` with any static server, e.g. `npx serve dist`.

## Social share image

`images/og-default-v2.png` (1200×630). If you replace it, use a new filename, because Facebook and LinkedIn cache images aggressively. Then update `OG_IMAGE` in `build.js`.
