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

  /* Keep complete local indexes reachable on shorter screens without compressing rows. */
  const localIndex = document.querySelector('.article-aside.local-index');
  if (localIndex) {
    const fitLocalIndex = () => {
      localIndex.style.removeProperty('top');
      if (window.matchMedia('(max-width: 900px)').matches) return;
      const normalTop = parseFloat(getComputedStyle(localIndex).top);
      const availableTop = window.innerHeight - localIndex.getBoundingClientRect().height - 16;
      localIndex.style.top = Math.min(normalTop, availableTop) + 'px';
    };
    new ResizeObserver(fitLocalIndex).observe(localIndex);
    window.addEventListener('resize', fitLocalIndex, { passive: true });
    fitLocalIndex();
  }

  const heroEl = document.querySelector('.hero');
  if (heroEl) requestAnimationFrame(() => heroEl.classList.add('in'));

  /* scroll reveal — each element fires once, then stops being observed; a slight scroll
     up/down after that can never re-trigger it */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));

  /* Reveal complete blocks already on screen, even when a long article cannot
     meet the observer's percentage threshold. Keep lower blocks scroll-triggered. */
  const revealInitialViewport = () => {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll('.reveal:not(.in)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < viewportHeight) {
        el.classList.add('in');
        io.unobserve(el);
      }
    });
  };
  const queueInitialReveal = () => requestAnimationFrame(revealInitialViewport);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', queueInitialReveal, { once: true });
  } else {
    queueInitialReveal();
  }
  // Recheck after images/fonts settle; the first pass never waits for them.
  window.addEventListener('load', queueInitialReveal, { once: true });

  const pharmaContext = (() => {
    const path = location.pathname.replace(/\.html$/, '').replace(/\/$/, '');
    const details = {
      '/pharma/services/conceptual-basic-design':['services','feasibility-consulting-planning'], '/pharma/services/detailed-engineering':['services','engineering-design'],
      '/pharma/services/process-clean-utilities':['services','strategic-procurement'], '/pharma/services/cleanroom-hvac':['services','project-construction-management'],
      '/pharma/services/commissioning-qualification':['services','commissioning-qualification-validation'], '/pharma/services/gmp-compliance-validation':['services','gmp-upgrades-optimization'],
      '/pharma/expertise/gmp-regulatory-strategy':['expertise','gmp-regulatory-compliance'], '/pharma/expertise/advanced-cleanroom-contamination-control':['expertise','advanced-cleanroom-contamination-control'],
      '/pharma/expertise/process-manufacturing-technologies':['expertise','process-manufacturing-technologies'], '/pharma/expertise/science-led-risk-based-cqv':['expertise','risk-based-qualification'],
      '/pharma/expertise/gmp-upgrade-facility-modernization':['expertise','facility-upgrades-modernization'], '/pharma/expertise/lifecycle-verification-astm-e2500':['expertise','lifecycle-verification'],
      '/pharma/expertise/containment-high-potent-compounds':['expertise','hpapi-containment'], '/pharma/expertise/data-integrity-digital-solutions':['expertise','data-integrity-digital-compliance']
    };
    if (details[path]) return details[path];
    if (path.startsWith('/pharma/industries/')) return ['industries', path.split('/').pop()];
    if (path === '/pharma/services-build') return ['services','services'];
    if (path === '/pharma/expertise-build') return ['expertise','expertise'];
    if (path === '/pharma/industries-build') return ['industries','industries'];
    return ['general','general'];
  })();
  if (!location.pathname.startsWith('/pharma/contact')) document.querySelectorAll('a[href^="/pharma/contact"]').forEach(link => {
    const url = new URL(link.getAttribute('href'), location.origin);
    url.searchParams.set('category', pharmaContext[0]); url.searchParams.set('interest', pharmaContext[1]); url.searchParams.set('source', location.pathname);
    url.searchParams.set('origin', link.closest('header') ? 'header' : link.closest('footer') ? 'footer' : 'page-cta');
    link.setAttribute('href', url.pathname + url.search);
  });

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
