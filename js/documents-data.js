/*
  DOCUMENTS DATA
  ==============
  Primary source materials: internal church documents, teaching notes,
  handouts, letters, etc. Different from STORIES (personal accounts) —
  these are institutional artifacts offered as evidence.

  To add a document: copy an entry, give it a unique "id", fill in fields,
  add page image files to images/documents/ and reference them in "pages".

  Fields:
    id          - unique url-safe slug
    title       - document title
    source      - who/where it's from, e.g. "Rev. Cliff Hunnicutt, Harvester Baptist Church"
    dateAdded   - "YYYY-MM-DD", used for sorting (when added to the site, not
                  necessarily when the document was written)
    tags        - short array of labels
    description - context: what this is, why it matters, how it was obtained
                  (plain text, a few sentences)
    pages       - array of image paths (relative to site root), in reading order
    relatedStoryUrl - optional: link to a story this document corroborates
    relatedStoryLabel - optional: label for that link
*/

const DOCUMENTS = [
  {
    id: "principles-of-isolation-hunnicutt",
    title: "Principles of Isolation: A Review for Parents",
    source: "Rev. Cliff Hunnicutt, Harvester Baptist Church / Harvester Baptist Mission",
    dateAdded: "2026-07-28",
    tags: ["Isolation", "Shunning", "Church Discipline"],
    description: "Notes extracted from a sermon series titled \"Biblical Discipline and Isolation,\" instructing parents on how to isolate a child who has been placed under church discipline: no phone calls, letters, or contact of any kind, framed as entrusting the child to God rather than a punishment. This is the same isolation practice described in the Anna Compton account linked below, and the same pastor named there.",
    pages: [
      "images/documents/principles-of-isolation-p1.jpeg",
      "images/documents/principles-of-isolation-p2.jpeg"
    ],
    relatedStoryUrl: "https://sites.google.com/site/truthaboutanna/the-untold-story-of-anna-compton",
    relatedStoryLabel: "Read the Anna Compton account this document relates to"
  },
  {
    id: "restoration-of-isolated-child-hunnicutt",
    title: "Restoration of the Isolated Child: Guidelines for Parents",
    source: "Rev. Cliff Hunnicutt, Harvester Baptist Church / Harvester Baptist Mission",
    dateAdded: "2026-07-28",
    tags: ["Isolation", "Shunning", "Church Discipline"],
    description: "A companion document to \"Principles of Isolation,\" from the same sermon series, laying out conditions parents are told to require before an isolated child can be let back into contact: confession letters, demonstrated \"humility and correctability,\" a family meeting, and a private testimony to the church. Page order here is our best reconstruction from how the content reads; if you have the original page order, let us know.",
    pages: [
      "images/documents/restoration-of-isolated-child-p1.jpeg",
      "images/documents/restoration-of-isolated-child-p2.jpeg",
      "images/documents/restoration-of-isolated-child-p3.jpeg"
    ],
    relatedStoryUrl: "https://sites.google.com/site/truthaboutanna/the-untold-story-of-anna-compton",
    relatedStoryLabel: "Read the Anna Compton account this document relates to"
  }
];
