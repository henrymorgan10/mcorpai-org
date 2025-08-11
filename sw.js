/* sw.js — ReliefWeb v2 latest headline cache (7-day window)
   - Stale‑While‑Revalidate for /rw/latest.json
   - Exponential backoff with jitter
   - Optional Background Sync / Periodic Sync
   - Message trigger: postMessage({type:'RW_UPDATE_NOW'}) from page
*/

const RW_API = 'https://api.reliefweb.int/v2/reports';
const APP = 'mcorpai';
const CACHE_NAME = 'rw-cache-v1';
const LATEST_PATH = '/rw/latest.json'; // virtual endpoint served by this SW
const MAX_AGE_MS = 10 * 60 * 1000;     // serve cache up to 10 minutes as fresh
const MIN_REFRESH_SPACING = 2 * 60 * 1000; // don't hammer API if called too often

let lastRefreshAt = 0;

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// ---- ReliefWeb helpers ----
function sevenDaysAgoISO(){
  return new Date(Date.now() - 7*24*60*60*1000).toISOString();
}

const basePayload = {
  limit: 1,
  preset: 'latest',
  profile: 'list',
  slim: 1,
  fields: { include: ['title','primary_country.name','date.created','url'] }
};

function buildBodies(){
  const since = sevenDaysAgoISO();
  const commonFilter = { operator:'AND', conditions:[ { field:'date.created', range:{ from: since } } ] };
  const refugee = {
    ...basePayload,
    filter: { ...commonFilter, conditions:[...commonFilter.conditions, { operator:'OR', conditions:[{ field:'theme.name', value:['Refugees','IDPs','Protection'] }] }] },
    query: { value: 'refugee OR displacement' }
  };
  const weather = {
    ...basePayload,
    filter: { ...commonFilter, conditions:[...commonFilter.conditions, { operator:'OR', conditions:[{ field:'theme.name', value:['Natural Disasters','Climate Change and Environment'] }] }] },
    query: { value:[
      'flood','cyclone','hurricane','storm','heatwave','"heat wave"',
      'wildfire','drought','landslide','earthquake','tsunami','typhoon','monsoon','blizzard','"cold wave"'
    ].join(' OR ') }
  };
  return { refugee, weather };
}

async function rwPost(body, signal){
  const url = RW_API + '?appname=' + encodeURIComponent(APP);
  const r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body), signal });
  if(!r.ok) throw new Error('RW bad status');
  const j = await r.json();
  return j && j.data && j.data[0] && j.data[0].fields ? j.data[0].fields : null;
}

function pickLatest(a,b){
  const ta = a && a.date && (a.date.created || a.date.original || a.date.changed);
  const tb = b && b.date && (b.date.created || b.date.original || b.date.changed);
  return (new Date(ta||0) >= new Date(tb||0)) ? a : b;
}

function ago(iso){
  if(!iso) return '';
  const s = (Date.now() - new Date(iso).getTime())/1000;
  if(s < 90) return '· just now';
  const m = Math.floor(s/60); if(m < 60) return `· ${m} min ago`;
  const h = Math.floor(m/60); if(h < 24) return `· ${h} h ago`;
  const d = Math.floor(h/24); return `· ${d} d ago`;
}

function cleanTitle(t){
  return (t||'').replace(/\s+/g,' ').replace(/^\[.*?\]\s*/, '')
    .replace(/\s*\|\s*ReliefWeb.*$/i, '').replace(/\s+-\s+ReliefWeb.*$/i, '').trim();
}

async function fetchLatestWithBackoff(maxRetries = 3){
  const baseDelay = 800; // ms
  for(let attempt=0; attempt<=maxRetries; attempt++){
    try{
      const ctrl = new AbortController();
      const timeout = setTimeout(()=>ctrl.abort(), 9000);
      const { refugee, weather } = buildBodies();
      const [r1, r2] = await Promise.all([ rwPost(refugee, ctrl.signal), rwPost(weather, ctrl.signal) ]);
      clearTimeout(timeout);
      if(!r1 && !r2) throw new Error('empty both');
      const pick = !r1 ? r2 : (!r2 ? r1 : pickLatest(r1, r2));
      const iso = pick && pick.date && (pick.date.created || pick.date.original || pick.date.changed);
      const payload = {
        where: pick && pick.primary_country && pick.primary_country.name || 'Multiple countries',
        title: cleanTitle(pick && pick.title || ''),
        iso: iso || '',
        ago: ago(iso),
        link: pick && pick.url || '#',
        updatedAt: new Date().toISOString()
      };
      return payload;
    }catch(e){
      if(attempt === maxRetries) throw e;
      const jitter = Math.random()*250;
      const delay = Math.pow(2, attempt) * baseDelay + jitter;
      await new Promise(res=> setTimeout(res, delay));
    }
  }
}

async function putLatestToCache(obj){
  const cache = await caches.open(CACHE_NAME);
  const headers = new Headers({ 'Content-Type':'application/json', 'Cache-Control':'no-store', 'X-SW-Cached':'1', 'Date': new Date().toUTCString() });
  const res = new Response(JSON.stringify(obj), { status:200, headers });
  await cache.put(LATEST_PATH, res.clone());
}

async function getCachedLatest(){
  const cache = await caches.open(CACHE_NAME);
  const res = await cache.match(LATEST_PATH);
  return res || null;
}

async function updateLatest(force=false){
  const now = Date.now();
  if(!force && now - lastRefreshAt < MIN_REFRESH_SPACING) return null;
  lastRefreshAt = now;
  try{
    const latest = await fetchLatestWithBackoff(3);
    await putLatestToCache(latest);
    notifyClients({ type:'RW_UPDATED', meta:{ when: Date.now() } });
    return latest;
  }catch(e){
    // keep silence; consumers will fall back to cache
    return null;
  }
}

async function swrLatestResponse(){
  // Stale‑While‑Revalidate: return cache immediately (if any), then kick off update
  const cached = await getCachedLatest();
  updateLatest(false); // fire and forget
  if(cached){
    // If too old, hint consumers by custom header (optional)
    try{
      const dateHeader = cached.headers.get('Date');
      if(dateHeader && (Date.now() - new Date(dateHeader).getTime() > MAX_AGE_MS)){
        // stale but served; page may show subtle indicator if desired
      }
    }catch(_){}
    return cached;
  }
  // No cache yet → fetch, cache, return
  const latest = await updateLatest(true);
  if(latest){
    const cache = await caches.open(CACHE_NAME);
    return (await cache.match(LATEST_PATH)) || new Response(JSON.stringify(latest), { headers:{'Content-Type':'application/json'} });
  }
  // ultimate fallback payload
  const fallback = { where:'Global', title:'Monitoring displacement and climate-related disruptions.', iso:'', ago:'', link:'#', updatedAt:new Date().toISOString() };
  return new Response(JSON.stringify(fallback), { headers:{'Content-Type':'application/json'} });
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if(url.pathname === LATEST_PATH){
    event.respondWith(swrLatestResponse());
    return;
  }
  // pass-through for everything else
});

// One-off background sync (Chrome/Edge/Android)
self.addEventListener('sync', (event) => {
  if(event.tag === 'rw-sync'){
    event.waitUntil(updateLatest(true));
  }
});

// Periodic Background Sync (where supported)
self.addEventListener('periodicsync', (event) => {
  if(event.tag === 'rw-periodic'){
    event.waitUntil(updateLatest(false));
  }
});

// Message channel from page
self.addEventListener('message', (event) => {
  const data = event.data || {};
  if(data.type === 'RW_UPDATE_NOW'){
    event.waitUntil(updateLatest(true));
  }
});

async function notifyClients(msg){
  try{
    const clis = await self.clients.matchAll({ includeUncontrolled:true, type:'window' });
    clis.forEach(c => { try{ c.postMessage(msg); }catch(_){ /* ignore */ } });
  }catch(_){/* ignore */}
}
