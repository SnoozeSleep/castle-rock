import type { ContentPage } from './types';
import { LOCATION } from '@/lib/location';

const L = LOCATION;
export const PAGE: ContentPage = {
  slug: '/mattresses-for-back-pain',
  kind: 'guide',
  schemaPage: { type: 'CollectionPage' },
  copy: {
    en: {
      title: 'Mattresses for Back Pain in Castle Rock | Snooze Mattress',
      description: 'Mattresses for back pain and side sleepers in Castle Rock, CO: a free Dream Mapping scan finds your pressure points and the Sleep Coach finds the support.',
      crumb: 'Back Pain & Side Sleepers',
      eyebrow: 'Mattresses by need',
      h1: 'Mattresses for back pain and side sleepers in Castle Rock',
      intro: [
        'If you wake up stiff, or your shoulder and hip ache after a night on your side, the mattress is the first thing to check. Snooze Mattress + Wellness in Castle Rock does not guess at the answer: a free Dream Mapping fitting shows where your body is carrying pressure and where it is losing support, and the Sleep Coach walks you to the mattresses built for that pattern.',
      ],
      sections: [
        { h2: 'What the pressure map shows about back pain', paragraphs: [
          'Lie on the Dream Mapping bed and the sensors draw your pressure points on screen: red for high pressure, yellow for medium, blue for light. Two patterns matter most. A gap or a sag through the lower back means the mattress you are used to is not holding your spine level, so the muscles work all night. Heavy red at the shoulders and hips, especially on your side, means those joints are taking the load instead of sinking into the surface.',
          'Steady, even support that keeps the spine in line is what helps reduce lower-back pressure and morning stiffness; pressure-relieving comfort layers that let shoulders and hips sink in just enough are what stop pressure points waking you. Most back-pain shoppers need a measured balance of both, which is exactly what the map is for.',
        ] },
        { h2: 'Side sleepers', paragraphs: [
          'On your side, the body’s weight concentrates on a shoulder and a hip. A surface that is too firm pushes back on them; one that is too soft lets the hips drop and bends the spine. The fitting usually puts side sleepers in the plush to medium range with zoned support underneath, and a pillow that fills the gap between ear and shoulder finishes the job. The pillows on the Castle Rock floor are chosen for the sleeper’s position too.',
        ] },
        { h2: 'Back and stomach sleepers', paragraphs: [
          'Back sleepers do best when the lower back is supported without the hips sinking; stomach sleepers need the firmest support of all so the midsection does not sag. The map shows whether your current mattress is letting you sink, and the Sleep Coach can take you straight to the medium-firm and firm models on the floor. The showroom carries Tempur-Pedic, Sealy, Stearns & Foster, Serta, Beautyrest, Helix, Brooklyn Bedding, FLOWT by King Koil, Snooze Handcrafted by King Koil, Copper by Spring Air, Snooze-O-Pedic, BedTech, BedGear, Sleeptone and DreamFit.',
        ] },
        { h2: 'Adjustable bases for back pain', paragraphs: [
          'An adjustable base with customizable head and foot positioning helps relieve pressure, supports a healthier sleep posture and lets you raise your knees slightly, a position many back-pain sufferers find easier for falling asleep. Couples can set each side of a split king differently.',
        ] },
        { h2: 'What to expect at the fitting', listStyle: 'steps', bullets: [
          'About five minutes on the sensor bed, lying in the position you usually sleep in; free, with no obligation to buy.',
          'A walk-through of your map with a Sleep Coach, then only the mattresses that match it.',
          'Couples are mapped individually.',
          `Walk in or book a time at ${L.street}, ${L.city}, ${L.region} ${L.postalCode}, ${L.hours.en[0]}, ${L.hours.en[1]}.`,
        ] },
      ],
      faqTitle: 'Back pain and side sleeping questions',
      faqs: [
        { question: 'Is a firm mattress better for back pain?', answer: 'Not automatically. Back pain needs even support that keeps the spine level, and the right firmness depends on your weight, position and pressure points, which is what the Dream Mapping fitting measures.' },
        { question: 'What mattress is best for a side sleeper with shoulder pain?', answer: 'One with pressure-relieving comfort layers that let the shoulder and hip sink in while zoned support keeps the spine straight; most side sleepers map into the plush to medium range.' },
        { question: 'Can a mattress fitting really find the cause of my morning stiffness?', answer: 'It shows where your body loses support and where it carries too much pressure, which are the two mattress causes of stiffness; the Sleep Coach matches the mattress to that map.' },
        { question: 'Does an adjustable base help with back pain?', answer: 'Raising the head and feet relieves pressure and supports a healthier sleep posture; try one on the showroom floor with your mattress choice.' },
        { question: 'Is the fitting free?', answer: 'Yes, and there is no obligation to buy.' },
      ],
      cta: { title: 'Map your pressure points, free', text: 'Five minutes on the Dream Mapping bed in Castle Rock shows what your back needs from a mattress.', button: 'Book a free fitting' },
    },
  },
};
