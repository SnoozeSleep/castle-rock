import type { ContentPage, Faq } from './types';
import { LOCATION } from '@/lib/location';

/* The dedicated FAQ page: every question the site already answers (the shared store FAQ and the financing FAQ),
   grouped by topic, each answer leading with a direct sentence; the facts are the site's own. The FAQPage JSON-LD
   is generated from these items by components/ContentPage.tsx. */
const L = LOCATION;
type Group = { h2: string; faqs: Faq[] };
const EN: Group[] = [
  { h2: 'Dream Mapping', faqs: [
    { question: 'What is Dream Mapping?', answer: 'Dream Mapping is a free in-store fitting that reads your pressure points on a sensor bed and recommends the mattresses that fit your body.' },
    { question: 'How long does it take to complete the Dream Mapping process?', answer: 'About five minutes. Afterwards a Sleep Coach takes you only to the mattresses that match your body.' },
    { question: 'Can couples use Dream Mapping?', answer: 'Yes. Each of you is mapped individually, and the recommendation accounts for both profiles.' },
    { question: 'Is there any pressure to buy?', answer: 'No. The Sleep Coaches are not on commission, and you can leave with your results and come back another day.' },
    { question: 'Do I need an appointment?', answer: 'No. Walk-ins are welcome during store hours, but booking online guarantees a Sleep Coach is ready when you arrive.' },
    { question: 'What is the difference between Dream Mapping and the Sleep Fit Quiz?', answer: 'The quiz is a 60-second online questionnaire; Dream Mapping is the in-store measurement on the sensor bed. The quiz is a first step, the map is the fitting.' },
  ] },
  { h2: 'The store', faqs: [
    { question: 'Where is Snooze Mattress + Wellness?', answer: `At ${L.street}, ${L.city}, ${L.region} ${L.postalCode}, open ${L.hours.en[0]} and ${L.hours.en[1]}; call ${L.phone}.` },
    { question: 'Why choose Snooze Mattress + Wellness in Castle Rock, CO?', answer: 'Because the fitting is measured, not guessed: a free Dream Mapping scan, Sleep Coaches who are not on commission, competitive sales, the 365-Night Sleep Guarantee on major brands, and a family business that will be honored to serve you.' },
    { question: 'What kind of mattresses do you carry?', answer: 'The Castle Rock showroom carries Tempur-Pedic, Sealy, Stearns & Foster, Serta, Beautyrest, Helix, Brooklyn Bedding, FLOWT by King Koil, Snooze Handcrafted by King Koil, Copper by Spring Air, Snooze-O-Pedic (available only at Snooze), BedTech, BedGear, Sleeptone and DreamFit.' },
    { question: 'Do you sell adjustable bases, pillows, protectors and sheets?', answer: 'Yes. Adjustable bases, pillows, mattress protectors, premium sheets, massage chairs and the Zcliner sleep recliner are all in the Castle Rock showroom.' },
    { question: 'Do you offer mattress delivery?', answer: 'Yes. We deliver and set up your new mattress, free on orders over $999, and haul away your old mattress if you no longer need it.' },
  ] },
  { h2: 'Financing', faqs: [
    { question: 'Do you offer financing?', answer: 'Yes. Financing is available through Synchrony and Wells Fargo, and Snap Finance offers a lease-to-own option.' },
    { question: 'What financing options do you offer?', answer: 'Synchrony Bank, Wells Fargo Bank, N.A., and Snap Finance (a lease-to-own option), which together cover a wide range of credit profiles.' },
    { question: 'Is financing available with 0% interest?', answer: 'Promotional financing is offered periodically, including no interest if paid in full within a promotional period and equal-monthly-payment plans. For deferred-interest promotions, if the balance is not paid in full within the period, interest may be charged from the original purchase date; minimum monthly payments are required and approval is subject to credit. Ask in store for current details.' },
    { question: 'What if I don’t qualify for traditional financing?', answer: 'Snap Finance offers a lease-to-own option. It is not a loan but a lease-to-own agreement for customers who may not qualify for traditional credit, with a fast application, flexible payments and possible early-payoff options; the total cost may exceed the purchase price over the full term, and approval is determined by Snap Finance.' },
    { question: 'Does applying affect my credit?', answer: 'It may. Applications through Synchrony or Wells Fargo can involve a credit inquiry as determined by the lender; Snap Finance uses its own approval criteria. Approval decisions are made solely by the financing provider.' },
    { question: 'How long does approval take?', answer: 'Usually minutes. Applications are processed within minutes in most cases and many customers receive a decision the same day; timing depends on the provider and the application.' },
    { question: 'Is there a minimum purchase required?', answer: 'Sometimes. Some promotional financing offers require a minimum purchase; details vary by promotion and lender, so ask in store for current requirements.' },
    { question: 'Can I pay off my financing early?', answer: 'Yes. Traditional financing can be paid off early without penalty (check the lender’s terms), and Snap Finance may offer early purchase options that reduce the total cost; see the provider for full terms.' },
    { question: 'Who do I make payments to?', answer: 'Directly to the financing provider, Synchrony, Wells Fargo or Snap Finance; Snooze Mattress + Wellness does not collect or service financing payments.' },
    { question: 'Why finance instead of paying cash?', answer: 'Financing lets you upgrade your sleep now, protect your savings, spread payments over time and take advantage of promotional offers; many customers prefer structured payments to delaying a better night’s sleep.' },
    { question: 'Is financing safe?', answer: 'Yes. The providers are established companies that follow industry standards for consumer financing, and all approvals, terms and servicing are handled directly by the lender or lease provider; Snooze Mattress + Wellness does not make credit decisions.' },
    { question: 'How do I apply?', answer: 'In store with a sleep specialist, during your visit, or online where the provider offers it; the team walks you through the best option for your needs.' },
  ] },
];
;
const flat = (g: Group[]) => g.flatMap((x) => x.faqs);
export const PAGE: ContentPage = {
  slug: '/faq',
  kind: 'faq',
  copy: {
    en: {
      title: 'Mattress FAQ for Castle Rock Shoppers | Snooze Mattress',
      description: 'Answers to what Castle Rock shoppers ask Snooze: Dream Mapping, the store and its brands, delivery, and financing with Synchrony, Wells Fargo and Snap.',
      crumb: 'FAQ',
      eyebrow: 'Questions and answers',
      h1: 'Frequently asked questions',
      intro: ['Everything shoppers ask before and during a visit to Snooze Mattress + Wellness in Castle Rock, grouped by topic. Each answer starts with the short version; the pages linked from the footer have the detail.'],
      sections: [],
      faqTitle: 'All questions',
      faqs: flat(EN),
      faqGroups: EN,
      cta: { title: 'Still have a question?', text: `Call ${L.phone} or come by ${L.street}, ${L.city}; a Sleep Coach will answer it in person, and a free Dream Mapping fitting takes about five minutes.`, button: 'Book a free fitting' },
    },
  },
};
export const FAQ_GROUPS = { en: EN };
