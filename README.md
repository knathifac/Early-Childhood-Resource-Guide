# Early Childhood Resource Guide

A functional, low-fidelity wireframe in HTML, CSS, and vanilla JavaScript, now presented as **two polished visual design concepts** that share the same wireframe structure, content, navigation, and functionality.

The root `index.html` is a neutral **concept selector** that links to both.

## Design concepts

Both concepts use the identical wireframe — same pages, navigation, resource data, search, and filters — and differ only in visual presentation (typography, color, spacing, card and button styling, borders, tone).

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
  app.js                UI logic (unchanged)
  model.js              Data/filter/URL-state logic (unchanged)
  styles.css            Original wireframe stylesheet (original root pages)
data/resources.json     15 sample resources + taxonomy (unchanged)
tests/model.test.mjs    Logic tests (run with Node 18+: `node tests/model.test.mjs`)
```

The original wireframe pages (`resources.html`, `resource.html`, `about.html`) remain at the root in their original styling as the source-of-truth reference.

## Running locally

Serve the folder over HTTP (the app fetches `data/resources.json`):

```
python -m http.server 8000
```

Then open http://localhost:8000/ and pick a concept. Compatible with GitHub Pages.
