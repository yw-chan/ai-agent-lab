/* Agent Lab shared helpers. Every number here is an illustrative estimate, not a real tokenizer or price list. */
(function () {
  const CJK = /[　-〿㐀-䶿一-鿿豈-﫿＀-￯]/g;

  // Rough token estimate: CJK ~1.2 token per char, other text ~1 token per 3.6 chars.
  function tokens(text) {
    if (!text) return 0;
    const s = String(text);
    const cjk = (s.match(CJK) || []).length;
    const rest = s.length - cjk;
    return Math.ceil(cjk * 1.2 + rest / 3.6);
  }

  // Illustrative prices, USD per 1M tokens (a mid-tier model). Change here, every page follows.
  const PRICE = { input: 3, output: 15, cacheWrite: 3.75, cacheRead: 0.3 };

  function cost(u) {
    return ((u.input || 0) * PRICE.input + (u.output || 0) * PRICE.output +
      (u.cacheWrite || 0) * PRICE.cacheWrite + (u.cacheRead || 0) * PRICE.cacheRead) / 1e6;
  }

  const fmt = n => Math.round(n).toLocaleString('en-US');
  const usd = n => '$' + (n < 0.01 ? n.toFixed(4) : n.toFixed(3));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Pretty JSON with syntax colouring. Strings longer than `clip` are shortened for display.
  function jsonHTML(obj, opts = {}) {
    const clip = opts.clip || 160;
    const text = JSON.stringify(obj, (k, v) => (typeof v === 'string' && v.length > clip ? v.slice(0, clip) + '…' : v), 2);
    return esc(text).replace(/(&quot;(?:\\.|[^&\\]|&(?!quot;))*?&quot;)(\s*:)?|\b(true|false|null)\b|(-?\b\d+(?:\.\d+)?\b)/g,
      (m, str, colon, bool, num) => {
        if (str) return colon ? `<span class="k">${str}</span>${colon}` : `<span class="s">${str}</span>`;
        if (bool) return `<span class="b">${bool}</span>`;
        return `<span class="n">${num}</span>`;
      });
  }

  // Stacked bar + legend. segs: [{label, value, color}] ; color is a CSS value such as 'var(--seg-system)'.
  function bar(container, segs, opts = {}) {
    const total = opts.total || segs.reduce((a, s) => a + s.value, 0) || 1;
    container.innerHTML =
      `<div class="tbar" role="img" aria-label="${esc(segs.map(s => s.label + ' ' + fmt(s.value)).join('，'))}">` +
      segs.map(s => `<i style="width:${(s.value / total) * 100}%;background:${s.color}" title="${esc(s.label)}：${fmt(s.value)}"></i>`).join('') +
      `</div><div class="legend" style="margin-top:6px">` +
      segs.map(s => `<span style="--c:${s.color}">${esc(s.label)} ${fmt(s.value)}</span>`).join('') + `</div>`;
  }

  const store = {
    get(k, d) { try { const v = localStorage.getItem('lab-' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('lab-' + k, JSON.stringify(v)); } catch {} }
  };

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  // remember which pages were opened, so the index can show progress
  try {
    const page = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');
    const seen = store.get('visited', {});
    seen[page] = Date.now();
    store.set('visited', seen);
  } catch {}

  window.Lab = { tokens, PRICE, cost, fmt, usd, esc, jsonHTML, bar, store, $, $$ };
})();
