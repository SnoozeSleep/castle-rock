import type { ContentPage } from './types';
import { LOCATION } from '@/lib/location';

const L = LOCATION;
export const PAGE: ContentPage = {
  slug: '/memory-foam-mattresses',
  kind: 'product',
  schemaPage: { type: 'CollectionPage' },
  copy: {
    en: {
      title: 'Memory Foam Mattresses in Castle Rock, CO | Snooze Mattress',
      description: 'Memory foam mattresses in Castle Rock, CO: Tempur-Pedic and Snooze-O-Pedic at Snooze Mattress + Wellness, fitted to your pressure points for free.',
      crumb: 'Memory Foam Mattresses',
      eyebrow: 'Mattresses by type',
      h1: 'Memory foam mattresses in Castle Rock, CO',
      intro: [
        'Memory foam shapes itself to the body lying on it, which is why it is the first thing many people picture when they think of pressure relief. At Snooze Mattress + Wellness in Castle Rock you can try memory foam from Tempur-Pedic and the Snooze-O-Pedic line, and a free Dream Mapping fitting tells you whether foam is the right answer for your pressure points or whether a hybrid or an innerspring suits you better.',
      ],
      sections: [
        { h2: 'How memory foam feels', paragraphs: [
          'Memory foam softens and contours under body heat and weight, so shoulders and hips sink in while the rest of the body stays supported. The feel is a slow, cradling response rather than the bounce of coils. Because the foam absorbs movement, a partner turning over is felt less on the other side of the bed.',
          'The trade-offs are personal. Some sleepers love the hugged-in feel; others prefer to sleep on top of the mattress rather than in it, and some run warm in dense foam, which is where cooling layers and hybrid designs come in.',
        ] },
        { h2: 'The memory foam brands at Snooze', h3s: [
          { h3: 'Tempur-Pedic', paragraphs: ['The Tempur-Pedic line on the Castle Rock floor includes models with the brand’s all-night cooling technology for sleepers who like the contouring of foam without the warmth.'] },
          { h3: 'Snooze-O-Pedic', paragraphs: ['Snooze-O-Pedic is the store’s own line: a premium knit cover over HD quilt foam and a comfort foam layer, on a pocketed-coil support core with a reinforced edge. It pairs foam comfort with coil support at a budget-friendly price.'] },
        ] },
        { h2: 'Is memory foam right for you? Let the map decide', paragraphs: [
          'A Dream Mapping fitting takes about five minutes on the sensor bed. The map shows where your body carries the most pressure; heavy pressure at the shoulders and hips is the pattern that memory foam relieves best, while a sag through the lower back points to a mattress with firmer support. The Sleep Coach reads the map with you and walks you to the foam, hybrid or innerspring models that fit it. The fitting is free, and nobody at Snooze is on commission.',
          'Still weighing foam against coils? Our guide to [memory foam vs hybrid](/blog/memory-foam-vs-hybrid-mattress-castle-rock) compares how each handles summer heat, back comfort, couples and lifespan.',
        ] },
        { h2: 'Delivery, financing and the guarantee', listStyle: 'facts', bullets: [
          'Free delivery and setup on orders over $999, with haul-away of your old mattress if you no longer need it.',
          'Financing through Synchrony and Wells Fargo, and a lease-to-own option through Snap Finance.',
          'Snooze Mattress + Wellness offers the 365-Night Sleep Guarantee on major brands; ask a Sleep Coach for the details.',
          `Visit ${L.street}, ${L.city}, ${L.region} ${L.postalCode}, ${L.hours.en[0]}, ${L.hours.en[1]}.`,
        ] },
      ],
      faqTitle: 'Memory foam questions',
      faqs: [
        { question: 'Which memory foam brands does Snooze carry?', answer: 'Tempur-Pedic and the store’s own Snooze-O-Pedic line are on the Castle Rock showroom floor.' },
        { question: 'Is memory foam good for side sleepers?', answer: 'Often, yes: it lets shoulders and hips sink in, which relieves the pressure points side sleepers feel most; the Dream Mapping fitting confirms it for your body.' },
        { question: 'Does memory foam sleep hot?', answer: 'Dense foam can hold warmth, which is why Tempur-Pedic offers cooling technology and why some sleepers choose a hybrid; try both in the showroom.' },
        { question: 'Can I put a memory foam mattress on an adjustable base?', answer: 'Yes. Foam mattresses bend well, and adjustable bases with customizable head and foot positioning are available in the store.' },
        { question: 'How do I know if foam or coils are better for me?', answer: 'A free five-minute Dream Mapping fitting shows where your body needs relief and where it needs support, and the Sleep Coach walks you to the models that match.' },
      ],
      cta: { title: 'Try memory foam in Castle Rock', text: 'Lie on the Dream Mapping bed for five minutes and find out whether foam, hybrid or coils fit the way you sleep.', button: 'Book a free fitting' },
    },
  },
};
