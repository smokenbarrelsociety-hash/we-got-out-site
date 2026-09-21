#!/usr/bin/env node
/*
 * Static build for wegotout.org (runs on Netlify; see netlify.toml).
 *
 * You still add content the same way: edit js/stories-data.js, js/blog-data.js,
 * js/documents-data.js or js/glossary-data.js. This script then:
 *
 *   1. Validates those data files. A typo fails the build, and Netlify keeps
 *      serving the last good deploy instead of publishing something broken.
 *   2. Pre-renders every list (home, stories, blog, documents, glossary) into
 *      the HTML, so content is visible without JavaScript and to search engines.
 *   3. Generates a real page for every story, post and document at
 *      /story/<id>, /post/<id> and /document/<id>, each with its own title,
 *      description, Open Graph / Twitter tags, canonical URL and JSON-LD.
 *      It renders them with the SAME functions as js/app.js, so the output
 *      can't drift from what the browser would have produced.
 *   4. Normalizes the <head> of every page (canonical, og:*, twitter:*), the
 *      nav (adds "Start Here", sets aria-current), and the footer.
 *   5. Writes sitemap.xml from the real, indexable pages.
 *
 * Output goes to dist/ (git-ignored). Source files are never modified.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const cheerio = require('cheerio');

// ---------------------------------------------------------------- config ---
const ROOT = __dirname;
const OUT = path.join(ROOT, 'dist');
const SITE = 'https://wegotout.org';
const SITE_NAME = 'Beyond the Standards';
const DEFAULT_DESC =
  'A community of people who left high-control religious groups sharing stories, resources, and language for what happened.';
const OG_IMAGE = SITE + '/images/og-default-v2.png';
const OG_ALT =
  'Beyond the Standards: for people who left high-control religion, or are still deciding to.';

// Pages that should never be indexed (thank-you page, and the legacy
// ?id= templates that now only exist as a fallback).
const NOINDEX_PAGES = new Set(['story.html', 'post.html', 'document.html', 'submitted.html']);
// Which nav item is "current" on pages that aren't themselves in the nav.
const NAV_PARENT = { 'story.html': 'stories.html', 'post.html': 'blog.html', 'document.html': 'documents.html' };
// Order of static pages in the sitemap (anything else follows alphabetically).
const SITEMAP_ORDER = [
  'index.html', 'start-here.html', 'stories.html', 'blog.html', 'documents.html',
  'glossary.html', 'resources.html', 'about.html', 'editorial-policy.html', 'submit.html'
];
const SKIP_COPY = new Set([
  'node_modules', 'dist', '.git', '.github', '.gitignore', 'package.json',
  'package-lock.json', 'build.js', 'netlify.toml', 'README.md', 'sitemap.xml'
]);

const FOOTER_HTML =
  '<footer class="site-footer"><div class="wrap">' +
  '<p>Beyond the Standards &middot; a survivor-run project, not affiliated with any church</p>' +
  '<div class="footer-links">' +
  '<a href="resources.html">Resources</a>' +
  '<a href="glossary.html">Glossary</a>' +
  '<a href="about.html">About</a>' +
  '<a href="editorial-policy.html">Editorial policy</a>' +
  '<a href="https://www.facebook.com/share/g/18wYabtdaB/" target="_blank" rel="noopener noreferrer" class="footer-social">' +
  '<svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>' +
  'Join our Facebook group</a>' +
  '</div></div></footer>';

// --------------------------------------------------------------- helpers ---
const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const plain = (s) => String(s == null ? '' : s).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

function clip(s, n) {
  s = plain(s);
  n = n || 160;
  if (s.length <= n) return s;
  const cut = s.slice(0, n - 1);
  const sp = cut.lastIndexOf(' ');
  return cut.slice(0, sp > 80 ? sp : cut.length).replace(/[\s,;:.\u2013\u2014-]+$/, '') + '\u2026';
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyTree(src, dst, top) {
  ensureDir(dst);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (top && SKIP_COPY.has(entry.name)) continue;
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) copyTree(s, d, false);
    else if (top && entry.name.endsWith('.html')) continue; // processed separately
    else fs.copyFileSync(s, d);
  }
}

// Internal links -> clean root-relative URLs (index.html -> /, foo.html -> /foo,
// story.html?id=x -> /story/x). Everything else is left alone.
function cleanUrl(u) {
  if (!u) return u;
  if (/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(u)) return u;
  const abs = u.startsWith('/') ? u : '/' + u.replace(/^\.\//, '');
  let m;
  if ((m = abs.match(/^\/(story|post|document)\.html\?id=([^&#]+)(#.*)?$/))) return '/' + m[1] + '/' + m[2] + (m[3] || '');
  if ((m = abs.match(/^\/index\.html([?#].*)?$/))) return '/' + (m[1] || '');
  if ((m = abs.match(/^(\/[^?#]*?)\.html([?#].*)?$/))) return m[1] + (m[2] || '');
  return abs;
}

// ------------------------------------------------- load data + app.js ------
const ctx = vm.createContext({ console, URLSearchParams });
vm.runInContext(
  `
  var __els = {};
  var window = { location: { search: '', pathname: '/' } };
  var document = {
    title: '',
    createElement: function () {
      return {
        _t: '',
        set textContent(v) { this._t = String(v); },
        get innerHTML() {
          return this._t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }
      };
    },
    getElementById: function (id) { return __els[id] || null; },
    querySelectorAll: function () { return { forEach: function () {} }; },
    addEventListener: function () {}
  };
`,
  ctx
);

function loadScript(rel) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) return false;
  try {
    vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: rel });
  } catch (e) {
    fail(`${rel}: ${e.name}: ${e.message}`);
    return false;
  }
  return true;
}

['js/stories-data.js', 'js/blog-data.js', 'js/documents-data.js', 'js/glossary-data.js', 'js/app.js'].forEach(loadScript);
if (errors.length) bail();

const data = (name) => vm.runInContext(`typeof ${name} === 'undefined' ? [] : ${name}`, ctx);
const STORIES = data('STORIES');
const POSTS = data('POSTS');
const DOCUMENTS = data('DOCUMENTS');
const GLOSSARY = data('GLOSSARY');

// ------------------------------------------------------------ validation ---
function validate(label, list, fields, opts) {
  opts = opts || {};
  if (!Array.isArray(list)) return fail(`${label}: expected an array`);
  const seen = new Set();
  list.forEach((item, i) => {
    const where = `${label}[${i}]${item && item.id ? ` (${item.id})` : ''}`;
    if (!item || typeof item !== 'object') return fail(`${where}: not an object`);
    for (const f of fields) {
      const v = item[f];
      if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) fail(`${where}: missing "${f}"`);
    }
    if (opts.id) {
      if (!/^[A-Za-z0-9._~-]+$/.test(String(item.id))) fail(`${where}: id may only use letters, numbers, . _ ~ -`);
      if (seen.has(item.id)) fail(`${where}: duplicate id`);
      seen.add(item.id);
    }
    if (opts.date && item[opts.date] && !/^\d{4}-\d{2}-\d{2}$/.test(item[opts.date])) {
      fail(`${where}: "${opts.date}" must look like 2026-07-31`);
    }
  });
}
validate('STORIES', STORIES, ['id', 'title', 'author', 'date', 'excerpt', 'body'], { id: true, date: 'date' });
validate('POSTS', POSTS, ['id', 'title', 'date', 'excerpt', 'body'], { id: true, date: 'date' });
validate('DOCUMENTS', DOCUMENTS, ['id', 'title', 'source', 'description', 'dateAdded', 'pages'], { id: true, date: 'dateAdded' });
validate('GLOSSARY', GLOSSARY, ['term', 'definition']);
if (errors.length) bail();

function bail() {
  console.error('\nBuild failed. Fix these and push again:\n');
  errors.forEach((e) => console.error('  x ' + e));
  console.error('');
  process.exit(1);
}

// ------------------------------------------------------------- rendering ---
// These call the real functions from js/app.js against a stub DOM.
function renderInto(containerId, fn, args) {
  const el = { innerHTML: '' };
  ctx.__els[containerId] = el;
  try {
    fn.apply(null, args || []);
  } finally {
    delete ctx.__els[containerId];
  }
  return el.innerHTML;
}

function renderSingle(fnName, containerId, id) {
  const el = { innerHTML: '' };
  ctx.__els[containerId] = el;
  ctx.window.location.search = '?id=' + encodeURIComponent(id);
  ctx.document.title = '';
  try {
    ctx[fnName]();
  } finally {
    delete ctx.__els[containerId];
    ctx.window.location.search = '';
  }
  return { html: el.innerHTML, title: ctx.document.title };
}

const LISTS = {
  'home-story-grid': () => renderInto('home-story-grid', ctx.renderStoryGrid, ['home-story-grid', 3]),
  'all-story-grid': () => renderInto('all-story-grid', ctx.renderStoryGrid, ['all-story-grid']),
  'document-grid': () => renderInto('document-grid', ctx.renderDocumentGrid, ['document-grid']),
  'blog-post-grid': () => renderInto('blog-post-grid', ctx.renderPostGrid, ['blog-post-grid']),
  'glossary-list': () => renderInto('glossary-list', ctx.renderGlossary, [''])
};

// -------------------------------------------------------- page assembly ---
function normalizeNav($, currentHref) {
  const nav = $('nav.main-nav');
  if (!nav.length) return;
  if (!nav.find('a[href="start-here.html"]').length) {
    nav.find('a').first().after('<a href="start-here.html">Start Here</a>');
  }
  nav.find('a').removeAttr('aria-current');
  if (currentHref) nav.find(`a[href="${currentHref}"]`).attr('aria-current', 'page');
}

function normalizeFooter($) {
  // Several pages have a footer whose opening tags were lost. Replace whatever
  // is there with one canonical footer, placed before the first body script.
  $('footer.site-footer').remove();
  $('.footer-links').remove();
  const firstScript = $('body > script').first();
  if (firstScript.length) firstScript.before(FOOTER_HTML + '\n');
  else $('body').append(FOOTER_HTML + '\n');
}

function rewriteUrls($) {
  // (Form actions are deliberately left exactly as authored.)
  $('a[href], link[href], script[src], img[src], source[src]').each((_, el) => {
    const attr = el.attribs.href != null ? 'href' : 'src';
    const v = el.attribs[attr];
    const n = cleanUrl(v);
    if (n !== v) $(el).attr(attr, n);
  });
}

function jsonLdTag(obj) {
  return '<script type="application/ld+json">' + JSON.stringify(obj).replace(/</g, '\\u003c') + '</script>';
}

function setHead($, o) {
  const head = $('head');
  if (o.title) {
    if ($('title').length) $('title').first().text(o.title);
    else head.prepend(`<title>${esc(o.title)}</title>`);
  }
  const title = $('title').first().text() || SITE_NAME;
  const desc = o.description || $('meta[name="description"]').attr('content') || DEFAULT_DESC;

  head.find(
    'meta[name="description"], meta[name="robots"], meta[property^="og:"], meta[property^="article:"], meta[name^="twitter:"], link[rel="canonical"], script[type="application/ld+json"]'
  ).remove();

  const tags = [`<meta name="description" content="${esc(desc)}">`];
  if (o.noindex) {
    tags.push('<meta name="robots" content="noindex">');
  } else {
    const url = SITE + o.path;
    tags.push(
      `<link rel="canonical" href="${esc(url)}">`,
      `<meta property="og:site_name" content="${esc(SITE_NAME)}">`,
      `<meta property="og:locale" content="en_US">`,
      `<meta property="og:type" content="${o.type || 'website'}">`,
      `<meta property="og:title" content="${esc(title)}">`,
      `<meta property="og:description" content="${esc(desc)}">`,
      `<meta property="og:url" content="${esc(url)}">`,
      `<meta property="og:image" content="${OG_IMAGE}">`,
      `<meta property="og:image:width" content="1200">`,
      `<meta property="og:image:height" content="630">`,
      `<meta property="og:image:alt" content="${esc(OG_ALT)}">`,
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:title" content="${esc(title)}">`,
      `<meta name="twitter:description" content="${esc(desc)}">`,
      `<meta name="twitter:image" content="${OG_IMAGE}">`,
      `<meta name="twitter:image:alt" content="${esc(OG_ALT)}">`
    );
    if (o.published) tags.push(`<meta property="article:published_time" content="${esc(o.published)}">`);
    (o.jsonld || []).forEach((j) => tags.push(jsonLdTag(j)));
  }
  head.append(tags.join('\n') + '\n');
}

function finish($) {
  rewriteUrls($);
  return $.html();
}

function pathFor(name) {
  return name === 'index.html' ? '/' : '/' + name.replace(/\.html$/, '');
}

function buildStaticPage(name) {
  const $ = cheerio.load(fs.readFileSync(path.join(ROOT, name), 'utf8'));

  for (const id of Object.keys(LISTS)) {
    const el = $('#' + id);
    if (el.length) el.html(LISTS[id]());
  }

  normalizeNav($, NAV_PARENT[name] || name);
  normalizeFooter($);

  const noindex = NOINDEX_PAGES.has(name);
  const jsonld = [];
  if (name === 'index.html') {
    jsonld.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE + '/',
      description: $('meta[name="description"]').attr('content') || DEFAULT_DESC
    });
  }
  setHead($, { path: pathFor(name), noindex, jsonld });
  return finish($);
}

function articleLd(kind, item, url, desc, published, author) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.title,
    description: desc,
    datePublished: published,
    mainEntityOfPage: url,
    image: OG_IMAGE,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE + '/' }
  };
  if (author && !/^anonymous$/i.test(author)) ld.author = { '@type': 'Person', name: author };
  else if (kind === 'post') ld.author = { '@type': 'Organization', name: SITE_NAME };
  return ld;
}

function buildDetailPages(cfg) {
  const template = fs.readFileSync(path.join(ROOT, cfg.template), 'utf8');
  const outDir = path.join(OUT, cfg.kind);
  ensureDir(outDir);
  const entries = [];

  for (const item of cfg.items) {
    const rendered = renderSingle(cfg.renderFn, cfg.containerId, item.id);
    if (rendered.title !== item.title) {
      fail(`${cfg.kind} "${item.id}": could not be rendered by js/app.js`);
      continue;
    }
    const $ = cheerio.load(template);
    $('#' + cfg.containerId).html(rendered.html);

    // These pages are fully pre-rendered: drop app.js and the data file so
    // they don't re-render (or download every post) on load.
    $('script[src]').each((_, el) => {
      if (/(^|\/)js\/[^/]+\.js$/.test(el.attribs.src)) $(el).remove();
    });

    normalizeNav($, NAV_PARENT[cfg.template]);
    normalizeFooter($);

    const url = `${SITE}/${cfg.kind}/${item.id}`;
    const desc = clip(cfg.describe(item), 160);
    const published = item[cfg.dateField];
    setHead($, {
      title: `${item.title} \u2014 ${SITE_NAME}`,
      description: desc,
      path: `/${cfg.kind}/${item.id}`,
      type: cfg.kind === 'document' ? 'website' : 'article',
      published: cfg.kind === 'document' ? null : published,
      noindex: !!item.sample,
      jsonld: cfg.kind === 'document' ? [] : [articleLd(cfg.kind, item, url, desc, published, item.author)]
    });

    fs.writeFileSync(path.join(outDir, item.id + '.html'), finish($));
    if (!item.sample) entries.push({ loc: url, lastmod: published, sort: published });
  }
  return entries;
}

// ------------------------------------------------------------------ main ---
fs.rmSync(OUT, { recursive: true, force: true });
copyTree(ROOT, OUT, true);

const rootPages = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));
const staticEntries = [];
for (const name of rootPages) {
  fs.writeFileSync(path.join(OUT, name), buildStaticPage(name));
  if (!NOINDEX_PAGES.has(name)) staticEntries.push(name);
}

const details = []
  .concat(
    buildDetailPages({
      kind: 'story', template: 'story.html', containerId: 'story-container', renderFn: 'renderSingleStory',
      items: STORIES, dateField: 'date',
      describe: (s) => s.excerpt || (s.body && s.body[0])
    }),
    buildDetailPages({
      kind: 'post', template: 'post.html', containerId: 'post-container', renderFn: 'renderSinglePost',
      items: POSTS, dateField: 'date',
      describe: (p) => p.excerpt || p.subtitle || plain(typeof p.body[0] === 'string' ? p.body[0] : p.body[0].text)
    }),
    buildDetailPages({
      kind: 'document', template: 'document.html', containerId: 'document-container', renderFn: 'renderSingleDocument',
      items: DOCUMENTS, dateField: 'dateAdded',
      describe: (d) => d.description
    })
  )
  .sort((a, b) => (a.sort < b.sort ? 1 : -1));

if (errors.length) bail();

// sitemap
const ordered = SITEMAP_ORDER.filter((n) => staticEntries.includes(n)).concat(
  staticEntries.filter((n) => !SITEMAP_ORDER.includes(n)).sort()
);
const urls = ordered.map((n) => `  <url><loc>${SITE}${pathFor(n)}</loc></url>`).concat(
  details.map((d) => `  <url><loc>${d.loc}</loc><lastmod>${d.lastmod}</lastmod></url>`)
);
fs.writeFileSync(
  path.join(OUT, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.join('\n') + '\n</urlset>\n'
);

// link check (warnings only: a stray link shouldn't block publishing)
function exists(p) {
  const clean = p.replace(/[?#].*$/, '');
  if (clean === '/' || clean === '') return true;
  const base = path.join(OUT, decodeURIComponent(clean));
  return fs.existsSync(base) || fs.existsSync(base + '.html') || fs.existsSync(path.join(base, 'index.html'));
}
(function checkLinks(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) { checkLinks(p); continue; }
    if (!entry.name.endsWith('.html')) continue;
    const $ = cheerio.load(fs.readFileSync(p, 'utf8'));
    $('a[href^="/"], link[href^="/"], script[src^="/"], img[src^="/"]').each((_, el) => {
      const u = el.attribs.href || el.attribs.src;
      if (u.startsWith('//')) return;
      if (!exists(u)) warnings.push(`${path.relative(OUT, p)}: broken link ${u}`);
    });
  }
})(OUT);

console.log(
  `Built ${rootPages.length} pages + ${details.length} detail pages ` +
    `(${STORIES.length} stories, ${POSTS.length} posts, ${DOCUMENTS.length} documents) -> dist/`
);
if (warnings.length) {
  console.warn(`\n${warnings.length} link warning(s):`);
  warnings.forEach((w) => console.warn('  ! ' + w));
}
