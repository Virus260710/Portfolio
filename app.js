/* Shared behaviour: navbar, mobile menu, sliders, scroll reveal */
(function () {
  'use strict';

  /* ---- Navbar scroll state ---- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => links.classList.remove('open'))
    );
    document.addEventListener('click', (e) => {
      if (!links.contains(e.target) && e.target !== toggle) links.classList.remove('open');
    });
  }

  /* ---- Image sliders (auto-wire dots, buttons, autoplay) ---- */
  document.querySelectorAll('[data-slider]').forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const dotsWrap = slider.querySelector('.dots');
    const prev = slider.querySelector('.nav.prev');
    const next = slider.querySelector('.nav.next');
    if (!slides.length) return;

    let idx = slides.findIndex((s) => s.classList.contains('active'));
    if (idx < 0) idx = 0;

    // build dots
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

    // autoplay (pause on hover)
    let timer = null;
    function arm() { if (slides.length > 1) timer = setInterval(() => go(idx + 1), 4500); }
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
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((r) => io.observe(r));
  } else {
    reveals.forEach((r) => r.classList.add('in'));
  }
})();
