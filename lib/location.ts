/* The store: Snooze Mattress + Wellness, Castle Rock, CO. ONE place for the location data read by the top bar, the
   footer, the contact page (components/ContactDetails.tsx), the structured data (lib/schema.ts: #store, the Dream
   Mapping Service), the hand-written content pages (lib/pages/*), the service-area pages and band, and the sitemap /
   robots / llms.txt / canonicals (SITE_URL). scripts/relocate-castle-rock.mjs carries the same values for the generated
   GoHighLevel pages and the Sleep Fit Quiz CONFIG (public/sleep-fit-quiz.js): change both together.

   Store data as supplied (November 2026 brief, exact):
     Snooze Mattress + Wellness · 6360 Promenade Pkwy, Castle Rock, CO 80108 · (303) 736-8465 · keithc@snoozemattresscompany.com
     Mon–Sat 10 AM–7 PM, Sun 11 AM–6 PM (Mountain; schema Mo–Sa 10:00–19:00, Su 11:00–18:00)
     Facebook https://www.facebook.com/SnoozeMattressCoCastleRock/ · Instagram https://www.instagram.com/snoozemattress_denver/
     Area served: Castle Rock, Parker, Lone Tree, Highlands Ranch, Castle Pines, Centennial (Douglas County / the south Denver metro); service-area pages for Parker, Highlands Ranch and Lone Tree. No drive times.
   Nothing beyond that is asserted: no legal entity name, no reviews, no staff bios, no prices or offer terms, no
   coordinates and no Google listing until the Place ID is supplied (the [CR_*] placeholders below; each is listed in the
   README under NEEDS CLIENT INPUT until the client supplies it). */

/* The site's canonical origin — every canonical, Open Graph URL, sitemap entry, robots sitemap line, llms.txt link and
   JSON-LD @id is built from it. NEVER hardcoded: it is NEXT_PUBLIC_SITE_URL when that is set (set it in Vercel's
   Production environment only once the custom domain — expected castlerock.snoozemattresscompany.com, [CR_DOMAIN] —
   is attached and resolving; middleware.ts then redirects *.vercel.app and www hosts to it), otherwise the host the build
   runs for: Vercel's production URL (VERCEL_PROJECT_PRODUCTION_URL, e.g. <project>.vercel.app), the deployment URL, or
   localhost for a local build. */
const envOrigin = (v: string | undefined, scheme = 'https') => { const s = (v || '').trim().replace(/\/+$/, ''); return s ? (/^https?:\/\//.test(s) ? s : `${scheme}://${s}`) : ''; };
export const SITE_URL = envOrigin(process.env.NEXT_PUBLIC_SITE_URL) || envOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) || envOrigin(process.env.VERCEL_URL) || 'http://localhost:3000';

/* [CR_PLACE_ID] — the Google Business Profile Place ID. Empty until supplied: the address links open a Google Maps
   search for the address, the schema carries no hasMap / geo and no GBP URL in sameAs, and the "Read more reviews on
   Google" link stays hidden (scripts/reviews-widget.mjs). */
const PLACE_ID = '';
const GBP_URL = PLACE_ID ? `https://www.google.com/maps/place/?q=place_id:${PLACE_ID}` : '';
const MAPS_SEARCH = 'https://www.google.com/maps/search/?api=1&query=6360+Promenade+Pkwy+Castle+Rock+CO+80108';

/* The location-specific photos (supplied November 5, 2026): the client's Castle Rock GoHighLevel media library (location
   gsqZfpbY5MmVessxREvK). The pages load them through next/image's optimizer (/_next/image?url=…&w=…&q=75 — next.config.ts
   images.remotePatterns allows that folder), resized and as WebP, never the originals; the JSON-LD carries the original
   (absolute, crawlable). scripts/castle-rock-images.mjs (npm run images:castle-rock) writes them into the generated
   pages — markup, hydration payload and the home team column's CSS — and puts the navy "Photo coming soon" card
   (PHOTO_PLACEHOLDER) back wherever a constant is emptied again. Change the constants here, then run the script:
     STORE_PHOTO_URL — the storefront (2048×1536 JPEG): the location cards (the home page and every "Visit Us" block,
                       the About Us storefront), the LocalBusiness `image` and the hero of blog post 1
                       (lib/blog-posts.ts);
     TEAM_PHOTO_URL  — the team (680×1020 PNG, a portrait): the home page's "A Family-Owned Business with a Personal
                       Touch" / "Meet Your Sleep Coaches" card (column background on desktop, photo on phones) and Step
                       05 "Take Home Better Sleep" of the 5-step flow on /about-us and /mattress-financing — those two
                       places only; there is no standalone team section. */
export const STORE_PHOTO_URL = 'https://assets.cdn.filesafe.space/gsqZfpbY5MmVessxREvK/media/6a84d41662d4d706d4803a47.jpg';
export const TEAM_PHOTO_URL = 'https://assets.cdn.filesafe.space/gsqZfpbY5MmVessxREvK/media/6a32d96e6dd61c546a06d932.png';
export const PHOTO_PLACEHOLDER = '/assets/castle-rock/photo-coming-soon.svg';

export const LOCATION = {
  name: 'Snooze Mattress + Wellness',
  street: '6360 Promenade Pkwy',
  city: 'Castle Rock',
  region: 'CO',
  regionName: 'Colorado',
  /** where the store is, as the brief words it (Douglas County / the south Denver metro; no drive-time claims) */
  county: 'Douglas County',
  metro: 'south Denver metro',
  postalCode: '80108',
  country: 'US',
  phone: '(303) 736-8465',
  phoneHref: 'tel:+13037368465',
  phoneIntl: '+1 303-736-8465',
  email: 'keithc@snoozemattresscompany.com',
  timeZone: 'America/Denver',
  /* no coordinates are asserted until the Google listing (Place ID) is supplied: no geo in the schema */
  geo: null as { latitude: number; longitude: number } | null,
  social: {
    facebook: 'https://www.facebook.com/SnoozeMattressCoCastleRock/',
    instagram: 'https://www.instagram.com/snoozemattress_denver/',
  },
  placeId: PLACE_ID,
  gbpUrl: GBP_URL,
  /* the address links (top bar, footer "Get Directions" / "Open Maps", contact page): the GBP listing once the Place ID
     is supplied, a Google Maps search for the street address until then */
  mapLink: GBP_URL || MAPS_SEARCH,
  mapEmbed: 'https://www.google.com/maps?q=Snooze+Mattress+%2B+Wellness%2C+6360+Promenade+Pkwy%2C+Castle+Rock%2C+CO+80108&output=embed',
  /* the storefront (STORE_PHOTO_URL): '' until supplied — the location cards show PHOTO_PLACEHOLDER, the schema the logo */
  storefrontImage: STORE_PHOTO_URL,
  storefrontAlt: 'Snooze Mattress + Wellness storefront in Castle Rock, CO',
  storefrontPlaceholderAlt: 'Snooze Mattress + Wellness in Castle Rock: store photo coming soon',
  /* the team (TEAM_PHOTO_URL): '' until supplied — the two team images show PHOTO_PLACEHOLDER */
  teamImage: TEAM_PHOTO_URL,
  teamAlt: 'Sleep Coaches at Snooze Mattress + Wellness in Castle Rock',
  teamPlaceholderAlt: 'Photo coming soon: the Sleep Coaches of Snooze Mattress + Wellness in Castle Rock',
  priceRange: '$$',
  /* the cities the store serves (schema areaServed and the area copy), as supplied; no drive times anywhere */
  areaServed: ['Castle Rock', 'Parker', 'Lone Tree', 'Highlands Ranch', 'Castle Pines', 'Centennial'],
  /* the three service-area pages (lib/pages/area.ts), linked from the home page band and the footer */
  serviceAreas: [
    { city: 'Parker', slug: '/mattress-store-parker' },
    { city: 'Highlands Ranch', slug: '/mattress-store-highlands-ranch' },
    { city: 'Lone Tree', slug: '/mattress-store-lone-tree' },
  ],
  hours: {
    en: ['Mon–Sat 10 AM–7 PM', 'Sun 11 AM–6 PM'],
    es: ['Lun–Sáb 10 AM–7 PM', 'Dom 11 AM–6 PM'],
  },
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '10:00', closes: '19:00' },
    { days: ['Sunday'], opens: '11:00', closes: '18:00' },
  ],
};

/** "Castle Rock, Parker, Lone Tree, Highlands Ranch, Castle Pines and Centennial" */
export const areaList = (and = 'and') => `${LOCATION.areaServed.slice(0, -1).join(', ')} ${and} ${LOCATION.areaServed[LOCATION.areaServed.length - 1]}`;

/** the Google "write a review" link for the store, '' until the Place ID is supplied */
export const reviewUrl = () => (LOCATION.placeId ? `https://search.google.com/local/writereview?placeid=${LOCATION.placeId}` : '');
