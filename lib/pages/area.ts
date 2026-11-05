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
        title: `Mattress Store Serving ${city}, CO | Snooze Mattress`,
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
      es: {
        title: `Tienda de Colchones para ${city}, CO | Snooze Mattress`,
        description: `¿Buscas colchón desde ${city}? Snooze Mattress + Wellness en Castle Rock te ajusta con Dream Mapping gratis y entrega gratis en compras mayores de $999.`,
        crumb: `Atendemos ${city}`,
        eyebrow: 'Zona de servicio',
        h1: `Tienda de colchones que atiende a ${city}, CO`,
        intro: [
          `Snooze Mattress + Wellness está en el condado de Douglas, al sur del área metropolitana de Denver, en ${L.street}, ${L.city}, ${L.region} ${L.postalCode}, y atiende a ${city} y al resto de ${areaList('y')}. Esto es lo que te da una visita desde ${city}: una sesión gratis de Dream Mapping de cinco minutos, las marcas que conoces en un solo piso, Sleep Coaches que no trabajan por comisión, opciones de financiamiento, y entrega e instalación gratis en compras mayores de $999.`,
        ],
        sections: [
          { h2: `Por qué los clientes de ${city} vienen a Snooze en ${L.city}`, paragraphs: [
            `Comprar un colchón por el nombre de la marca o acostándose treinta segundos en unas cuantas camas es adivinar. La cama de Dream Mapping le quita las adivinanzas: sus sensores registran tus puntos de presión en unos cinco minutos, y un Sleep Coach te lleva a los colchones que van con ese mapa. El ajuste es gratis y no hay obligación de comprar, así que la visita desde ${city} vale la pena aunque solo vengas a saber qué necesita tu cuerpo.`,
            `La sala de exhibición tiene ${BRANDS_ES}, desde comodidad de lujo hasta opciones económicas, además de bases ajustables, almohadas, protectores y sábanas ajustados al mismo perfil.`,
          ] },
          { h2: `Entrega e instalación para ${city}`, paragraphs: [
            `La entrega e instalación son gratis en compras mayores de $999, y nos llevamos el colchón viejo si ya no lo necesitas. Dile al Sleep Coach tu dirección en ${city} al hacer tu compra y confirmará contigo la ventana de entrega.`,
          ] },
          { h2: 'Financiamiento', paragraphs: [
            'Hay financiamiento con Synchrony y Wells Fargo, y Snap Finance ofrece una opción de renta con opción a compra para quienes quizá no califiquen para crédito tradicional. Las solicitudes se hacen en tienda; la decisión de aprobación la toma la institución financiera. La página de financiamiento tiene los detalles y las preguntas más frecuentes.',
          ] },
          { h2: 'Antes de visitarnos', listStyle: 'facts', bullets: [
            `Horario: ${L.hours.es[0]}, ${L.hours.es[1]} (hora del Este).`,
            `Llama al ${L.phone} para preguntar por una marca o un tamaño, o reserva tu Dream Mapping en línea para que un Sleep Coach te esté esperando.`,
            'Si quieres, haz primero el [Sleep Fit Quiz](/es/sleep-quiz) de 60 segundos en casa; el mapa en tienda confirma el resultado.',
            'Las parejas se mapean por separado, así que vengan juntos si comparten la cama.',
          ] },
        ],
        faqTitle: `Preguntas de clientes de ${city}`,
        faqs: [
          { question: `¿Dónde está la tienda Snooze para ${city}?`, answer: `En ${L.street}, ${L.city}, ${L.region} ${L.postalCode}, en el condado de Douglas, abierta ${L.hours.es[0]} y ${L.hours.es[1]}.` },
          { question: `¿Entregan en ${city}?`, answer: `Sí. La entrega e instalación son gratis en compras mayores de $999; el Sleep Coach confirma la ventana de entrega para tu dirección en ${city} al hacer tu compra.` },
          { question: '¿Qué otras ciudades atienden?', answer: `${areaList('y')}, y el resto del área de Castle Rock.` },
          { question: '¿Necesito cita para Dream Mapping?', answer: 'No. Puedes llegar sin cita en horario de tienda, pero reservar en línea garantiza que un Sleep Coach esté listo cuando llegues.' },
          { question: '¿Qué marcas puedo probar en la sala de exhibición?', answer: `${BRANDS_ES}, además de bases ajustables, almohadas, protectores y sábanas.` },
          { question: '¿Hay financiamiento?', answer: 'Sí: Synchrony, Wells Fargo y una opción de renta con opción a compra con Snap Finance, que se solicita en tienda.' },
        ],
        cta: { title: `Reserva tu ajuste gratis desde ${city}`, text: `Cinco minutos en la cama de Dream Mapping en ${L.city}, y te vas sabiendo qué colchones van con tu forma de dormir.`, button: 'Reservar ajuste gratis' },
      },
    },
  };
}
