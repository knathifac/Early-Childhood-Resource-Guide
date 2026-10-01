import { facets, validateData, readState, writeState, labels, selectResources, safeMaterialURL } from './model.js';
const $ = selector => document.querySelector(selector);
function el(tag, text, className) { const node = document.createElement(tag); if (text) node.textContent = text; if (className) node.className = className; return node; }
function link(text, href, className) { const a = el('a', text, className); a.href = href; return a; }
const mobile = window.matchMedia('(max-width: 760px)');
const menu = $('#menu-toggle');
const nav = $('#navigation');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); nav.hidden = mobile.matches; }
function syncMenu() { menu.hidden = !mobile.matches; closeMenu(); }
syncMenu();
mobile.addEventListener('change', syncMenu);
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.hidden = !open; });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && mobile.matches && !nav.hidden) { closeMenu(); menu.focus(); } });
const page = document.body.dataset.page;
async function load() {
  const status = $('#data-state');
  status.replaceChildren(el('p', 'Loading demonstration resources…'));
  try {
    const response = await fetch(new URL('../data/resources.json', import.meta.url));
    if (!response.ok) throw new Error('Unable to fetch data');
    const data = validateData(await response.json());
    if (page === 'resources') directory(data); else detail(data);
    status.replaceChildren();
  } catch {
    status.replaceChildren(el('h2', 'Resources could not be loaded'), el('p', 'Check your connection and try again. For a local preview, serve this folder over HTTP. If the problem continues, check data/resources.json for valid resource data.'));
    const retry = el('button', 'Retry loading resources'); retry.type = 'button'; retry.addEventListener('click', load); status.append(retry);
  }
}
function directory({ resources, taxonomy }) {
  let state = readState(location.search, taxonomy);
  const filters = $('#filters'); filters.replaceChildren();
  for (const [key, label] of Object.entries(facets)) {
    const group = el('fieldset'); group.append(el('legend', label));
    for (const [value, title] of Object.entries(taxonomy[key])) {
      const row = el('label', '', 'check-label'); const box = el('input'); box.type = 'checkbox'; box.name = key; box.value = value;
      box.addEventListener('change', () => { state[key] = [...filters.querySelectorAll(`input[name="${key}"]:checked`)].map(input => input.value); update(); });
      row.append(box, document.createTextNode(title)); group.append(row);
    }
    filters.append(group);
  }
  $('#filter-panel').open = !mobile.matches;
  function update(push = true) {
    const query = writeState(state);
    if (push && query !== location.search.slice(1)) history.pushState(null, '', location.pathname + (query ? '?' + query : '') + location.hash);
    $('#query').value = state.q; $('#sort').value = state.sort;
    for (const box of filters.querySelectorAll('input')) box.checked = state[box.name].includes(box.value);
    const selected = selectResources(resources, state, taxonomy);
    $('#result-count').textContent = `${selected.length} of ${resources.length} demonstration resources`;
    const chips = $('#chips'); chips.replaceChildren();
    function chip(text, remove) {
      const button = el('button', `Remove ${text} ×`); button.type = 'button';
      button.addEventListener('click', () => { const index = [...chips.children].indexOf(button); remove(); update(); (chips.children[index] || chips.lastElementChild || $('#clear-all')).focus(); }); chips.append(button);
    }
    if (state.q) chip(`search: ${state.q}`, () => { state.q = ''; });
    for (const [key, label] of Object.entries(facets)) for (const value of state[key]) chip(`${label}: ${taxonomy[key][value]}`, () => { state[key] = state[key].filter(v => v !== value); });
    const results = $('#results'); results.replaceChildren();
    if (!selected.length) {
      const empty = el('div', '', 'panel'); empty.append(el('h2', 'No resources match'), el('p', 'Try a broader search, remove a filter, or clear all selections.'));
      const clear = el('button', 'Clear search and filters'); clear.type = 'button'; clear.addEventListener('click', () => { reset(); $('#query').focus(); }); empty.append(clear); results.append(empty);
    }
    for (const r of selected) {
      const card = el('article', '', 'card'); card.append(el('span', r.isSample ? 'Demonstration resource' : 'Resource', 'sample'), el('h2', r.title), el('p', r.summary));
      const metadata = el('dl'); for (const [key, title] of Object.entries(facets)) metadata.append(el('dt', title), el('dd', labels(r, key, taxonomy))); card.append(metadata);
      const params = new URLSearchParams({ id: r.id }); if (query) params.set('return', query);
      const view = link('View resource', `resource.html?${params}`, 'button'); view.setAttribute('aria-label', `View resource: ${r.title}`); card.append(view); results.append(card);
    }
  }
  function reset() { state = readState('', taxonomy); update(); }
  $('#search-form').addEventListener('submit', event => { event.preventDefault(); state.q = $('#query').value.trim(); update(); });
  $('#sort').addEventListener('change', event => { state.sort = event.target.value; update(); });
  $('#clear-all').addEventListener('click', reset);
  window.addEventListener('popstate', () => { state = readState(location.search, taxonomy); update(false); });
  update(false); $('#directory').hidden = false;
}
function detail({ resources, taxonomy }) {
  const params = new URLSearchParams(location.search);
  const backQuery = writeState(readState(params.get('return') || '', taxonomy));
  $('#back-link').href = 'resources.html' + (backQuery ? '?' + backQuery : '');
  const target = $('#resource-detail'); target.replaceChildren(); target.hidden = false;
  const resource = resources.find(r => r.id === params.get('id'));
  if (!resource) { target.append(el('h1', 'Resource not found'), el('p', 'This link has a missing or unknown resource ID. Browse the directory to choose a demonstration resource.'), link('Browse resources', 'resources.html', 'button')); return; }
  document.title = `${resource.title} | Early Childhood Resource Guide`;
  target.append(el('h1', resource.title));
  if (resource.isSample) target.append(el('p', 'Demonstration resource — not a verified resource. Sample materials are unavailable.', 'notice'));
  target.append(el('p', resource.summary), el('p', resource.description));
  const metadata = el('dl'); for (const [key, title] of Object.entries(facets)) metadata.append(el('dt', title), el('dd', labels(resource, key, taxonomy)));
  metadata.append(el('dt', 'Provider / attribution'), el('dd', resource.provider || 'Not specified'), el('dt', 'Last reviewed'), el('dd', resource.lastReviewed || 'Not reviewed')); target.append(metadata, el('h2', 'How to use this resource'), el('p', resource.instructions || 'Instructions not specified.'), el('h2', 'Materials'));
  const materials = el('ul');
  for (const material of resource.materials || []) {
    const item = el('li'); const url = safeMaterialURL(material.url);
    if (resource.isSample || material.isPlaceholder || !url) item.textContent = `${material.label} — ${resource.isSample || material.isPlaceholder ? 'Sample material — unavailable in this prototype' : 'Material unavailable'}`;
    else item.append(link(`Open ${material.label}`, url));
    materials.append(item);
  }
  if (!materials.children.length) target.append(el('p', 'No materials specified.')); else target.append(materials);
}
if (page === 'resources' || page === 'resource') load();
