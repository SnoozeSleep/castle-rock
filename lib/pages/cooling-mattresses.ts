import type { ContentPage } from './types';
import { LOCATION } from '@/lib/location';

const L = LOCATION;
export const PAGE: ContentPage = {
  slug: '/cooling-mattresses',
  kind: 'product',
  schemaPage: { type: 'CollectionPage' },
  copy: {
    en: {
      title: 'Cooling Mattresses in Castle Rock, CO | Snooze Mattress',
      description: 'Cooling mattresses in Castle Rock, CO for dry air and heated winter bedrooms: Tempur-Pedic cooling models and the Spring Air Copper Collection, fitted free.',
      crumb: 'Cooling Mattresses',
      eyebrow: 'Mattresses by type',
      h1: 'Cooling mattresses for Colorado summers and heated winters',
      intro: [
        'Sleeping warm is not only a summer problem in Castle Rock. Bright summer sun can leave a bedroom holding heat, and in winter the dry indoor heat does the same under a heavy comforter. If you kick the covers off at 2 a.m. or wake up damp, the mattress is often the reason: a dense surface that traps heat against you. Snooze Mattress + Wellness carries mattresses designed to move heat away from the sleeper, and the free Dream Mapping fitting makes sure the cooling model you choose also fits your pressure points.',
      ],
      sections: [
        { h2: 'Why a mattress sleeps hot', paragraphs: [
          'Foam that hugs the body also holds the warmth the body gives off, and the deeper you sink the more surface is in contact with you. Cooling designs work on that problem in different ways: open or breathable foams, covers and layers that pull heat away, and coil or hybrid cores that let air move. The feel you want decides which approach fits you.',
          'Wondering whether memory foam sleeps hotter than a hybrid? Our [buying guide](/how-to-choose-a-mattress) compares the two.',
        ] },
        { h2: 'Cooling models on the Castle Rock floor', h3s: [
          { h3: 'Tempur-Pedic', paragraphs: ['Tempur-Pedic’s cooling models bring the brand’s all-night cooling technology to its contouring foam, for sleepers who want the Tempur feel without the warmth.'] },
          { h3: 'Spring Air Copper Collection', paragraphs: ['The Copper Collection by Spring Air pairs copper-infused comfort layers with a supportive core; copper is used in bedding for its ability to conduct heat away from the body.'] },
          { h3: 'Hybrids and innersprings', paragraphs: ['Hybrids from Sealy, Stearns & Foster, Beautyrest, Helix and King Koil put comfort layers over pocketed coils, so air circulates through the core instead of being trapped under you.'] },
        ] },
        { h2: 'Cooling is only half the fitting', paragraphs: [
          'A cool mattress that does not support you is still the wrong mattress. The Dream Mapping bed records your pressure points in about five minutes, and the Sleep Coach shows you the cooling models that also match your map, in the comfort level the map calls for. Pair the mattress with breathable sheets and a pillow chosen for your sleep position, both on the Castle Rock floor, and the whole bed sleeps cooler through a sunny July and a dry, heated January alike.',
        ] },
        { h2: 'Delivery, financing and the guarantee', listStyle: 'facts', bullets: [
          'Free delivery and setup on orders over $999, with haul-away of your old mattress if you no longer need it.',
          'Financing through Synchrony and Wells Fargo, and a lease-to-own option through Snap Finance.',
          'Snooze Mattress + Wellness offers the 365-Night Sleep Guarantee on major brands; ask a Sleep Coach for the details.',
          `Visit ${L.street}, ${L.city}, ${L.region} ${L.postalCode}, ${L.hours.en[0]}, ${L.hours.en[1]}.`,
        ] },
      ],
      faqTitle: 'Cooling mattress questions',
      faqs: [
        { question: 'Which cooling mattresses does Snooze carry?', answer: 'Tempur-Pedic cooling models and the Spring Air Copper Collection, plus hybrids from Sealy, Stearns & Foster, Beautyrest, Helix and King Koil whose coil cores let air move.' },
        { question: 'Does memory foam always sleep hot?', answer: 'Dense foam holds more warmth than coils, which is why cooling versions exist; a Tempur-Pedic cooling model gives the foam feel with less heat.' },
        { question: 'Is a hybrid cooler than an all-foam mattress?', answer: 'Usually, because air circulates through the coil core instead of being trapped under you; the fitting tells you whether a hybrid also suits your pressure points.' },
        { question: 'Do I need a cooling mattress in a Colorado winter?', answer: 'Dry indoor heat and heavy winter bedding trap warmth too, so a breathable mattress helps year-round; the fitting shows which one also supports you.' },
        { question: 'Can I try the cooling models before buying?', answer: 'Yes. They are on the Castle Rock showroom floor, and the free Dream Mapping fitting narrows them to the ones that fit how you sleep.' },
        { question: 'Do sheets and pillows matter for sleeping cool?', answer: 'Yes. Breathable sheets and a pillow chosen for your position keep heat from building around you; both are available in store.' },
      ],
      cta: { title: 'Sleep cooler in Castle Rock', text: 'A free five-minute Dream Mapping fitting shows which cooling mattress also fits your body.', button: 'Book a free fitting' },
    },
  },
};
