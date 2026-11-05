import type { ContentPage } from './types';
import { LOCATION } from '@/lib/location';
import { dreamMappingService } from '@/lib/schema';

export const PAGE: ContentPage = {
  slug: '/dream-mapping',
  kind: 'guide',
  /* the Dream Mapping Service (lib/schema.ts: …/dream-mapping#service, provider the store, free offer, ReserveAction
     to /booking); /booking renders the same node */
  extraSchema: (locale) => [dreamMappingService(locale)],
  copy: {
    en: {
      title: 'Dream Mapping Fitting in Castle Rock, CO | Snooze Mattress',
      description: 'What Dream Mapping measures, how long it takes and how it finds your mattress: a free 5-minute fitting at Snooze Mattress + Wellness in Castle Rock, CO.',
      crumb: 'Dream Mapping',
      eyebrow: 'Free in-store fitting',
      h1: 'Dream Mapping: the 5-minute mattress fitting in Castle Rock',
      intro: [
        'Dream Mapping is how Snooze Mattress + Wellness takes the guesswork out of choosing a mattress. You lie down on a sensor bed in the Castle Rock showroom, the system reads your pressure points, and a Sleep Coach walks you straight to the mattresses that match your body. It is free, it takes about five minutes, and there is no obligation to buy.',
        'This page explains what the map measures, what you see on the screen, how it differs from the online Sleep Fit Quiz, and what to expect when you visit.',
      ],
      sections: [
        { h2: 'What Dream Mapping measures', paragraphs: [
          'The Dream Mapping bed is covered in pressure sensors. When you lie on it in the position you usually sleep in, the sensors record where your body presses hardest and where it barely touches the surface: shoulders, hips, lower back, knees. Those readings are the pressure points that decide whether a mattress will feel supportive or leave you tossing and turning.',
          'Your weight distribution, your sleep position and your individual shape all show up in the reading, so two people of the same height can get very different maps.',
        ] },
        { h2: 'What the map shows', paragraphs: [
          'The screen shows an outline of your body with a colour scale. Red marks high pressure, yellow marks medium pressure and blue or green marks light pressure. A Sleep Coach reads the pattern with you: a lot of red at the hips and shoulders points to a mattress that relieves pressure; a sag through the lower back points to one with firmer support.',
          'From that pattern the system narrows the showroom down to the mattresses that fit your profile, so instead of trying every bed on the floor you try only the ones built for how you sleep.',
        ] },
        { h2: 'How long it takes and what it costs', paragraphs: [
          'The scan itself takes about five minutes. Including the walk-through of your results and the first mattresses to try, most visits take well under half an hour. Dream Mapping is free, and there is never any pressure to buy: the Sleep Coaches at Snooze are not on commission.',
        ] },
        { h2: 'Dream Mapping or the Sleep Fit Quiz?', paragraphs: [
          'The Sleep Fit Quiz is the online version: five quick questions about how you sleep that match you to a comfort level, a support level and the features worth trying. It takes about 60 seconds and you can do it from home.',
          'Dream Mapping is the in-store measurement. It uses the sensor bed rather than your answers, so it catches the pressure points you cannot feel yourself. The quiz is a good first step; the map is the fitting. Many shoppers do both: take the quiz at home, then confirm the result on the bed.',
        ] },
        { h2: 'Couples', paragraphs: [
          'Couples are mapped individually, and the recommendation accounts for both profiles. If one of you needs more pressure relief and the other more support, the Sleep Coach will show you the mattresses that work for both, and the adjustable bases that let each side be set differently.',
        ] },
        { h2: 'What to bring and how to book', paragraphs: [
          'Nothing special: wear whatever is comfortable and plan to lie down for a few minutes in your usual sleep position. Walk-ins are welcome during store hours, or book a time online so a Sleep Coach is ready for you.',
          `Snooze Mattress + Wellness is at ${LOCATION.street}, ${LOCATION.city}, ${LOCATION.region} ${LOCATION.postalCode}, open ${LOCATION.hours.en[0]} and ${LOCATION.hours.en[1]}. Call ${LOCATION.phone} with any question.`,
        ] },
      ],
      faqTitle: 'Dream Mapping questions',
      faqs: [
        { question: 'Is Dream Mapping really free?', answer: 'Yes. The fitting is free and there is no obligation to buy anything afterwards.' },
        { question: 'How long does Dream Mapping take?', answer: 'About five minutes for the scan, then a short walk-through of your results with a Sleep Coach.' },
        { question: 'Do I need an appointment?', answer: 'No. Walk-ins are welcome during store hours, but booking online guarantees a Sleep Coach is ready when you arrive.' },
        { question: 'Can my partner and I be mapped together?', answer: 'Yes. Each of you is mapped individually and the recommendation accounts for both profiles.' },
        { question: 'What is the difference between Dream Mapping and the Sleep Fit Quiz?', answer: 'The quiz is a 60-second online questionnaire; Dream Mapping is the in-store pressure measurement on the sensor bed. The quiz is a first step, the map is the fitting.' },
        { question: 'Is there any pressure to buy?', answer: 'No. The Sleep Coaches are not on commission, and you can leave with your results and come back another day.' },
      ],
      cta: { title: 'Book your free Dream Mapping fitting', text: 'Five minutes on the sensor bed in Castle Rock, and you will know which mattresses fit the way you sleep.', button: 'Book a free fitting' },
    },
  },
};
