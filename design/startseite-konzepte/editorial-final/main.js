// Startseite Editorial (final): Navigation, Einblenden beim Scrollen, Podcast-Laufband
const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile Navigation
const toggle = document.querySelector('.nav-toggle');
let navTimer;
const setNav = open => {
  // Übergänge nur beim Umschalten, sonst blitzt das Menü beim Wechsel der Fensterbreite auf
  root.classList.add('nav-anim');
  clearTimeout(navTimer);
  navTimer = setTimeout(() => root.classList.remove('nav-anim'), 400);
  root.classList.toggle('nav-open', open);
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
};
if (toggle) {
  toggle.addEventListener('click', () => setNav(!root.classList.contains('nav-open')));
  document.querySelectorAll('.main-nav a').forEach(a => a.addEventListener('click', () => setNav(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && root.classList.contains('nav-open')) { setNav(false); toggle.focus(); }
  });
  matchMedia('(min-width: 1001px)').addEventListener('change', e => { if (e.matches) setNav(false); });
}

// Header bekommt eine Linie, sobald gescrollt wird
const onScroll = () => root.classList.toggle('scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Elemente blenden ein, wenn sie ins Bild kommen
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  entry.target.classList.add('is-in');
  revealObserver.unobserve(entry.target);
}), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// Endloses Laufband für die Podcast-Cover; pausiert bei Hover und Fokus
document.querySelectorAll('[data-marquee]').forEach(wrap => {
  const track = wrap.querySelector('.marquee-track');
  [...track.children].forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.alt = '';
    track.append(clone);
  });
  if (reduceMotion) { wrap.style.overflowX = 'auto'; return; }
  const speed = Number(wrap.dataset.marquee) || 40;
  let offset = 0, paused = false, last = performance.now();
  const tick = now => {
    const dt = Math.min(now - last, 100) / 1000;
    last = now;
    if (!paused) offset += speed * dt;
    const loop = (track.scrollWidth + (parseFloat(getComputedStyle(track).columnGap) || 0)) / 2;
    track.style.transform = `translate3d(${-(offset % loop)}px, 0, 0)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  wrap.addEventListener('mouseenter', () => { paused = true; });
  wrap.addEventListener('mouseleave', () => { paused = false; });
});
