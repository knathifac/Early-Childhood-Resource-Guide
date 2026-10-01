# Early Childhood Resource Guide

A functional, low-fidelity wireframe in HTML, CSS, and vanilla JavaScript. The root `index.html` is the homepage. This implementation intentionally includes only the wireframe, overriding the broader scope in `KIRO_DEVELOPMENT_SPEC.md`.

## Preview locally

From this folder, run:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. Use HTTP rather than opening files directly: resource data loads with `fetch`. No install, framework, backend, or build step is needed.

## Files and editing

- `index.html`, `resources.html`, `resource.html`, `about.html`: four page shells.
- `assets/styles.css`: grayscale responsive layout and keyboard focus styles.
- `assets/app.js`: navigation, data loading, directory, and details.
- `assets/model.js`: validation, filtering, sorting, and URL state.
- `data/resources.json`: the single shared data file, containing `taxonomy` labels and 15 demonstration `resources`.

To add a resource, copy a record in `resources`, assign a unique lowercase hyphenated `id`, and edit its title, summary, description, instructions, and metadata arrays. Metadata values must match IDs in `taxonomy`; bilingual entries use both `english` and `spanish`. Add or rename filter labels centrally in `taxonomy`. Missing optional metadata displays “Not specified.” Required text, duplicate IDs, invalid metadata references, and malformed materials cause a recoverable data error.

Keep illustrative entries marked `isSample: true`, their materials `isPlaceholder: true`, and their URLs `null`. Sample materials never become clickable. Only after actual content review should a record be marked `isSample: false`, with approved provider/attribution, instructions, and review date. Verified materials can use `isPlaceholder: false` and an HTTP(S) or repository-relative `url`; script URLs are rejected. Do not invent affiliations or material URLs. Validate JSON after edits (no trailing commas):

```sh
python3 -m json.tool data/resources.json > /dev/null
```

Search requires every whitespace-separated word somewhere in the title, summary, description, or displayed facet metadata. Filters use OR within a category and AND across categories. Repeated URL parameters store selections (for example `?topics=mathematics&languages=spanish`); `q` stores search and `sort=desc` selects Z–A. Clear all also resets sorting. Detail links retain directory state. Unknown URL values are ignored.

## Quick checks

Browse all 15 records; try Mathematics + Spanish, select two audiences, sort Z–A, remove a chip, reload, and use browser Back/Forward. Try an impossible query, `resource.html?id=unknown`, and a missing ID. Use Tab, Space, Enter, and Escape with the mobile navigation. Temporarily block the JSON request to check Retry. Test narrow screens and zoom. Relative paths support serving this folder under a subdirectory.

This is sample content, not a production collection or an accessibility certification. Age definitions, approved resource data, affiliations, and materials await client review. No translated interface, CMS, or backend is included.

### Verification performed

The assertions in `tests/model.test.mjs` passed through the available JavaScript runtime: 15 sample records, all taxonomy options represented, OR/AND filtering, mixed-case multiword search, no matches, both title sorts, unknown URL values, state serialization, missing optional metadata, duplicate/invalid data rejection, and material URL safety. With Node 18+ installed, rerun them using `node tests/model.test.mjs` (Node is optional and not needed to preview the site).

All four pages and shared assets returned successful local HTTP responses. Static relative-link checks and `git diff --check` passed. No browser was connected to the available browser tools, so rendered layouts, keyboard interaction, browser Back/Forward, and visual/zoom checks remain manual verification items; automated model checks are not a substitute for those checks.
