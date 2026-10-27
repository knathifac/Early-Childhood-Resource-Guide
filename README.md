# Early Childhood Resource Guide

A functional, low-fidelity wireframe in HTML, CSS, and vanilla JavaScript, now presented as **two polished visual design concepts** that share the same wireframe structure, content, navigation, and functionality.

The root `index.html` is a neutral **concept selector** that links to both.

## Design concepts

Both concepts share the same pages, navigation, resource data, search, and progressive filtering flow, and differ in visual presentation (typography, color, spacing, card and button styling, borders, tone).

- **COA 1 — Vanderbilt Concept** (`/vandy/`): An institutional, editorial, Vanderbilt-*style* presentation (serif display headings, black header, gold accents). It intentionally resembles a modern university web aesthetic but contains **no Vanderbilt branding, logos, seals, wordmarks, or official identity**, and does not claim to be an official Vanderbilt site.
- **COA 2 — Warm & Child-Centered** (`/independent/`): A distinct, warmer standalone identity (teal/coral/golden-yellow/sage palette, rounded cards, friendly humanist type) that stays professional and research-appropriate.

## Structure

```
index.html              Concept selector (root)
vandy/                  COA 1 pages (index, resources, resource, about)
independent/            COA 2 pages (index, resources, resource, about)
css/
  base.css              Shared layout, components, responsive rules (theme-agnostic, CSS variables)
  vandy.css             COA 1 theme (colors, fonts, borders, accents)
  independent.css       COA 2 theme (colors, fonts, borders, accents)
  selector.css          Neutral styling for the root selector page
assets/
  app.js                Shared homepage, listing, and detail UI
  model.js              Data/filter/URL-state logic
  styles.css            Original wireframe stylesheet (original root pages)
data/resources.json     15 sample resources + taxonomy + optional featured flag
tests/model.test.mjs    Logic tests (run with Node 18+: `node tests/model.test.mjs`)
```

The original wireframe pages (`resources.html`, `resource.html`, `about.html`) remain at the root in their original styling and use the shared directory logic.

## Running locally

Serve the folder over HTTP (the app fetches `data/resources.json`):

```
python -m http.server 8000
```

Then open http://localhost:8000/ and pick a concept. Compatible with GitHub Pages.

## Revised browsing flow

Both concept homepages offer a welcome, search, collapsed **Advanced Search** with all five existing filter groups, **Browse All Resources**, and three compact featured cards. Search and browse use the same `resources.html` listing within the current concept. An unfiltered visit starts with filters collapsed; links containing filters open them so the audience and other choices are visible. Active chips, Clear all, empty-result recovery, title sorting, browser Back/Forward, and details return links preserve the browsing flow. Audience remains an editable filter; this project has no separate audience-path navigation.

The institutional concept retains its black/gold/cream palette, serif headings, and squared cards without official university branding. The independent concept retains its teal/warm palette, rounded cards, and friendly typography. No backend or dependencies were added.

### Updating resources

Edit `data/resources.json`; both concepts use this one file. Keep a unique stable `id`, title, summary, description, metadata arrays using keys from `taxonomy`, and the existing materials/sample fields. Preserve verified links and attribution. Add a new taxonomy key/label in its existing group when needed; filter options are generated automatically.

Set `"featured": true` on a resource to include it in Featured Resources. The homepage shows the first three featured entries in JSON order; **View all featured resources** opens `resources.html?featured=1`. Current selections are provisional examples (one per topic), pending team/client approval. Omit the flag or set it to false to remove an entry.

**Recently Added** is omitted because no actual added dates exist (`lastReviewed` is null and is not an added date). To enable it later, supply verified `dateAdded` dates (ISO `YYYY-MM-DD`) and implement newest-first selection/sorting from that field; do not use file order or review dates as substitutes. **Most Popular** is omitted because the project has no usage data; it would require a defined popularity metric and real usage counts.

### Verification

Run `node tests/model.test.mjs` with Node 18+ for search, filter combinations, sorting, featured URL state, data validation, and safe material links. Node is only needed for tests, not hosting.

For a browser smoke test, run `python3 -m http.server 8000`, open `http://localhost:8000/`, and check both concepts: submit a search, expand/collapse advanced filters, choose an audience/language, clear selections, try an unmatched query and reset, open a card and return, and use Browse All Resources. Check phone (375px), tablet (768px), and desktop widths with keyboard navigation.

To simulate a GitHub Pages repository prefix, serve the parent folder: `python3 -m http.server 8001 --directory ..` and open `http://localhost:8001/Early-Childhood-Resource-Guide/`. Page/asset links are relative; shared data is fetched relative to `assets/app.js` using `import.meta.url`, so neither concept assumes the domain root.
