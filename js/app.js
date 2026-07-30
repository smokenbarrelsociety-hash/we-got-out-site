// ---------- helpers ----------
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function sortedStories() {
  return [...STORIES].sort((a, b) => new Date(b.date) - new Date(a.date));
}

// ---------- story card ----------
function storyCardHTML(story) {
  const tags = (story.tags || []).map(t => `<span class="tag">${escapeHTML(t)}</span>`).join("");
  return `
    <a class="story-card" href="story.html?id=${encodeURIComponent(story.id)}">
      ${story.sample ? '<span class="sample-flag">Sample</span>' : ""}
      <div class="meta">${escapeHTML(story.author)} &middot; ${formatDate(story.date)}</div>
      <h3>${escapeHTML(story.title)}</h3>
      <p>${escapeHTML(story.excerpt)}</p>
      <div class="tags">${tags}</div>
    </a>`;
}

function renderStoryGrid(containerId, limit) {
  const el = document.getElementById(containerId);
  if (!el) return;
  let list = sortedStories();
  if (limit) list = list.slice(0, limit);
  el.innerHTML = list.map(storyCardHTML).join("");
}

// ---------- single story page ----------
function renderSingleStory() {
  const el = document.getElementById("story-container");
  if (!el) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const story = STORIES.find(s => s.id === id);

  if (!story) {
    el.innerHTML = `
      <div class="prose story-header">
        <h1>Story not found</h1>
        <p>We couldn't find that story. It may have been moved or the link may be incorrect.</p>
        <a class="back-link" href="stories.html">&larr; Back to all stories</a>
      </div>`;
    document.title = "Story not found";
    return;
  }

  document.title = story.title;
  const tags = (story.tags || []).map(t => `<span class="tag">${escapeHTML(t)}</span>`).join("");
  const body = story.body.map(p => `<p>${escapeHTML(p)}</p>`).join("");

  el.innerHTML = `
    <div class="prose story-header">
      ${story.sample ? '<span class="sample-flag">Sample entry — not a real story</span>' : ""}
      <div class="meta">${escapeHTML(story.author)} &middot; ${formatDate(story.date)}</div>
      <h1>${escapeHTML(story.title)}</h1>
      <div class="tags">${tags}</div>
    </div>
    <div class="prose story-body">
      ${body}
      <a class="back-link" href="stories.html">&larr; Back to all stories</a>
    </div>`;
}

// ---------- glossary ----------
function renderGlossary(filter) {
  const el = document.getElementById("glossary-list");
  if (!el) return;
  const q = (filter || "").trim().toLowerCase();
  const list = [...GLOSSARY]
    .sort((a, b) => a.term.localeCompare(b.term))
    .filter(g => !q || g.term.toLowerCase().includes(q) || g.definition.toLowerCase().includes(q));

  if (list.length === 0) {
    el.innerHTML = `<p class="glossary-empty">No terms match "${escapeHTML(filter)}".</p>`;
    return;
  }

  el.innerHTML = `<dl>${list.map(g => `
    <div class="glossary-entry">
      <dt>${escapeHTML(g.term)}</dt>
      <dd>${escapeHTML(g.definition)}</dd>
    </div>`).join("")}</dl>`;
}

function initGlossarySearch() {
  const input = document.getElementById("glossary-search");
  if (!input) return;
  renderGlossary("");
  input.addEventListener("input", () => renderGlossary(input.value));
}

// ---------- documents ----------
function sortedDocuments() {
  if (typeof DOCUMENTS === "undefined") return [];
  return [...DOCUMENTS].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
}

function documentCardHTML(doc) {
  const tags = (doc.tags || []).map(t => `<span class="tag">${escapeHTML(t)}</span>`).join("");
  return `
    <a class="story-card" href="document.html?id=${encodeURIComponent(doc.id)}">
      <div class="meta">${escapeHTML(doc.source)}</div>
      <h3>${escapeHTML(doc.title)}</h3>
      <p>${escapeHTML(doc.description.slice(0, 160))}${doc.description.length > 160 ? "…" : ""}</p>
      <div class="tags">${tags}</div>
    </a>`;
}

function renderDocumentGrid(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const list = sortedDocuments();
  if (list.length === 0) {
    el.innerHTML = `<p class="glossary-empty">No documents yet.</p>`;
    return;
  }
  el.innerHTML = list.map(documentCardHTML).join("");
}

function renderSingleDocument() {
  const el = document.getElementById("document-container");
  if (!el) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const doc = DOCUMENTS.find(d => d.id === id);

  if (!doc) {
    el.innerHTML = `
      <div class="prose story-header">
        <h1>Document not found</h1>
        <p>We couldn't find that document. It may have been moved or the link may be incorrect.</p>
        <a class="back-link" href="documents.html">&larr; Back to all documents</a>
      </div>`;
    document.title = "Document not found";
    return;
  }

  document.title = doc.title;
  const tags = (doc.tags || []).map(t => `<span class="tag">${escapeHTML(t)}</span>`).join("");
  const pages = doc.pages.map((src, i) => `
    <figure class="doc-page">
      <img src="${escapeHTML(src)}" alt="${escapeHTML(doc.title)} — page ${i + 1}" loading="lazy">
      <figcaption>Page ${i + 1} of ${doc.pages.length}</figcaption>
    </figure>`).join("");

  const relatedLink = doc.relatedStoryUrl
    ? `<div class="resource-card" style="margin-top:30px;">
         <a href="${escapeHTML(doc.relatedStoryUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(doc.relatedStoryLabel || "Related story")} &rarr;</a>
       </div>`
    : "";

  el.innerHTML = `
    <div class="prose story-header">
      <div class="meta">${escapeHTML(doc.source)}</div>
      <h1>${escapeHTML(doc.title)}</h1>
      <div class="tags">${tags}</div>
    </div>
    <div class="prose story-body">
      <p>${escapeHTML(doc.description)}</p>
      ${relatedLink}
      <div class="doc-pages">${pages}</div>
      <a class="back-link" href="documents.html">&larr; Back to all documents</a>
    </div>`;
}
// ---------- blog ----------
function sortedPosts() {
  if (typeof POSTS === "undefined") return [];
  return [...POSTS].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function postCardHTML(post) {
  const tags = (post.tags || []).map(t => `<span class="tag">${escapeHTML(t)}</span>`).join("");
  return `
    <a class="story-card" href="post.html?id=${encodeURIComponent(post.id)}">
      <div class="meta">${formatDate(post.date)}</div>
      <h3>${escapeHTML(post.title)}</h3>
      <p>${escapeHTML(post.excerpt)}</p>
      <div class="tags">${tags}</div>
    </a>`;
}

function renderPostGrid(containerId, limit) {
  const el = document.getElementById(containerId);
  if (!el) return;
  let list = sortedPosts();
  if (limit) list = list.slice(0, limit);
  if (list.length === 0) {
    el.innerHTML = `<p class="glossary-empty">No posts yet.</p>`;
    return;
  }
  el.innerHTML = list.map(postCardHTML).join("");
}

function renderSinglePost() {
  const el = document.getElementById("post-container");
  if (!el) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const post = POSTS.find(p => p.id === id);

  if (!post) {
    el.innerHTML = `
      <div class="prose story-header">
        <h1>Post not found</h1>
        <p>We couldn't find that post. It may have been moved or the link may be incorrect.</p>
        <a class="back-link" href="blog.html">&larr; Back to all posts</a>
      </div>`;
    document.title = "Post not found";
    return;
  }

  document.title = post.title;
  const tags = (post.tags || []).map(t => `<span class="tag">${escapeHTML(t)}</span>`).join("");
  const body = post.body.map(p => `<p>${escapeHTML(p)}</p>`).join("");

  el.innerHTML = `
    <div class="prose story-header">
      <div class="meta">${formatDate(post.date)}</div>
      <h1>${escapeHTML(post.title)}</h1>
      <div class="tags">${tags}</div>
    </div>
    <div class="prose story-body">
      ${body}
      <a class="back-link" href="blog.html">&larr; Back to all posts</a>
    </div>`;
}
// ---------- nav active state ----------
function markActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav.main-nav a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      a.setAttribute("aria-current", "page");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  markActiveNav();
  renderStoryGrid("home-story-grid", 3);
  renderStoryGrid("all-story-grid");
  renderSingleStory();
  initGlossarySearch();
  renderDocumentGrid("document-grid");
  renderSingleDocument();
  renderPostGrid("blog-post-grid");
  renderSinglePost();
});
