/* The promo banner feed (November 2026; the slot as implemented on the clone-source site, its commits aacef8b /
   f133d56). One JSON at
   process.env.BANNERS_URL (set in the Vercel project's environment), in either of two shapes:

   1. the shared Snooze banner feed:
        { generatedAt, banners: [{ id, name, always, priority, rotateSeconds, href, start, end, stores,
                                   slides: [{ desktop, desktopW, desktopH, mobile, mobileW, mobileH, alt, href }] }] }
      start/end are inclusive calendar days (YYYY-MM-DD) in the store's time zone; stores is ["*"] or store slugs;
      W/H are each image's natural pixel size (any ratio);
   2. the banner manager's per-store API (https://snooze-banner-self.vercel.app/api/sites/<slug>/banners — the
      dashboard the clone-source site's embed reads; November 12, 2026):
        { site: { key, name }, today, timeZone, generatedAt,
          banners: [{ id, name, kind: 'promotion' | 'evergreen', priority, rotateMs, stores,
                      images: [{ id, alt, link, desktop: { url, width, height }, mobile: { url, width, height } }] }] }
      The manager has already applied its own dates (it returns only what is live today), so its promotions count as
      running and its evergreen banners as always-on; normalizeFeed() turns it into shape 1.

   This site is served by Next.js (not a static export): / and /es render the slot on the server and the fetch
   revalidates every 60 seconds (Incremental Static Regeneration), so a banner published, ended or re-dated shows
   within about a minute, with no rebuild and no cron.

   Everything fails closed: no URL, a non-200, bad JSON, a malformed banner or slide, or an unsafe URL means that item
   (or the whole feed) is skipped and the page renders no banner, never an error. No imports, so the unit checks can
   load it in plain Node. */

export type BannerSlide = {
  desktop?: unknown; desktopW?: unknown; desktopH?: unknown; mobile?: unknown; mobileW?: unknown; mobileH?: unknown;
  alt?: unknown; href?: unknown;
};
export type Banner = {
  id?: unknown; name?: unknown; always?: unknown; priority?: unknown; rotateSeconds?: unknown; href?: unknown;
  start?: unknown; end?: unknown; stores?: unknown; slides?: unknown;
};
export type ActiveSlide = {
  bannerId: string; desktop: string; desktopW: number; desktopH: number; mobile: string; mobileW: number; mobileH: number;
  alt: string; href: string;
};
export type ActiveSlides = { slides: ActiveSlide[]; interval: number };

const MAX_SLIDES = 8;
const DEFAULT_INTERVAL = 5;
const MIN_INTERVAL = 2; // a typo in the feed must not flash slides faster than people can read them
const DAY = /^\d{4}-\d{2}-\d{2}$/;
/* the manager's promotions are already filtered to today: an open date range keeps them "running" here */
const OPEN_START = '0000-01-01';
const OPEN_END = '9999-12-31';

export async function fetchBanners(): Promise<Banner[]> {
  const url = process.env.BANNERS_URL;
  if (!url) return [];
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return normalizeFeed(await res.json());
  } catch {
    return [];
  }
}

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

/* either feed shape -> the shared feed's banner list (shape 1); anything else -> [] */
export function normalizeFeed(data: unknown): Banner[] {
  if (!isObj(data) || !Array.isArray(data.banners)) return [];
  const siteKey = isObj(data.site) && typeof data.site.key === 'string' ? data.site.key.trim() : '';
  return (data.banners as unknown[]).map((b): Banner => {
    if (!isObj(b) || Array.isArray(b.slides) || !Array.isArray(b.images)) return b as Banner; // shape 1 (or junk: activeSlides skips it)
    const stores = Array.isArray(b.stores) ? [...(b.stores as unknown[])] : [];
    if (siteKey && !stores.includes(siteKey)) stores.push(siteKey); // a per-store response is for that store
    const always = b.kind === 'evergreen';
    const ms = typeof b.rotateMs === 'number' && Number.isFinite(b.rotateMs) ? b.rotateMs : NaN;
    return {
      id: b.id, name: b.name, always, priority: b.priority,
      rotateSeconds: Number.isFinite(ms) ? ms / 1000 : undefined,
      href: '', stores,
      ...(always ? {} : { start: OPEN_START, end: OPEN_END }),
      slides: (b.images as unknown[]).map((i): BannerSlide => {
        const img = isObj(i) ? i : {};
        const d = isObj(img.desktop) ? img.desktop : {}, m = isObj(img.mobile) ? img.mobile : {};
        return { desktop: d.url, desktopW: d.width, desktopH: d.height, mobile: m.url, mobileW: m.width, mobileH: m.height, alt: img.alt, href: img.link };
      }),
    };
  });
}

/* today's calendar day where the store is ("en-CA" formats as YYYY-MM-DD) */
export function todayIn(timeZone: string, now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

/* images and links from the feed: https URLs or site-relative paths only (no javascript:, data: or protocol-relative) */
const safeUrl = (v: unknown): string => {
  if (typeof v !== 'string') return '';
  const s = v.trim();
  return /^https:\/\/[^\s"'<>]+$/i.test(s) || /^\/(?!\/)[^\s"'<>]*$/.test(s) ? s : '';
};
const text = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
const num = (v: unknown, fallback: number): number => (typeof v === 'number' && Number.isFinite(v) ? v : fallback);
/* a natural pixel size: a positive number (or digit string), rounded; 0 = unusable */
const px = (v: unknown): number => {
  const n = typeof v === 'string' && /^\s*\d+(\.\d+)?\s*$/.test(v) ? Number(v) : v;
  return typeof n === 'number' && Number.isFinite(n) && n >= 1 ? Math.round(n) : 0;
};

export function activeSlides(list: Banner[], slug: string, timeZone: string, now: Date = new Date()): ActiveSlides {
  const today = todayIn(timeZone, now);
  const eligible = (Array.isArray(list) ? list : []).filter((b) => {
    if (!b || typeof b !== 'object') return false;
    if (typeof b.id !== 'number' && text(b.id) === '') return false; // every slide carries its banner's id
    const stores = Array.isArray(b.stores) ? b.stores : [];
    if (!stores.includes('*') && !stores.includes(slug)) return false;
    if (b.always === true) return true;
    const start = text(b.start), end = text(b.end);
    return DAY.test(start) && DAY.test(end) && start <= today && today <= end;
  });
  // promos (dated) first, highest priority first; the always-on banners follow them, or stand alone when no promo runs
  const byPriority = (a: Banner, b: Banner) => num(b.priority, 0) - num(a.priority, 0);
  const promos = eligible.filter((b) => b.always !== true).sort(byPriority);
  const always = eligible.filter((b) => b.always === true).sort(byPriority);
  const ordered = promos.length ? [...promos, ...always] : always;

  const slides: ActiveSlide[] = [];
  for (const b of ordered) {
    for (const s of Array.isArray(b.slides) ? (b.slides as BannerSlide[]) : []) {
      if (!s || typeof s !== 'object') continue;
      const desktop = safeUrl(s.desktop), desktopW = px(s.desktopW), desktopH = px(s.desktopH);
      if (!desktop || !desktopW || !desktopH) continue;
      let mobile = safeUrl(s.mobile), mobileW = px(s.mobileW), mobileH = px(s.mobileH);
      if (!mobile || !mobileW || !mobileH) { mobile = desktop; mobileW = desktopW; mobileH = desktopH; }
      slides.push({ bannerId: String(b.id), desktop, desktopW, desktopH, mobile, mobileW, mobileH, alt: text(s.alt), href: safeUrl(s.href) || safeUrl(b.href) });
      if (slides.length === MAX_SLIDES) break;
    }
    if (slides.length === MAX_SLIDES) break;
  }
  if (!slides.length) return { slides: [], interval: DEFAULT_INTERVAL };
  const first = ordered.find((b) => String(b.id) === slides[0].bannerId);
  return { slides, interval: Math.max(MIN_INTERVAL, num(first && first.rotateSeconds, DEFAULT_INTERVAL)) };
}
