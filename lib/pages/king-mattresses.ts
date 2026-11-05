import type { ContentPage } from './types';
import { LOCATION } from '@/lib/location';

const L = LOCATION;
export const PAGE: ContentPage = {
  slug: '/king-mattresses',
  kind: 'product',
  schemaPage: { type: 'CollectionPage' },
  copy: {
    en: {
      title: 'King Mattresses in Castle Rock: Room for Two | Snooze Mattress',
      description: 'King and split king mattresses in Castle Rock, CO from Tempur-Pedic, Sealy, Stearns & Foster, Serta and more, fitted to both of you with free Dream Mapping.',
      crumb: 'King Mattresses',
      eyebrow: 'Mattresses by size',
      h1: 'King mattresses in Castle Rock, CO',
      intro: [
        'A standard king mattress is 76 inches wide and 80 inches long: sixteen inches wider than a queen, so each of two sleepers gets the width of a twin to themselves. At Snooze Mattress + Wellness in Castle Rock you can compare king models from the brands on the showroom floor and let a free Dream Mapping fitting match the mattress to both of your bodies.',
      ],
      sections: [
        { h2: 'King, California king and split king', paragraphs: [
          'A king (76 by 80 inches) is the widest standard size. A California king trades four inches of width for four inches of length (72 by 84 inches), which taller sleepers prefer. A split king is two twin XL mattresses (38 by 80 inches each) side by side in a king frame, so each side can be a different comfort level and, on an adjustable base, a different position.',
          'A king needs a bedroom of roughly 12 by 12 feet to leave walking room and space for nightstands. Measure the doorway and the stairs as well: a one-piece king mattress is the hardest size to move, which is one more reason couples choose a split king.',
          'For every size side by side, with room sizes and tips for couples and guests, see our [mattress size guide](/how-to-choose-a-mattress).',
        ] },
        { h2: 'Why couples choose a king at Snooze', paragraphs: [
          'Two people rarely need the same mattress. Dream Mapping maps each of you individually, and the Sleep Coach uses both profiles to find a king that works for both, or a split king where each side is fitted separately. Adjustable bases with customizable head and foot positioning are available for king and split king setups, which couples with different reading or snoring habits appreciate.',
          'The showroom carries Tempur-Pedic, Sealy, Stearns & Foster, Serta, Beautyrest, Helix, Brooklyn Bedding, FLOWT by King Koil, Snooze Handcrafted by King Koil, Copper by Spring Air, Snooze-O-Pedic, BedTech, BedGear, Sleeptone and DreamFit. Ask a Sleep Coach which models are on the floor in king and split king.',
        ] },
        { h2: 'The fitting takes five minutes', paragraphs: [
          'Lie down on the Dream Mapping bed in your usual position, let the sensors read your pressure points, and walk with the Sleep Coach to the king mattresses that fit the map. The fitting is free, there is no obligation to buy, and the Sleep Coaches are not on commission.',
        ] },
        { h2: 'Delivery, financing and the guarantee', listStyle: 'facts', bullets: [
          'Free delivery and setup on orders over $999, with haul-away of your old mattress if you no longer need it.',
          'Financing through Synchrony and Wells Fargo, and a lease-to-own option through Snap Finance.',
          'Snooze Mattress + Wellness offers the 365-Night Sleep Guarantee on major brands; ask a Sleep Coach for the details.',
          `Visit ${L.street}, ${L.city}, ${L.region} ${L.postalCode}, ${L.hours.en[0]}, ${L.hours.en[1]}.`,
        ] },
      ],
      faqTitle: 'King mattress questions',
      faqs: [
        { question: 'How big is a king mattress?', answer: 'A standard king is 76 inches wide by 80 inches long; a California king is 72 by 84 inches.' },
        { question: 'What is a split king?', answer: 'Two twin XL mattresses (38 by 80 inches each) placed side by side in a king frame, so each side can have its own comfort level and, on an adjustable base, its own position.' },
        { question: 'Will a king fit in my bedroom?', answer: 'A king suits a room of about 12 by 12 feet or larger once you allow for nightstands and walking space; measure the doorway and stairs too, or choose a split king, which moves in two pieces.' },
        { question: 'Can two people with different needs share a king?', answer: 'Yes. Dream Mapping maps each of you individually, and a split king lets each side be fitted separately.' },
        { question: 'Do you deliver and set up king mattresses?', answer: 'Yes. Delivery and setup are free on orders over $999, and we can haul away your old mattress.' },
      ],
      cta: { title: 'Try king mattresses in Castle Rock', text: 'A free Dream Mapping fitting for both of you shows which king or split king fits the way each of you sleeps.', button: 'Book a free fitting' },
    },
  },
};
