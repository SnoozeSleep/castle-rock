/* UI strings of the hand-written parts of the site (header, footer, blog chrome). English only: the Castle Rock site
   has no Spanish mirror (November 2026 brief, section B) — the /es tree, the EN | ES toggle, the hreflang alternates and
   the Spanish dictionaries were removed. `Locale` stays as a type so the components keep their `locale` prop. */

import { LOCATION } from './location';

export type Locale = 'en';
export const LOCALES: Locale[] = ['en'];
export const DEFAULT_LOCALE: Locale = 'en';

/** one language: the path is returned as it is (kept so the components' call sites stay unchanged) */
export function localizeHref(href: string, _locale: Locale = 'en'): string {
  return href;
}

/** the pathname without a trailing slash (one language, no prefix) */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const p = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return { locale: 'en', path: p || '/' };
}


type ProductItem = { label: string; desc: string };
export type UiStrings = {
  langName: string;
  nav: { home: string; about: string; products: string; financing: string; sales: string; blog: string; quiz: string; allArticles: string };
  menu: { products: string; accessories: string; latest: string; openMenu: (label: string) => string; closeMenu: (label: string) => string; openSite: string; closeSite: string; siteMenu: string; homeAria: string; call: (phone: string) => string; sizes: string; sizeLinks: Array<[label: string, href: string]> };
  products: Record<string, ProductItem>;
  feature: { eyebrow: string; title: string; cta: string; imgAlt: string };
  drawerBook: string;
  drawerQuiz: string;
  /* Sleep Fit Quiz row at the bottom of the Our Products dropdown */
  quizCard: { title: string; desc: string; cta: string };
  /* Sleep Fit Quiz call to action under sections that had no next step (blog posts; the GoHighLevel pages carry the same copy in overrides/) */
  quizCta: { line: string; button: string; aria: string };
  footer: {
    about: string; book: string; contact: string; products: string; company: string; visit: string; hours1: string; hours2: string; location: string; directions: string; openMaps: string; mapTitle: string;
    rights: string; madeWith: string; terms: string; privacy: string; facebook: string; instagram: string;
    companyLinks: Array<[label: string, href: string]>;
    serving: string; areas: Array<[label: string, href: string]>;
  };
  blog: {
    eyebrow: string; indexTitle: string; indexIntro: string; home: string; blogCrumb: string; readArticle: string; read: (title: string) => string; faq: string; related: string;
    ctaEyebrow: string; ctaTitle: string; ctaText: string; ctaBook: string; ctaCall: (phone: string) => string; ctaAddr: string;
    indexMetaTitle: string; indexMetaDesc: string; ogDesc: string; section: string; by: string; sources: string;
    /* the empty state of /blog while no article is published (lib/blog-posts.ts) */
    emptyTitle: string; emptyText: string;
  };
};

const PRODUCT_KEYS = ['mattresses', 'bases', 'chairs', 'pillows', 'protectors', 'sheets', 'recliner', 'kit'] as const;
export type ProductKey = (typeof PRODUCT_KEYS)[number];

const en: UiStrings = {
  langName: 'English',
  nav: { home: 'Home', about: 'About Us', products: 'Our Products', financing: 'Financing', sales: 'Sales', blog: 'Blog', quiz: 'Sleep Quiz', allArticles: 'All articles' },
  menu: { products: 'Products', accessories: 'Sleep Accessories', latest: 'Latest articles', openMenu: (l) => `Open ${l} menu`, closeMenu: (l) => `Close ${l} menu`, openSite: 'Open menu', closeSite: 'Close menu', siteMenu: 'Site menu', homeAria: 'Snooze Mattress + Wellness — home', call: (p) => `Call ${p}`,
    sizes: 'Mattresses by size & type',
    sizeLinks: [['Queen', '/queen-mattresses'], ['King', '/king-mattresses'], ['Full & Twin', '/full-twin-mattresses'], ['Memory Foam', '/memory-foam-mattresses'], ['Back Pain', '/mattresses-for-back-pain'], ['Cooling', '/cooling-mattresses']] },
  products: {
    mattresses: { label: 'Mattresses', desc: 'Fitted to you with Dream Mapping' },
    bases: { label: 'Adjustable Mattress Bases', desc: 'Elevate your sleep position' },
    chairs: { label: 'Massage Chairs', desc: 'Infinity® massage chairs' },
    pillows: { label: 'Pillows', desc: 'Premium support for every sleeper' },
    protectors: { label: 'Mattress Protectors', desc: 'Protect your investment' },
    sheets: { label: 'Premium Sheets', desc: 'Luxury you can feel every night' },
    recliner: { label: 'Sleep Recliner', desc: 'Recline smarter with the Zcliner®' },
    kit: { label: 'At-Home Sleep Test Kit', desc: 'Find what disrupts your sleep' },
  },
  feature: { eyebrow: 'Dream Mapping', title: 'Find your perfect mattress in about 5 minutes', cta: 'Book a free fitting', imgAlt: 'Snooze Sleep Coaches fitting a customer on a mattress' },
  drawerBook: 'Book Free Dream Mapping Appointment',
  drawerQuiz: 'Take the Sleep Fit Quiz',
  quizCard: { title: 'Sleep Fit Quiz', desc: 'Not sure which mattress is right for you? Find your comfort + support in 60 seconds.', cta: 'Take the quiz' },
  quizCta: { line: 'Not sure which mattress is right for you?', button: 'Take the 60-Second Sleep Quiz', aria: 'Sleep Fit Quiz' },
  footer: {
    about: 'Snooze Mattress + Wellness in Castle Rock, serving Douglas County and the south Denver metro. We treat every person who walks through our door like family, and we are passionate about better health through better sleep.',
    book: 'Book Your Dream Mapping Appointment!', contact: 'Get In Touch With Us', products: 'Our Products', company: 'Company', visit: 'Visit Us',
    hours1: 'Mon–Sat 10 AM–7 PM', hours2: 'Sun 11 AM–6 PM', location: 'Our Location', directions: 'Get Directions', openMaps: 'Open Maps',
    mapTitle: 'Map to Snooze Mattress + Wellness, 6360 Promenade Pkwy, Castle Rock, CO 80108',
    rights: 'Snooze Mattress + Wellness. All Rights Reserved', madeWith: 'Made with', terms: 'Terms & Conditions', privacy: 'Privacy Policy',
    facebook: 'Snooze Mattress + Wellness Castle Rock on Facebook', instagram: 'Snooze Mattress + Wellness Castle Rock on Instagram',
    companyLinks: [['About Us', '/about-us'], ['Financing', '/mattress-financing'], ['Sales', '/mattress-sales'], ['Sleep Blog', '/blog'], ['Sleep Fit Quiz', '/sleep-quiz'], ['Dream Mapping', '/dream-mapping'], ['How to Choose a Mattress', '/how-to-choose-a-mattress'], ['FAQ', '/faq'], ['Book a Dream Mapping Appointment', '/booking'], ['Get In Touch', '/contact-us']],
    serving: 'Also serving', areas: LOCATION.serviceAreas.map((a) => [a.city, a.slug] as [string, string]),
  },
  blog: {
    eyebrow: 'Snooze Sleep Blog', indexTitle: 'Better Sleep Starts Here',
    indexIntro: 'Custom mattresses, pressure mapping and pain-free mornings — straight from the sleep specialists at Snooze Mattress + Wellness in Castle Rock.',
    home: 'Home', blogCrumb: 'Sleep Blog', readArticle: 'Read article', read: (t) => `Read: ${t}`, faq: 'Frequently Asked Questions', related: 'Related Posts',
    ctaEyebrow: 'Real People. Real Results. Real Sleep.', ctaTitle: 'Visit Our Showroom',
    ctaText: 'Talk to our Sleep Specialists in Castle Rock. Get pressure-mapped, try the mattresses that fit your body, and ask about 0% financing — we treat every person who walks through our door like family.',
    ctaBook: 'Book Your Dream Mapping Appointment', ctaCall: (p) => `Call ${p}`, ctaAddr: '6360 Promenade Pkwy, Castle Rock, CO 80108 · Mon–Sat 10 AM–7 PM · Sun 11 AM–6 PM',
    indexMetaTitle: 'Castle Rock Sleep Blog | Snooze Mattress',
    indexMetaDesc: 'Sleep tips from Snooze Mattress + Wellness in Castle Rock: custom mattresses, pressure mapping and how the right mattress relieves aches and pains.',
    ogDesc: 'Custom mattresses, pressure mapping and better sleep — from the Snooze team in Castle Rock.', section: 'Sleep & Wellness', by: 'By', /* + the author's name, lib/blog-author.ts */ sources: 'Sources',
    emptyTitle: 'New articles coming soon', emptyText: 'The Castle Rock Sleep Blog is just getting started. In the meantime, our guides cover how to choose a mattress, what Dream Mapping measures and the mattress sizes and types we carry.',
  },
};

;

export const UI: Record<Locale, UiStrings> = { en };
export const ui = (locale: Locale) => UI[locale] || en;
export { PRODUCT_KEYS };
