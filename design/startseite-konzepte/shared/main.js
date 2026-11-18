// Shared behaviour for all homepage concepts
const toggle = document.querySelector('.nav-toggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.main-nav a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('nav-open')));
}

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Entrance animations start once the element scrolls into view
const enterObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  entry.target.classList.add('is-in');
  enterObserver.unobserve(entry.target);
}), { threshold: 0.15 });
document.querySelectorAll('.enter').forEach(el => enterObserver.observe(el));

// Endless marquee for .marquee-track (text tickers and image carousels); pauses on hover/focus
document.querySelectorAll('[data-marquee]').forEach(wrap => {
  const track = wrap.querySelector('.marquee-track');
  const items = [...track.children];
  items.forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    if (clone.tagName === 'IMG') clone.alt = '';
    track.append(clone);
  });
  const speed = Number(wrap.dataset.marquee) || 53;
  let offset = 0, paused = false, last = performance.now();
  const tick = now => {
    const dt = Math.min(now - last, 100) / 1000;
    last = now;
    if (!paused && !reduceMotion) offset += speed * dt;
    const loop = (track.scrollWidth + (parseFloat(getComputedStyle(track).columnGap) || 0)) / 2;
    track.style.transform = `translateX(${-(offset % loop)}px)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  wrap.addEventListener('mouseenter', () => { paused = true; });
  wrap.addEventListener('mouseleave', () => { paused = false; });
  wrap.addEventListener('focusin', () => { paused = true; });
  wrap.addEventListener('focusout', () => { paused = false; });
});
