/* Shared behaviour: topbar state, mobile menu, sliders, scroll reveal */
(function () {
  'use strict';

  /* ---- Topbar scroll state ---- */
  const bar = document.querySelector('.topbar');
  const onScroll = () => {
    if (!bar) return;
    bar.classList.toggle('scrolled', window.scrollY > 16);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  const btn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => nav.classList.remove('open'))
    );
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && e.target !== btn) nav.classList.remove('open');
    });
  }

  /* ---- Image sliders (auto-wire dots, buttons, autoplay) ---- */
  document.querySelectorAll('[data-slider]').forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const dotsWrap = slider.querySelector('.dots');
    const prev = slider.querySelector('.ctrl.prev');
    const next = slider.querySelector('.ctrl.next');
    if (slides.length <= 1) {
      // hide controls when there's nothing to page through
      [prev, next].forEach((el) => el && (el.style.display = 'none'));
      return;
    }

    let idx = slides.findIndex((s) => s.classList.contains('active'));
    if (idx < 0) idx = 0;

    const dots = slides.map((_, i) => {
      const d = document.createElement('span');
      d.className = 'dot' + (i === idx ? ' active' : '');
      d.addEventListener('click', () => go(i, true));
      dotsWrap && dotsWrap.appendChild(d);
      return d;
    });

    function render() {
      slides.forEach((s, i) => s.classList.toggle('active', i === idx));
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }
    function go(i, stop) {
      idx = (i + slides.length) % slides.length;
      render();
      if (stop) rearm();
    }
    prev && prev.addEventListener('click', () => go(idx - 1, true));
    next && next.addEventListener('click', () => go(idx + 1, true));

    let timer = null;
    function arm() { timer = setInterval(() => go(idx + 1), 4800); }
    function rearm() { clearInterval(timer); arm(); }
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', arm);
    arm();
  });

  /* ---- Scroll reveal ---- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((r) => io.observe(r));
  } else {
    reveals.forEach((r) => r.classList.add('in'));
  }
})();
