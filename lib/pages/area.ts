import type { ContentPage } from './types';
import { LOCATION, areaList } from '@/lib/location';

/* Service-area pages (Parker, Highlands Ranch, Lone Tree — November 2026 brief): the Castle Rock store's real facts for
   shoppers from the surrounding south-metro cities — NAP, Dream Mapping, the brands, delivery on orders over $999, financing
   partners — with local FAQs. No drive times (the client has not supplied them) and no claims about the cities beyond
   their names; the store is in Douglas County, in the south Denver metro, as the brief words it. */
const L = LOCATION;
const BRANDS = 'Tempur-Pedic, Sealy, Stearns & Foster, Serta, Beautyrest, Helix, Brooklyn Bedding, FLOWT by King Koil, Snooze Handcrafted by King Koil, Copper by Spring Air, Snooze-O-Pedic, BedTech, BedGear, Sleeptone and DreamFit';
const BRANDS_ES = 'Tempur-Pedic, Sealy, Stearns & Foster, Serta, Beautyrest, Helix, Brooklyn Bedding, FLOWT by King Koil, Snooze Handcrafted by King Koil, Copper by Spring Air, Snooze-O-Pedic, BedTech, BedGear, Sleeptone y DreamFit';

export function areaPage(city: string, slug: string): ContentPage {
  return {
    slug,
    kind: 'area',
    schemaPage: { type: 'WebPage', city },
    copy: {
      en: {
        title: `Serving ${city} from Castle Rock | Snooze Mattress`,
        description: `Mattress shopping from ${city}? Snooze Mattress + Wellness in Castle Rock fits you with free Dream Mapping and delivers free on orders over $999.`,
        crumb: `Serving ${city}`,
        eyebrow: 'Service area',
        h1: `Mattress store serving ${city}, CO`,
        intro: [
          `Snooze Mattress + Wellness is a mattress store at ${L.street}, ${L.city}, ${L.region} ${L.postalCode}, in ${L.county}, in the ${L.metro}, serving ${city} and the rest of ${areaList()}. Here is what a visit from ${city} gets you: a free five-minute Dream Mapping fitting, the brands you know on one floor, Sleep Coaches who are not on commission, financing options, and free delivery and setup on orders over $999.`,
        ],
        sections: [
          { h2: `Why ${city} shoppers come to Snooze in ${L.city}`, paragraphs: [
            `Buying a mattress by brand name or by lying on a few beds for thirty seconds is guesswork. The Dream Mapping bed takes the guesswork out: its sensors record your pressure points in about five minutes, and a Sleep Coach walks you to the mattresses that fit that map. The fitting is free and there is no obligation to buy, which makes the visit from ${city} worth it even if you only come to find out what your body needs.`,
            `The showroom carries ${BRANDS}, from luxury comfort to budget-friendly options, plus adjustable bases, pillows, protectors and sheets fitted to the same profile.`,
          ] },
          { h2: `Delivery and setup for ${city}`, paragraphs: [
            `Delivery and setup are free on orders over $999, and we haul away the old mattress if you no longer need it. Tell the Sleep Coach your ${city} address when you order and they will confirm the delivery window with you.`,
          ] },
          { h2: 'Financing', paragraphs: [
            'Financing is available through Synchrony and Wells Fargo, and Snap Finance offers a lease-to-own option for shoppers who may not qualify for traditional credit. Applications are handled in store; the financing partner makes the approval decision. The financing page has the details and the questions shoppers ask most.',
          ] },
          { h2: 'Before you come in', listStyle: 'facts', bullets: [
            `Store hours: ${L.hours.en[0]}, ${L.hours.en[1]} (Mountain).`,
            `Call ${L.phone} to ask about a specific brand or size, or book a Dream Mapping time online so a Sleep Coach is ready for you.`,
            'Take the 60-second [Sleep Fit Quiz](/sleep-quiz) at home first if you like; the in-store map confirms the result.',
            'Couples are mapped individually, so come together if you share the bed.',
          ] },
        ],
        faqTitle: `Questions from ${city} shoppers`,
        faqs: [
          { question: `Where is the Snooze store for ${city}?`, answer: `At ${L.street}, ${L.city}, ${L.region} ${L.postalCode}, in ${L.county}, open ${L.hours.en[0]} and ${L.hours.en[1]}.` },
          { question: `Do you deliver to ${city}?`, answer: `Yes. Delivery and setup are free on orders over $999; the Sleep Coach confirms the delivery window for your ${city} address when you order.` },
          { question: 'Which other cities do you serve?', answer: `${areaList()}, and the rest of the south Denver metro.` },
          { question: 'Do I need an appointment for Dream Mapping?', answer: 'No. Walk-ins are welcome during store hours, but booking online guarantees a Sleep Coach is ready when you arrive.' },
          { question: 'Which brands can I try in the showroom?', answer: `${BRANDS}, plus adjustable bases, pillows, protectors and sheets.` },
          { question: 'Is financing available?', answer: 'Yes: Synchrony, Wells Fargo, and a Snap Finance lease-to-own option, applied for in store.' },
        ],
        cta: { title: `Book your free fitting from ${city}`, text: `Five minutes on the Dream Mapping bed in ${L.city}, and you leave knowing which mattresses fit the way you sleep.`, button: 'Book a free fitting' },
      },
    },
  };
}
