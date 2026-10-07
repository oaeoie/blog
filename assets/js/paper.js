/* retro-paper — 테마 · 목차 · 맨 위로 */
(function () {
  'use strict';

  /* ---------- 테마 전환 ---------- */
  var TKEY = 'paper-theme';
  function toggleTheme() {
    var cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    var next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem(TKEY, next); } catch (e) {}
  }
  var tbtn = document.getElementById('theme-btn');
  if (tbtn) tbtn.addEventListener('click', toggleTheme);

  /* ---------- 목차 만들기 ---------- */
  function buildToc() {
    var nav = document.getElementById('toc-inline-nav');
    if (!nav) return;
    var content = document.getElementById('post-content');
    if (!content) return;

    var heads = content.querySelectorAll('h2, h3');
    var empty = document.getElementById('toc-inline-empty');
    if (!heads.length) {
      if (empty) empty.style.display = '';
      return;
    }
    if (empty) empty.style.display = 'none';

    var frag = document.createDocumentFragment();
    Array.prototype.forEach.call(heads, function (h, i) {
      if (!h.id) {
        h.id = 'h-' + i + '-' + ((h.textContent || '').trim().slice(0, 20).replace(/\s+/g, '-').replace(/[^\w가-힣-]/g, '').toLowerCase() || i);
      }
      var li = document.createElement('li');
      if (h.tagName === 'H3') li.className = 'lv3';
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = (h.textContent || '').trim();
      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        var t = document.getElementById(h.id);
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      li.appendChild(a);
      frag.appendChild(li);
    });
    nav.appendChild(frag);
  }

  /* ---------- 맨 위로 ---------- */
  var top = document.getElementById('totop');
  if (top) {
    window.addEventListener('scroll', function () {
      top.classList.toggle('on', window.scrollY > 400);
    }, { passive: true });
    top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 본문 밖 링크는 새 창 ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (a.target === '_blank') return;
    if (/^https?:\/\//i.test(href) && a.hostname && a.hostname !== location.hostname) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildToc);
  } else {
    buildToc();
  }
})();
