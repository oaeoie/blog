/* 검색 — Ghost의 테마 검색 버튼 자리를 대신한다. /index.json(사이트 전체 글) 을 받아
   제목·요약에서 매칭되는 글만 골라 목록으로 보여준다. 외부 라이브러리 없음. */
(function () {
  'use strict';

  var INDEX_URL = document.documentElement.getAttribute('data-search-index');
  if (!INDEX_URL) return;

  var btn = document.getElementById('search-btn');
  var panel = document.getElementById('search-panel');
  var input = document.getElementById('search-input');
  var results = document.getElementById('search-results');
  var closeBtn = document.getElementById('search-close');
  if (!btn || !panel || !input || !results) return;

  var docs = null, loading = false, loaded = false;

  function load() {
    if (loaded || loading) return Promise.resolve(docs || []);
    loading = true;
    return fetch(INDEX_URL).then(function (r) { return r.json(); }).then(function (d) {
      docs = d; loaded = true; loading = false; return d;
    }).catch(function () { loading = false; return []; });
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function render(list, q) {
    if (!q) { results.innerHTML = '<li class="search-hint">한 글자라도 쳐라요.</li>'; return; }
    if (!list.length) { results.innerHTML = '<li class="search-hint">"' + esc(q) + '" 는 없다요…</li>'; return; }
    results.innerHTML = list.map(function (d) {
      return '<li class="search-hit"><a href="' + esc(d.url) + '">' +
        '<span class="search-hit-title">' + esc(d.title) + '</span>' +
        (d.summary ? '<span class="search-hit-sub">' + esc(String(d.summary).slice(0, 90)) + '</span>' : '') +
        '</a></li>';
    }).join('');
  }

  function run(q) {
    q = (q || '').trim().toLowerCase();
    if (!loaded) { load().then(function () { run(q); }); return; }
    var list = !q ? [] : docs.filter(function (d) {
      return (d.title || '').toLowerCase().indexOf(q) > -1 ||
             (d.summary || '').toLowerCase().indexOf(q) > -1 ||
             (d.content || '').toLowerCase().indexOf(q) > -1;
    }).slice(0, 20);
    render(list, q);
  }

  function open() {
    panel.classList.add('open'); panel.removeAttribute('hidden');
    btn.setAttribute('aria-expanded', 'true');
    input.focus();
    load().then(function () { run(input.value); });
  }
  function close() {
    panel.classList.remove('open'); panel.setAttribute('hidden', '');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', function () {
    panel.classList.contains('open') ? close() : open();
  });
  if (closeBtn) closeBtn.addEventListener('click', close);
  input.addEventListener('input', function () { run(input.value); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  var a = results.querySelector('a');
  results.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  if (a) a.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
