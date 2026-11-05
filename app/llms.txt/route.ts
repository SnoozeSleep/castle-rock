import { LOCATION, SITE_URL, areaList } from '@/lib/location';
import BRANDS from '@/lib/brands.json';
import { postsFor } from '@/lib/blog-posts';

/* /llms.txt — a plain-text guide to this site for AI assistants (the agency's AI-visibility review, November 4, 2026;
   robots.txt points at it in a comment). Prerendered once at build time, like the sitemap, so every link carries the
   site's canonical origin (lib/location.ts SITE_URL: the custom domain once NEXT_PUBLIC_SITE_URL is set, the deployment
   host until then). Only facts the site states: the NAP, the hours, Dream Mapping, the brand lineup (lib/brands.json),
   delivery and financing as the pages describe them, the areas served; the guides list grows with lib/blog-posts.ts. */
export const dynamic = 'force-static';

const L = LOCATION;
const u = (path: string) => (path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`);
const line = (label: string, path: string, note = '') => `- [${label}](${u(path)})${note ? `: ${note}` : ''}`;

export function GET() {
  const brands = BRANDS.mattressBrands.map((b) => (b === 'Snooze-O-Pedic' ? `${b} (sold only at Snooze)` : b)).join(', ');
  const posts = postsFor('en').map((p) => line(p.title, `/blog/${p.slug}`));
  const text = [
    `# Snooze Mattress + Wellness — ${L.city}, ${L.region}`,
    '',
    `> Mattress store at ${L.street}, ${L.city}, ${L.region} ${L.postalCode}, in ${L.county} (the ${L.metro}), serving ${areaList()}. Shoppers get a free, about five-minute in-store Dream Mapping fitting: a sensor bed reads their pressure points and recommends the mattresses that fit their body. The store carries the major mattress brands plus the Snooze-O-Pedic line, which is sold only at Snooze, along with adjustable bases, pillows, protectors, sheets, massage chairs and the Zcliner sleep recliner. Financing is available through Synchrony and Wells Fargo, and Snap Finance offers lease-to-own.`,
    '',
    'Key facts:',
    `- Phone: ${L.phone}`,
    `- Email: ${L.email}`,
    `- Hours: ${L.hours.en[0]}, ${L.hours.en[1]} (Mountain)`,
    `- Appointments: walk-ins welcome; book a free Dream Mapping fitting at ${u('/booking')}`,
    '- Delivery: we deliver and set up your new mattress, free on orders over $999, and haul away your old mattress if you no longer need it',
    '- Sleep Coaches are not on commission',
    `- Brands: ${brands}`,
    '',
    '## Store and service',
    line('Home', '/', `Overview of the ${L.city} store, Dream Mapping, brands, guarantee and financing`),
    line('Dream Mapping', '/dream-mapping', 'How the free pressure-mapping mattress fitting works'),
    line('Book a fitting', '/booking', 'Online booking for a Dream Mapping appointment'),
    line('About us', '/about-us', `The ${L.city} store and its Sleep Coaches`),
    line('FAQ', '/faq', 'Answers about Dream Mapping, the store, delivery and financing'),
    line('Contact', '/contact-us', 'Address, phone, hours and directions'),
    '',
    '## Products',
    line('Mattresses', '/mattresses', 'Brands and mattress types in the showroom'),
    line('Queen mattresses', '/queen-mattresses'),
    line('King mattresses', '/king-mattresses'),
    line('Full and twin mattresses', '/full-twin-mattresses'),
    line('Memory foam mattresses', '/memory-foam-mattresses'),
    line('Mattresses for back pain', '/mattresses-for-back-pain'),
    line('Cooling mattresses', '/cooling-mattresses'),
    line('Adjustable bases', '/adjustable-mattress-bases'),
    line('Pillows', '/pillows'),
    line('Mattress protectors', '/mattress-protectors'),
    line('Premium sheets', '/premium-sheets'),
    line('Massage chairs', '/massage-chairs'),
    line('Sleep recliner', '/sleep-recliner', 'The Zcliner'),
    line('At-home sleep test kit', '/at-home-sleep-test-kit-by-sleepcorner'),
    '',
    '## Financing and offers',
    line('Mattress financing', '/mattress-financing', 'Synchrony, Wells Fargo and Snap Finance lease-to-own'),
    line('Current sales', '/mattress-sales'),
    '',
    '## Guides',
    line('How to choose a mattress', '/how-to-choose-a-mattress'),
    line('Sleep Fit Quiz', '/sleep-quiz', '60-second online questionnaire'),
    ...(posts.length ? [line('Sleep Blog', '/blog'), ...posts] : []),
    '',
    '## Areas served',
    ...L.serviceAreas.map((a) => line(`${a.city}, ${L.region}`, a.slug)),
    '',
    '## Optional',
    line('Privacy policy', '/privacy-policy-page'),
    line('Terms and conditions', '/terms-conditions-page'),
    '',
  ].join('\n');
  return new Response(text, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
