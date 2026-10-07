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

  /* ---------- 전광판 ---------- */
  /* data/marquee.yaml 목록에서 무작위로 하나 뽑아, 칸 오른쪽 바깥 → 왼쪽 바깥까지 흘려보낸다.
     이동 거리는 '칸 폭 + 글자 폭' 이므로 JS 로 실측해 --dist 에 박는다.
     translateX(100%) 같은 퍼센트는 글자 '자기 폭' 기준이라 칸 폭이 안 들어가고,
     그래서 글자가 칸 한가운데에서 툭 튀어나온 것처럼 보였다. */
  var MS_PER_PX = 14;   /* 흐르는 속도 — 클수록 느리다 (약 70px/s) */

  function runMarquee() {
    var box = document.querySelector('.ticker');
    var data = document.getElementById('marquee-data');
    if (!box || !data) return;
    var list;
    try { list = JSON.parse(data.textContent); } catch (e) { return; }
    if (!list || !list.length) return;
    var span = box.querySelector('span');
    if (!span) return;

    span.textContent = ' ' + list[Math.floor(Math.random() * list.length)] + ' ';

    function fit() {
      var dist = box.clientWidth + span.offsetWidth;
      span.style.setProperty('--dist', (-dist) + 'px');
      span.style.setProperty('--dur', (dist * MS_PER_PX / 1000) + 's');
      span.classList.remove('rolling');
      void span.offsetWidth;   /* 리플로우 강제 — 애니메이션을 처음부터 다시 시작시킨다 */
      span.classList.add('rolling');
    }

    /* 웹폰트가 늦게 붙으면 글자 폭이 달라져 거리 계산이 틀어진다 */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fit).catch(fit);
    } else {
      fit();
    }

    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(fit, 200); }, { passive: true });
  }

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

  runMarquee();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildToc);
  } else {
    buildToc();
  }
})();
