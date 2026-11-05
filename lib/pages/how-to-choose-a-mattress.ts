import type { ContentPage } from './types';
import { LOCATION } from '@/lib/location';

/* The size and comfort tables use standard US mattress dimensions and the five comfort levels the Sleep Fit Quiz
   already uses on the site (Plush, Medium-Soft, Medium, Medium-Firm, Firm) — no prices, no brand comparisons. */
const L = LOCATION;
export const PAGE: ContentPage = {
  slug: '/how-to-choose-a-mattress',
  kind: 'guide',
  copy: {
    en: {
      title: 'How to Choose a Mattress in Castle Rock | Snooze Mattress',
      description: 'How to choose a mattress in Castle Rock: standard sizes, the five comfort levels, sleep position, what to try in the showroom, and free Dream Mapping.',
      crumb: 'How to Choose a Mattress',
      eyebrow: 'Buying guide',
      h1: 'How to choose a mattress',
      intro: [
        'Most people replace a mattress every ten years or so, which means most of us are out of practice when the time comes. This guide covers the four decisions in order: the size, the comfort level, the type of construction, and the extras, and it ends with the shortcut Snooze Mattress + Wellness in Castle Rock offers for the hardest one: a free Dream Mapping fitting that measures your pressure points instead of guessing.',
      ],
      sections: [
        { h2: '1. Pick the size for the room and the sleepers', paragraphs: [
          'Size is the easy decision, so settle it first. Measure the bedroom, leave room to walk around the bed and open drawers, and check the doorway and stairs the mattress has to pass through. Two adults are comfortable on a queen; couples who want more space, or who sleep very differently, choose a king or a split king. The table below lists the standard sizes.',
        ] },
        { h2: '2. Match the comfort level to how you sleep', paragraphs: [
          'Comfort level is how soft or firm the surface feels. It is not the same as support: a plush mattress can support a spine perfectly well, and a firm one can leave a side sleeper’s shoulder aching. The Sleep Fit Quiz and the Dream Mapping fitting both use five levels, from Plush to Firm.',
          'As a rule of thumb, side sleepers need shoulders and hips to sink in, so they map toward Plush and Medium-Soft; back sleepers sit in the middle; stomach sleepers need the firmest support so the hips do not sag. Weight and age move the answer too, which is why a measurement beats a rule of thumb.',
        ] },
        { h2: '3. Choose the construction', h3s: [
          { h3: 'Memory foam', paragraphs: ['Contours closely, relieves pressure points and absorbs a partner’s movement; dense foam can hold warmth, so cooling versions exist. Tempur-Pedic and Snooze-O-Pedic are the foam names on the Castle Rock floor.'] },
          { h3: 'Hybrid', paragraphs: ['Comfort layers over pocketed coils: a cushioned top with the airflow and bounce of a coil core. Most of the Sealy, Stearns & Foster, Beautyrest, Helix and King Koil models in the showroom are hybrids.'] },
          { h3: 'Innerspring', paragraphs: ['A coil core with a thinner comfort layer: the firmest, most breathable feel, and usually the most budget-friendly.'] },
        ] },
        { h2: '4. Decide on the extras', listStyle: 'cards', bullets: [
          'An adjustable base raises the head and feet, helps relieve pressure, reduces snoring and supports a healthier sleep posture; a split king lets each side be set separately.',
          'A mattress protector guards against spills, stains and allergens without changing the feel.',
          'A pillow chosen for your sleep position keeps the neck in line with the spine the mattress is now supporting.',
          'Breathable sheets matter in Colorado’s dry, high-altitude air: the whole bed sleeps cooler.',
        ] },
        { h2: '5. Try it the measured way', paragraphs: [
          'Lying on a few beds for thirty seconds each tells you which one feels nice in the moment, not which one will hold your spine level for eight hours. The Dream Mapping bed records your pressure points in about five minutes; a Sleep Coach reads the map with you and walks you only to the mattresses that match it. It is free, there is no obligation, and nobody at Snooze is on commission.',
          `Snooze Mattress + Wellness is at ${L.street}, ${L.city}, ${L.region} ${L.postalCode}, open ${L.hours.en[0]} and ${L.hours.en[1]}. Delivery and setup are free on orders over $999, financing is available through Synchrony, Wells Fargo and Snap, and the store offers the 365-Night Sleep Guarantee on major brands. The showroom carries Tempur-Pedic, Sealy, Stearns & Foster, Serta, Beautyrest, Helix, Brooklyn Bedding, FLOWT by King Koil, Snooze Handcrafted by King Koil, Copper by Spring Air, Snooze-O-Pedic, BedTech, BedGear, Sleeptone and DreamFit.`,
        ] },
      ],
      table: {
        caption: 'Standard mattress sizes and who they suit',
        head: ['Size', 'Dimensions', 'Typically for'],
        rows: [
          ['Twin', '38 × 75 in', 'Children, bunk beds, daybeds'],
          ['Twin XL', '38 × 80 in', 'Tall teens, dorms, each half of a split king'],
          ['Full', '54 × 75 in', 'One adult, guest rooms, smaller bedrooms'],
          ['Queen', '60 × 80 in', 'Couples in a standard bedroom; the most common size'],
          ['King', '76 × 80 in', 'Couples who want the width of a twin each'],
          ['California King', '72 × 84 in', 'Taller sleepers who trade width for length'],
          ['Comfort levels', 'Plush · Medium-Soft · Medium · Medium-Firm · Firm', 'Side sleepers lean plush, back sleepers medium, stomach sleepers firm; the fitting decides'],
        ],
      },
      faqTitle: 'Mattress buying questions',
      faqs: [
        { question: 'How often should a mattress be replaced?', answer: 'Most mattresses are replaced after seven to ten years, or sooner if you wake up stiff or can feel the springs or a body impression.' },
        { question: 'What is the most popular mattress size?', answer: 'Queen, 60 by 80 inches: wide enough for two adults in a standard bedroom.' },
        { question: 'Soft or firm, which is better?', answer: 'Neither on its own. The right comfort level depends on your sleep position, weight and pressure points, which the free Dream Mapping fitting measures.' },
        { question: 'What is the difference between a hybrid and memory foam?', answer: 'A hybrid puts comfort layers over pocketed coils for airflow and bounce; memory foam contours more closely and absorbs movement.' },
        { question: 'Can I try before I buy?', answer: 'Yes. Every brand on this page is on the Castle Rock showroom floor, and the Dream Mapping fitting narrows them to the ones that fit how you sleep.' },
        { question: 'Is the fitting really free?', answer: 'Yes, about five minutes on the sensor bed, with no obligation to buy.' },
      ],
      cta: { title: 'Skip the guesswork', text: 'Book a free Dream Mapping fitting in Castle Rock and let the pressure map choose the comfort level for you.', button: 'Book a free fitting' },
    },
  },
};
