// Captures every page of the live Wix site into archive/pages/<slug>/:
//   content.md   texts in reading order (sections, headings, paragraphs, lists, buttons, images)
//   meta.json    SEO data, links, images, videos, forms, Wix app widgets
//   desktop.jpg  full-page screenshot at 1440px
//   mobile.jpg   full-page screenshot of the Wix mobile layout (375px)
//   images/      original files from the Wix media library (only for pages we keep)
//
// Usage: npm run capture [-- /path /other-path]   (no args = every page from the sitemaps)

import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const SITE = 'https://www.katharinaniesche.de';
const OUT = path.resolve(import.meta.dirname, '../../archive/pages');
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const MOBILE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';

// Not listed in the sitemaps, but part of the booking flow
const EXTRA_PATHS = ['/booking-calendar/kostenloser-strategie-infocall'];

// Pages that move to the new frontend; only these get their original images downloaded
const KEEP = new Set([
  '/', '/1-1-business-aufbau', '/guide', '/ueber-mich', '/veranstaltungen', '/impressum', '/datenschutz',
  '/linktree', '/book-online', '/service-page/kostenloser-strategie-infocall-1',
  '/booking-calendar/kostenloser-strategie-infocall',
]);

// Cookie banner off, Wix "background reveal" neutralised so full-page screenshots show photos normally
const CAPTURE_CSS = `
  #usercentrics-root, #usercentrics-cmp-ui, [id^="usercentrics"] { display: none !important; }
  [data-motion-part^="BG_MEDIA"] { height: 100% !important; margin-top: 0 !important; }
  [data-motion-part^="BG_IMG"] { position: static !important; height: 100% !important; margin-bottom: 0 !important; }
`;

const slugFor = p => p === '/' ? 'home' : decodeURIComponent(p).slice(1)
  .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
  .replace(/\//g, '--').replace(/[^a-zA-Z0-9-]/g, '-');

async function sitemapPaths() {
  const locs = xml => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const index = await (await fetch(`${SITE}/sitemap.xml`)).text();
  const paths = new Set();
  for (const map of locs(index)) {
    for (const url of locs(await (await fetch(map)).text())) {
      paths.add(new URL(url).pathname.replace(/\/$/, '') || '/');
    }
  }
  EXTRA_PATHS.forEach(p => paths.add(p));
  return [...paths];
}

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const wait = ms => new Promise(r => setTimeout(r, ms));
    for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await wait(120);
    }
    window.scrollTo(0, 0);
    await wait(800);
  });
}

async function load(page, url) {
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.addStyleTag({ content: CAPTURE_CSS });
  await page.waitForTimeout(1500);
  await scrollThrough(page);
}

async function screenshot(page, file) {
  try {
    await page.screenshot({ path: file, fullPage: true, type: 'jpeg', quality: 72 });
  } catch {
    // Very long pages can exceed Chrome's capture limit; keep the first 16000px
    const width = page.viewportSize().width;
    await page.screenshot({ path: file, type: 'jpeg', quality: 72, clip: { x: 0, y: 0, width, height: 16000 } });
  }
}

// Runs inside the page: turns <main> into Markdown and collects metadata
function extract() {
  const main = document.querySelector('main') || document.body;
  const clean = t => t.replace(/\u200B/g, '').replace(/\u00A0/g, ' ').replace(/[ \t]+/g, ' ').trim();
  const visible = el => {
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden') return false;
    return s.display === 'contents' || el.getClientRects().length > 0;
  };
  const mediaId = src => (src || '').match(/static\.wixstatic\.com\/media\/([^/?#]+)/)?.[1] || null;

  // Inline text with **bold**, *italic* and [links](href), relative to the block's own style
  const inline = block => {
    const base = getComputedStyle(block);
    const baseBold = +base.fontWeight >= 600, baseItalic = base.fontStyle === 'italic';
    const runs = [];
    const walk = node => {
      if (node.nodeType === 3) {
        const t = node.textContent.replace(/\u200B/g, '').replace(/\u00A0/g, ' ');
        if (!t) return;
        const s = getComputedStyle(node.parentElement);
        runs.push({
          t,
          b: +s.fontWeight >= 600 && !baseBold,
          i: s.fontStyle === 'italic' && !baseItalic,
          href: node.parentElement.closest('a[href]')?.href || null,
        });
      } else if (node.nodeType === 1) {
        if (node.tagName === 'BR') runs.push({ t: '\n', b: false, i: false, href: null });
        else node.childNodes.forEach(walk);
      }
    };
    block.childNodes.forEach(walk);
    const merged = [];
    for (const r of runs) {
      const last = merged.at(-1);
      if (last && last.b === r.b && last.i === r.i && last.href === r.href) last.t += r.t;
      else merged.push({ ...r });
    }
    const fmt = r => {
      const m = (r.b ? '**' : '') + (r.i ? '*' : '');
      if (!m || !r.t.trim()) return r.t;
      const lead = r.t.match(/^\s*/)[0], trail = r.t.match(/\s*$/)[0];
      return lead + m + r.t.trim() + [...m].reverse().join('') + trail;
    };
    let out = '';
    for (let k = 0; k < merged.length; k++) {
      const r = merged[k];
      if (r.href) {
        let inner = '';
        while (k < merged.length && merged[k].href === r.href) inner += fmt(merged[k++]);
        k--;
        out += `[${inner.trim()}](${r.href})`;
      } else out += fmt(r);
    }
    return out.split('\n').map(clean).filter(Boolean).join('  \n');
  };

  const lines = [];
  const images = new Map();
  const videos = [];
  let section = 0;

  const addImage = (img, kind) => {
    const src = img.currentSrc || img.src;
    const id = mediaId(src);
    if (!id) return null;
    if (!images.has(id)) {
      const r = img.getBoundingClientRect();
      images.set(id, { id, original: `https://static.wixstatic.com/media/${id}`, alt: img.alt || '', kind, shownAt: [Math.round(r.width), Math.round(r.height)] });
    }
    return images.get(id);
  };

  const fieldLabel = input => {
    const byFor = input.id && document.querySelector(`label[for="${CSS.escape(input.id)}"]`);
    return clean(byFor?.innerText || input.closest('label')?.innerText || input.getAttribute('aria-label') || input.placeholder || input.name || '');
  };

  // Accordion panels (FAQ) are collapsed; their answers are read via aria-controls, so skip the panels themselves
  const panels = new Set([...main.querySelectorAll('[aria-controls]')]
    .map(b => document.getElementById(b.getAttribute('aria-controls'))).filter(Boolean));

  const walk = el => {
    for (const child of el.children) {
      const tag = child.tagName;
      if (panels.has(child)) continue;
      if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'svg'].includes(tag) || !visible(child)) continue;
      const panel = child.getAttribute('aria-controls') && document.getElementById(child.getAttribute('aria-controls'));
      if (panel) {
        const answer = [...panel.querySelectorAll('p, li')].map(p => clean(p.textContent)).filter(Boolean);
        lines.push(`**${clean(child.innerText).replace(/\n+/g, ' ')}**  \n> ${(answer.length ? answer : [clean(panel.textContent)]).join('  \n> ')}`);
        continue;
      }
      if (tag === 'SECTION') {
        lines.push(`\n<!-- Abschnitt ${++section} (${child.id || 'ohne id'}) -->\n`);
        walk(child);
      } else if (/^H[1-6]$/.test(tag)) {
        // Headings are bold anyway; keep only italics as emphasis
        const t = inline(child).replace(/ {2}\n/g, ' <br> ').replace(/\*\*/g, '');
        if (t) lines.push(`${'#'.repeat(+tag[1])} ${t}`);
      } else if (tag === 'P') {
        const t = inline(child);
        if (t) lines.push(t);
      } else if (tag === 'UL' || tag === 'OL') {
        [...child.children].filter(visible).forEach((li, n) => {
          const t = inline(li);
          if (t) lines.push(`${tag === 'OL' ? `${n + 1}.` : '-'} ${t}`);
        });
      } else if (tag === 'IMG') {
        const isBg = !!child.closest('[data-motion-part^="BG"], [id^="bgMedia"], [id^="bgLayers"]');
        const img = addImage(child, isBg ? 'background' : 'image');
        if (img) lines.push(`![${isBg ? 'Hintergrund' : 'Bild'}: ${img.alt}](images/${img.id})`);
      } else if (tag === 'VIDEO') {
        const src = child.currentSrc || child.src || child.querySelector('source')?.src || '';
        videos.push({ src, poster: child.poster || '' });
        lines.push(`[Video${child.poster ? `, Poster: ${child.poster}` : ''}]`);
      } else if (tag === 'IFRAME') {
        lines.push(`[Eingebettet: ${child.src || child.title || 'iframe'}]`);
      } else if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        if (child.type === 'hidden') continue;
        lines.push(`[Formularfeld (${child.type || tag.toLowerCase()}${child.required ? ', Pflicht' : ''}): ${fieldLabel(child)}]`);
      } else if (tag === 'A' || tag === 'BUTTON') {
        const t = clean(child.innerText).replace(/\n+/g, ' ');
        const isButton = tag === 'BUTTON' || /button/i.test(child.className + ' ' + (child.dataset.testid || ''));
        if (t) lines.push(`[${isButton ? 'Button: ' : ''}${t}](${child.href || '#'})`);
        else child.querySelectorAll('img').forEach(i => { const img = addImage(i, 'image'); if (img) lines.push(`[![${img.alt}](images/${img.id})](${child.href || '#'})`); });
      } else if ([...child.childNodes].some(n => n.nodeType === 3 && clean(n.textContent))) {
        // Text that is not wrapped in p/h/li (typical inside Wix app widgets)
        const t = inline(child);
        if (t) lines.push(t);
      } else {
        walk(child);
      }
    }
  };
  walk(main);

  // CSS background images from the media library
  for (const el of main.querySelectorAll('*')) {
    const id = mediaId(getComputedStyle(el).backgroundImage);
    if (id && !images.has(id)) images.set(id, { id, original: `https://static.wixstatic.com/media/${id}`, alt: '', kind: 'css-background', shownAt: [] });
  }

  const meta = name => document.querySelector(`meta[name="${name}"], meta[property="${name}"]`)?.content || null;
  const links = [...new Map([...main.querySelectorAll('a[href]')]
    .map(a => [a.href + '|' + clean(a.innerText), { text: clean(a.innerText).replace(/\n+/g, ' '), href: a.href }])).values()];
  const forms = [...main.querySelectorAll('form')].map(f => ({
    fields: [...f.querySelectorAll('input, textarea, select')].filter(i => i.type !== 'hidden')
      .map(i => ({ type: i.type || i.tagName.toLowerCase(), label: fieldLabel(i), required: i.required })),
    submit: clean(f.querySelector('button[type="submit"], button')?.innerText || ''),
  }));
  const wixApps = [...new Set([...main.querySelectorAll('[id^="TPASection"], [id^="TPAWidget"], [id^="TPAMultiSection"]')]
    .map(e => e.id.replace(/_.*/, '')))];
  const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')]
    .map(s => { try { return JSON.parse(s.textContent); } catch { return null; } }).filter(Boolean);
  const nav = [...document.querySelectorAll('header a[href]')].map(a => ({ text: clean(a.innerText), href: a.href })).filter(l => l.text);
  const footer = [...document.querySelectorAll('footer a[href]')].map(a => ({ text: clean(a.innerText), href: a.href })).filter(l => l.text);

  return {
    markdown: lines.join('\n\n').replace(/\n{3,}/g, '\n\n'),
    meta: {
      title: document.title,
      description: meta('description'),
      canonical: document.querySelector('link[rel="canonical"]')?.href || null,
      robots: meta('robots'),
      og: { title: meta('og:title'), description: meta('og:description'), image: meta('og:image'), type: meta('og:type') },
      lang: document.documentElement.lang,
      pageHeight: document.documentElement.scrollHeight,
      headings: [...main.querySelectorAll('h1, h2, h3')].filter(visible).map(h => `${h.tagName}: ${clean(h.innerText).replace(/\n+/g, ' / ')}`),
      wixApps, forms, links, videos,
      images: [...images.values()],
      jsonLd, nav, footer,
    },
  };
}

async function downloadImages(images, dir) {
  await mkdir(dir, { recursive: true });
  for (const img of images) {
    const file = path.join(dir, img.id);
    if (existsSync(file)) continue;
    const res = await fetch(img.original);
    if (!res.ok) { img.downloadError = res.status; continue; }
    await writeFile(file, Buffer.from(await res.arrayBuffer()));
  }
}

async function capture(browser, urlPath) {
  const slug = slugFor(urlPath);
  const dir = path.join(OUT, slug);
  await mkdir(dir, { recursive: true });
  const url = SITE + urlPath;

  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-DE' });
  const page = await desktop.newPage();
  await load(page, url);
  const { markdown, meta } = await page.evaluate(extract);
  await screenshot(page, path.join(dir, 'desktop.jpg'));
  await desktop.close();

  const mobile = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, userAgent: MOBILE_UA, locale: 'de-DE' });
  const mpage = await mobile.newPage();
  await load(mpage, url);
  const mobileData = await mpage.evaluate(extract);
  await screenshot(mpage, path.join(dir, 'mobile.jpg'));
  await mobile.close();

  const keep = KEEP.has(urlPath);
  const mobileDiffers = mobileData.markdown.replace(/<!--.*?-->/g, '').replace(/\s+/g, ' ') !== markdown.replace(/<!--.*?-->/g, '').replace(/\s+/g, ' ');
  if (keep) await downloadImages(meta.images, path.join(dir, 'images'));

  const header = `# ${meta.title}\n\nQuelle: ${url}  \nErfasst: ${new Date().toISOString().slice(0, 10)}  \nScreenshots: desktop.jpg, mobile.jpg${keep ? '' : '  \nBilder: nicht heruntergeladen (Seite wird voraussichtlich gestrichen)'}\n\n---\n`;
  await writeFile(path.join(dir, 'content.md'), header + markdown + '\n');
  if (mobileDiffers) await writeFile(path.join(dir, 'content-mobile.md'), header.replace('# ', '# [Mobil] ') + mobileData.markdown + '\n');
  await writeFile(path.join(dir, 'meta.json'), JSON.stringify({ path: urlPath, url, slug, keepCandidate: keep, mobileDiffers, capturedAt: new Date().toISOString(), ...meta }, null, 2) + '\n');
  return { path: urlPath, slug, title: meta.title, keep, images: meta.images.length, wixApps: meta.wixApps, forms: meta.forms.length, mobileDiffers };
}

const requested = process.argv.slice(2);
const paths = requested.length ? requested : await sitemapPaths();
const browser = await chromium.launch({ executablePath: CHROME });
const summary = [];
for (const p of paths) {
  try {
    const row = await capture(browser, p);
    summary.push(row);
    console.log(`ok   ${p}  (${row.images} Bilder${row.forms ? `, ${row.forms} Formular` : ''}${row.wixApps.length ? `, Apps: ${row.wixApps.join(' ')}` : ''})`);
  } catch (err) {
    summary.push({ path: p, slug: slugFor(p), error: String(err.message || err) });
    console.log(`FAIL ${p}  ${err.message}`);
  }
}
await browser.close();
if (!requested.length) await writeFile(path.join(OUT, '_summary.json'), JSON.stringify(summary, null, 2) + '\n');
