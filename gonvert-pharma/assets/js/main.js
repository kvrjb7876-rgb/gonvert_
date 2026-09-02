/* GONVERT Pharma Technology — shared page behavior (same system as GONVERT Renewable Energy) */
(function () {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  window.scrollTo(0, 0);
  window.addEventListener('load', () => window.scrollTo(0, 0));

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open'); toggle.classList.remove('open'); toggle.setAttribute('aria-expanded', false);
    }));
  }

  const heroEl = document.querySelector('.hero');
  if (heroEl) requestAnimationFrame(() => heroEl.classList.add('in'));

  /* scroll reveal — each element fires once, then stops being observed; a slight scroll
     up/down after that can never re-trigger it */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));

  /* elegant page-to-page transition — fade + drift + a whisper of blur out, mirrored on
     entrance via pure CSS (no FOUC — the animation is set before any JS can run).
     Rapid clicks are safe: classList.add is idempotent and each click re-arms its own
     timer, so the very last click wins and there is nothing to "stack". */
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http') || a.target === '_blank') return;
    if (prefersReduced) { window.location.href = href; return; }
    e.preventDefault();
    document.body.classList.add('pt-exit');
    setTimeout(() => { window.location.href = href; }, 190);
  });

  /* ================= TYPEWRITER =================
     Deterministic, one-shot per element, grouped by their shared card grid so siblings
     stagger together. A per-element "twDone" guard means even a duplicate trigger
     (there shouldn't be one — each container is unobserved immediately after firing)
     can never restart or double-run the animation. Reduced-motion shows the final text
     instantly, no motion, no timers. */
  const typeTargets = document.querySelectorAll('[data-typewriter]');
  if (typeTargets.length) {
    const charDelay = (ch) => {
      if (ch === ' ') return 15 + Math.random() * 10;
      if (/[.,;:!?]/.test(ch)) return 80 + Math.random() * 50;
      return 30 + Math.random() * 15;
    };
    const typeOne = (el) => {
      if (el.dataset.twDone === '1') return;
      el.dataset.twDone = '1';
      const full = el.textContent;
      if (prefersReduced) { el.textContent = full; return; }
      el.textContent = '';
      let i = 0;
      const step = () => {
        i++;
        el.textContent = full.slice(0, i);
        if (i < full.length) setTimeout(step, charDelay(full[i - 1]));
      };
      step();
    };
    const containers = new Set();
    typeTargets.forEach(el => containers.add(el.closest('.grid-5, .svc-grid') || el.parentElement));
    const twIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        twIo.unobserve(entry.target);
        const group = Array.from(entry.target.querySelectorAll('[data-typewriter]'));
        group.forEach((el, i) => setTimeout(() => typeOne(el), i * 90));
      });
    }, { threshold: 0.3 });
    containers.forEach(c => twIo.observe(c));
  }

  /* ================= HERO MEDIA =================
     Safe no-op today (no <video> is present on either site yet — the technical grid
     panel is the permanent poster/fallback). The moment a real <video class="hero-video">
     with a source is added, this activates it with a soft crossfade over the fallback. */
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo && !prefersReduced) {
    const reveal = () => heroVideo.classList.add('is-ready');
    if (heroVideo.readyState >= 3) reveal();
    else heroVideo.addEventListener('canplaythrough', reveal, { once: true });
    heroVideo.play().catch(() => {});
  }

  const flowRow = document.getElementById('flowRow');
  if (flowRow) {
    const steps = flowRow.querySelectorAll('.flow-step');
    const flowIo = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          steps.forEach((s, i) => setTimeout(() => s.classList.add('in'), i * 160));
          flowIo.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    flowIo.observe(flowRow);
  }
})();
