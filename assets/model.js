export const facets = { topics: 'Topic', ageGroups: 'Age group', languages: 'Language', audiences: 'Audience', formats: 'Format' };
export function validateData(data) {
  if (!data || !data.taxonomy || !Array.isArray(data.resources)) throw new Error('Invalid collection');
  for (const key of Object.keys(facets)) {
    const taxonomy = data.taxonomy[key];
    if (!taxonomy || typeof taxonomy !== 'object' || Array.isArray(taxonomy) || !Object.entries(taxonomy).every(([id, label]) => /^[a-z0-9-]+$/.test(id) && typeof label === 'string' && label.trim())) throw new Error('Invalid taxonomy');
  }
  const ids = new Set();
  for (const r of data.resources) {
    if (!r || !['id', 'title', 'summary', 'description'].every(k => typeof r[k] === 'string' && r[k].trim()) || !/^[a-z0-9-]+$/.test(r.id) || ids.has(r.id)) throw new Error('Invalid resource');
    ids.add(r.id);
    for (const key of Object.keys(facets)) {
      if (r[key] != null && (!Array.isArray(r[key]) || !r[key].every(v => Object.hasOwn(data.taxonomy[key], v)))) throw new Error('Unknown metadata');
    }
    if (typeof r.isSample !== 'boolean' || (r.materials != null && (!Array.isArray(r.materials) || !r.materials.every(m => m && typeof m.label === 'string' && typeof m.isPlaceholder === 'boolean' && (m.url == null || typeof m.url === 'string'))))) throw new Error('Invalid materials');
  }
  return data;
}
export function readState(search, taxonomy) {
  const params = new URLSearchParams(search);
  const state = { q: (params.get('q') || '').trim(), sort: params.get('sort') === 'desc' ? 'desc' : 'asc' };
  for (const key of Object.keys(facets)) state[key] = [...new Set(params.getAll(key).filter(v => Object.hasOwn(taxonomy[key], v)))];
  return state;
}
export function writeState(state) {
  const params = new URLSearchParams();
  if (state.q) params.set('q', state.q);
  for (const key of Object.keys(facets)) for (const value of state[key]) params.append(key, value);
  if (state.sort === 'desc') params.set('sort', 'desc');
  return params.toString();
}
export function labels(resource, key, taxonomy) { return (resource[key] || []).map(v => taxonomy[key][v]).join(', ') || 'Not specified'; }
export function selectResources(resources, state, taxonomy) {
  const words = state.q.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return resources.filter(r => {
    const haystack = [r.title, r.summary, r.description, ...Object.keys(facets).map(k => labels(r, k, taxonomy))].join(' ').toLocaleLowerCase();
    return words.every(w => haystack.includes(w)) && Object.keys(facets).every(k => !state[k].length || state[k].some(v => (r[k] || []).includes(v)));
  }).sort((a, b) => (state.sort === 'desc' ? -1 : 1) * a.title.localeCompare(b.title, 'en') || a.id.localeCompare(b.id, 'en'));
}
export function safeMaterialURL(value) {
  if (typeof value !== 'string' || !value.trim() || /[\u0000-\u0020\\]/.test(value) || value.startsWith('//')) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return /^https?:\/\//i.test(value) ? value : null;
  return value.startsWith('/') ? null : value;
}
