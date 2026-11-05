import type { ContentPage } from './types';
import { LOCATION } from '@/lib/location';

const L = LOCATION;
export const PAGE: ContentPage = {
  slug: '/full-twin-mattresses',
  kind: 'product',
  schemaPage: { type: 'CollectionPage' },
  copy: {
    en: {
      title: 'Full & Twin Mattresses in Castle Rock, CO | Snooze Mattress',
      description: 'Twin, twin XL and full mattresses in Castle Rock for kids, guest rooms and smaller bedrooms, from the brands at Snooze, fitted with free Dream Mapping.',
      crumb: 'Full & Twin Mattresses',
      eyebrow: 'Mattresses by size',
      h1: 'Full and twin mattresses in Castle Rock, CO',
      intro: [
        'Twin, twin XL and full are the sizes for kids’ rooms, guest rooms, bunk beds, dorms and smaller bedrooms, and one of each makes up a split king. Snooze Mattress + Wellness in Castle Rock carries them from the same brands as the bigger sizes, and the same free Dream Mapping fitting applies: a child or a guest deserves a mattress that fits how they sleep too.',
      ],
      sections: [
        { h2: 'Twin, twin XL or full: the sizes', paragraphs: [
          'A twin is 38 inches wide and 75 inches long, the standard size for a child’s bed, a bunk bed or a daybed. A twin XL adds five inches of length (38 by 80 inches): the size of a dorm bed, the right call for a tall teenager, and the size that pairs up to form a split king on an adjustable base. A full, also called a double, is 54 inches wide and 75 inches long, a generous single bed and a workable size for a guest room where a queen will not fit.',
          'Two adults can share a full, but with only 27 inches each it suits occasional use rather than every night. Couples are usually better served by a queen or a king.',
          'Our [mattress size guide](/how-to-choose-a-mattress) compares every size, from twin to California king, with the room each one needs.',
        ] },
        { h2: 'Who buys which size', listStyle: 'cards', bullets: [
          'Twin: children moving out of a toddler bed, bunk beds, daybeds and trundles.',
          'Twin XL: tall teenagers, dorm rooms, and each half of a split king.',
          'Full: a teenager or an adult sleeping alone, a guest room, a smaller primary bedroom.',
        ] },
        { h2: 'Fitted like every other size', paragraphs: [
          'Smaller sizes get the same fitting as a king. Dream Mapping takes about five minutes on the sensor bed, costs nothing, and shows the Sleep Coach which comfort level and support the sleeper needs, which matters for a growing child as much as for an adult. The showroom carries Tempur-Pedic, Sealy, Stearns & Foster, Serta, Beautyrest, Helix, Brooklyn Bedding, FLOWT by King Koil, Snooze Handcrafted by King Koil, Copper by Spring Air, Snooze-O-Pedic, BedTech, BedGear, Sleeptone and DreamFit; ask which models are on the floor in twin, twin XL and full.',
          'Mattress protectors are a sensible addition for kids’ and guest beds: they guard the mattress against spills, stains and allergens while keeping the feel of the mattress.',
        ] },
        { h2: 'Delivery, financing and the guarantee', listStyle: 'facts', bullets: [
          'Free delivery and setup on orders over $999, with haul-away of the old mattress if you no longer need it.',
          'Financing through Synchrony and Wells Fargo, and a lease-to-own option through Snap Finance.',
          'Snooze Mattress + Wellness offers the 365-Night Sleep Guarantee on major brands; ask a Sleep Coach for the details.',
          `Visit ${L.street}, ${L.city}, ${L.region} ${L.postalCode}, ${L.hours.en[0]}, ${L.hours.en[1]}.`,
        ] },
      ],
      faqTitle: 'Full and twin mattress questions',
      faqs: [
        { question: 'What is the difference between a twin and a twin XL?', answer: 'Length: a twin is 38 by 75 inches and a twin XL is 38 by 80 inches, the same length as a queen or king.' },
        { question: 'How big is a full mattress?', answer: 'A full (double) is 54 inches wide by 75 inches long.' },
        { question: 'Is a full mattress big enough for two adults?', answer: 'It works for occasional use, but at 27 inches per person most couples are better served by a queen or a king.' },
        { question: 'Can a child get a Dream Mapping fitting?', answer: 'Yes. The fitting takes about five minutes and shows which comfort and support level fits any sleeper.' },
        { question: 'Which size makes a split king?', answer: 'Two twin XL mattresses side by side in a king frame.' },
      ],
      cta: { title: 'Find the right twin or full in Castle Rock', text: 'Bring the sleeper in for a free five-minute Dream Mapping fitting and try the smaller sizes on the showroom floor.', button: 'Book a free fitting' },
    },
  },
};
