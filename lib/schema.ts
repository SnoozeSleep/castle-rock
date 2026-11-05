import { SITE } from '@/components/site-config';
import BRANDS from '@/lib/brands.json';
import { localizeHref, type Locale } from '@/lib/i18n';
import { LOCATION, SITE_URL } from '@/lib/location';

/* Structured data, one graph per page (SEO audit, October 2026 — section 5; the agency's schema review, November 3,
   2026; the Castle Rock clone, November 2026). components/PageSchema.tsx renders a single JSON-LD script per page: the
   three site-wide nodes below, once each, linked by stable @ids, followed by the page's own nodes (FAQPage,
   BreadcrumbList, Service, CollectionPage, WebPage, BlogPosting, ContactPage). Every route renders PageSchema exactly
   once; scripts/validate-schema.mjs checks one block per page, unique @ids and that the three site nodes are present.
     #organization  the Castle Rock business (Organization), part of the Snooze Mattress + Wellness group;
     #store         the store itself (FurnitureStore + LocalBusiness: the one LocalBusiness record, NAP as the client
                    wrote it), run by #organization;
     #website       this site, published by #organization.
   @type FurnitureStore: schema.org has no "MattressStore" type (the audit's wording is a Google Business Profile
   category) and an unknown type fails every validator, so the nearest Store subtype is used, with LocalBusiness.
   No AggregateRating or Review markup, on purpose. Nothing the client has not supplied is asserted: no legalName, no
   geo / hasMap and no Google listing in sameAs until the Place ID ([CR_PLACE_ID], lib/location.ts), the logo alone as
   the store image until the storefront photo (STORE_PHOTO_URL). The origin (SITE_URL) is resolved at build time from the
   environment (lib/location.ts), never hardcoded. */
export type JsonLd = Record<string, unknown>;

export { SITE_URL };
export const ORG_ID = `${SITE_URL}/#organization`;
export const STORE_ID = `${SITE_URL}/#store`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const LANG: Record<Locale, string> = { en: 'en-US', es: 'es-US' };
export const pageUrl = (path: string, locale: Locale) => `${SITE_URL}${localizeHref(path, locale)}`;

/* the site icon (the alarm-clock mark of the logo), the one square logo asset: 1200 × 1200 px */
const SQUARE_LOGO = { src: '/assets/filesafe/qR8peonBlnjGI3ZuLHQP/media/695b9e7d17768458ae206a19.png', width: 1200, height: 1200 };
const NAME = `Snooze Mattress + Wellness ${LOCATION.city}`;
const L = LOCATION;
/* an image path on this origin or an absolute URL (a supplied photo may live in the store's media library) */
const abs = (p: string) => (/^https?:\/\//.test(p) ? p : `${SITE_URL}${p}`);
/* the social profiles the client supplied (an empty value is skipped) */
const SOCIAL = [L.social.facebook, L.social.instagram].filter(Boolean);

function organization(): JsonLd {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: NAME,
    url: `${SITE_URL}/`,
    logo: { '@type': 'ImageObject', '@id': `${SITE_URL}/#logo`, url: `${SITE_URL}${SQUARE_LOGO.src}`, width: SQUARE_LOGO.width, height: SQUARE_LOGO.height },
    sameAs: SOCIAL,
    parentOrganization: { '@type': 'Organization', name: 'Snooze Mattress + Wellness', url: 'https://snoozemattresscompany.com' },
  };
}

/* the store: name, full address, telephone, opening hours, priceRange, url, storefront photo (once supplied) + logo,
   sameAs (Facebook, Instagram; the Google listing once the Place ID is supplied), areaServed; geo and hasMap only
   with the Place ID; the brands are the store's lineup (lib/brands.json); the free Dream Mapping fitting is its offer
   (the Service on /dream-mapping) */
function store(locale: Locale): JsonLd {
  return {
    '@type': ['FurnitureStore', 'LocalBusiness'],
    '@id': STORE_ID,
    name: L.name,
    url: pageUrl('/', locale),
    image: [L.storefrontImage ? abs(L.storefrontImage) : '', `${SITE_URL}${SITE.logo}`].filter(Boolean),
    logo: `${SITE_URL}${SITE.logo}`,
    telephone: `+1 ${L.phone}`,
    email: L.email,
    priceRange: L.priceRange,
    address: { '@type': 'PostalAddress', streetAddress: L.street, addressLocality: L.city, addressRegion: L.region, postalCode: L.postalCode, addressCountry: L.country },
    ...(L.geo ? { geo: { '@type': 'GeoCoordinates', latitude: L.geo.latitude, longitude: L.geo.longitude } } : {}),
    ...(L.gbpUrl ? { hasMap: L.gbpUrl } : {}),
    sameAs: [...SOCIAL, L.gbpUrl].filter(Boolean),
    openingHoursSpecification: L.openingHours.map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days.map((d) => `https://schema.org/${d}`), opens: h.opens, closes: h.closes })),
    areaServed: L.areaServed.map((city) => ({ '@type': 'City', name: city, containedInPlace: { '@type': 'State', name: L.regionName } })),
    parentOrganization: { '@id': ORG_ID },
    knowsLanguage: Object.keys(LANG),
    currenciesAccepted: 'USD',
    paymentAccepted: 'Cash, Credit Card, Financing (Synchrony, Wells Fargo), Lease-to-own (Snap Finance)',
    brand: BRANDS.mattressBrands.map((name) => ({ '@type': 'Brand', name })),
    makesOffer: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStoreOnly', url: pageUrl('/booking', locale), itemOffered: { '@type': 'Service', '@id': dreamMappingServiceId(locale), name: 'Dream Mapping' } },
  };
}

function website(): JsonLd {
  return { '@type': 'WebSite', '@id': WEBSITE_ID, url: `${SITE_URL}/`, name: NAME, publisher: { '@id': ORG_ID }, inLanguage: Object.values(LANG) };
}

/* The Dream Mapping fitting (SEO audit section 5d; the facts the audit supplied: free, about 5 minutes, in the store),
   one Service per language: …/dream-mapping#service (Service has no inLanguage, the booking EntryPoint carries the
   language). /dream-mapping and /booking render the same node; the store's makesOffer points at it. */
export const dreamMappingServiceId = (locale: Locale) => `${pageUrl('/dream-mapping', locale)}#service`;
export function dreamMappingService(locale: Locale): JsonLd {
  const booking = pageUrl('/booking', locale);
  return {
    '@type': 'Service',
    '@id': dreamMappingServiceId(locale),
    name: 'Dream Mapping',
    serviceType: locale === 'es' ? 'Ajuste de colchón por mapeo de presión' : 'Mattress fitting by pressure mapping',
    description: locale === 'es'
      ? `Sesión gratuita de Dream Mapping en la tienda de ${L.city}: en unos 5 minutos, el mapeo de presión identifica el colchón que se ajusta a tu forma de dormir.`
      : `Free in-store Dream Mapping fitting at the ${L.city} store: in about 5 minutes, pressure mapping identifies the mattress that fits the way you sleep.`,
    url: pageUrl('/dream-mapping', locale),
    provider: { '@id': STORE_ID },
    areaServed: L.areaServed.map((city) => ({ '@type': 'City', name: city })),
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStoreOnly', url: booking },
    potentialAction: { '@type': 'ReserveAction', target: { '@type': 'EntryPoint', urlTemplate: booking, inLanguage: LANG[locale], actionPlatform: ['https://schema.org/DesktopWebPlatform', 'https://schema.org/MobileWebPlatform'] } },
    hoursAvailable: L.openingHours.map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days.map((d) => `https://schema.org/${d}`), opens: h.opens, closes: h.closes })),
  };
}

/* a page node (CollectionPage on the category pages, WebPage on the service-area pages): part of #website, about the
   store */
export function pageNode(type: 'CollectionPage' | 'WebPage', url: string, name: string, locale: Locale, extra: JsonLd = {}): JsonLd {
  return { '@type': type, '@id': `${url}#webpage`, url, name, inLanguage: LANG[locale], isPartOf: { '@id': WEBSITE_ID }, about: { '@id': STORE_ID }, ...extra };
}

/* the page's graph: the site nodes, then the page's own (their @context dropped; a nested @graph is flattened). Two
   nodes with one @id would be a second copy of the same thing, so that fails the build. */
export function pageGraph(items: JsonLd[], locale: Locale): JsonLd {
  const nodes: JsonLd[] = [organization(), store(locale), website()];
  for (const item of items) {
    for (const node of (Array.isArray(item['@graph']) ? (item['@graph'] as JsonLd[]) : [item])) {
      const { '@context': _context, ...rest } = node;
      nodes.push(rest);
    }
  }
  const ids = nodes.map((n) => n['@id']).filter(Boolean);
  const dup = ids.find((id, i) => ids.indexOf(id) !== i);
  if (dup) throw new Error(`structured data: two nodes with @id ${String(dup)}`);
  return { '@context': 'https://schema.org', '@graph': nodes };
}
