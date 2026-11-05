import type { ContentPage } from './types';
import { LOCATION } from '@/lib/location';

const L = LOCATION;
export const PAGE: ContentPage = {
  slug: '/queen-mattresses',
  kind: 'product',
  schemaPage: { type: 'CollectionPage' },
  copy: {
    en: {
      title: 'Queen Mattresses in Castle Rock, CO | Snooze Mattress',
      description: 'Queen mattresses in Castle Rock, CO from Tempur-Pedic, Sealy, Stearns & Foster, Serta, Beautyrest and more, fitted to you in a free Dream Mapping session.',
      crumb: 'Queen Mattresses',
      eyebrow: 'Mattresses by size',
      h1: 'Queen mattresses in Castle Rock, CO',
      intro: [
        'A queen mattress is 60 inches wide and 80 inches long, the standard size for a couple in a regular bedroom and a roomy choice for one person. At Snooze Mattress + Wellness in Castle Rock you can try queen models from the brands on the showroom floor and let a free Dream Mapping fitting show you which ones match the way you sleep.',
      ],
      sections: [
        { h2: 'Who a queen is right for', paragraphs: [
          'Queen is the size most bedrooms are planned around: wide enough for two adults to sleep comfortably without the footprint of a king, and long enough for most sleepers. It leaves room for nightstands in a 10-by-10-foot room, which is why it is the most common choice for primary bedrooms and the usual pick for a well-furnished guest room.',
          'Couples who want more space than a full without going to a king, taller sleepers who need the extra five inches of length over a full, and anyone who shares the bed with a child or a pet on weekend mornings all tend to land on a queen.',
          'Not sure between full, queen and king? Our [mattress size guide](/how-to-choose-a-mattress) has the real dimensions, room sizes and who each size suits.',
        ] },
        { h2: 'Queen brands and comfort levels at Snooze', paragraphs: [
          'The Castle Rock showroom carries Tempur-Pedic, Sealy, Stearns & Foster, Serta, Beautyrest, Helix, Brooklyn Bedding, FLOWT by King Koil, Snooze Handcrafted by King Koil, Copper by Spring Air, Snooze-O-Pedic, BedTech, BedGear, Sleeptone and DreamFit, from luxury comfort and advanced sleep technology to budget-friendly options. Comfort levels run from plush to firm, so there is a queen for side sleepers who need pressure relief at the shoulders and hips as well as for back and stomach sleepers who need firmer support.',
          'Ask a Sleep Coach which models are on the floor in queen; the selection changes with the season and the current sale.',
        ] },
        { h2: 'Find your queen with Dream Mapping', paragraphs: [
          'Rather than lying on every bed in the store, start with the Dream Mapping bed. In about five minutes its pressure sensors map where your body needs support and where it needs relief, and the Sleep Coach walks you to the queen mattresses that fit that map. The fitting is free and there is no obligation to buy.',
          'Couples are mapped individually, so a queen that works for both of you is chosen from both profiles. An adjustable base is available for queen mattresses if you want to raise your head or feet.',
        ] },
        { h2: 'Delivery, financing and what comes with your queen', listStyle: 'facts', bullets: [
          'Free delivery and setup on orders over $999, with haul-away of your old mattress if you no longer need it.',
          'Financing through Synchrony and Wells Fargo, and a lease-to-own option through Snap Finance.',
          'Snooze Mattress + Wellness offers the 365-Night Sleep Guarantee on major brands; ask a Sleep Coach for the details.',
          `Try them in person at ${L.street}, ${L.city}, ${L.region} ${L.postalCode}, ${L.hours.en[0]}, ${L.hours.en[1]}.`,
        ] },
      ],
      faqTitle: 'Queen mattress questions',
      faqs: [
        { question: 'How big is a queen mattress?', answer: 'A standard queen is 60 inches wide by 80 inches long, six inches wider and five inches longer than a full.' },
        { question: 'Is a queen big enough for two people?', answer: 'Yes. A queen gives each of two adults 30 inches of width, which is why it is the most common size for couples in a regular bedroom.' },
        { question: 'Which queen mattress is best for a side sleeper?', answer: 'The one that relieves pressure at your shoulders and hips, which is what the Dream Mapping fitting measures; most side sleepers land in the plush to medium range.' },
        { question: 'Can I put a queen mattress on an adjustable base?', answer: 'Yes. Adjustable bases are available for queen mattresses, with customizable head and foot positioning.' },
        { question: 'Do you deliver queen mattresses?', answer: 'Yes. Delivery and setup are free on orders over $999, and we can haul away your old mattress.' },
      ],
      cta: { title: 'Try queen mattresses in Castle Rock', text: 'A free five-minute Dream Mapping fitting shows you which queen models fit the way you sleep.', button: 'Book a free fitting' },
    },
  },
};
