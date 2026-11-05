/*
 * The Spanish versions of the five Castle Rock articles (/es/blog/<slug>), November 2026.
 *
 * Each one is a translation of its English article in lib/blog-posts.ts — the client's copy, section for section: the
 * same headings, paragraphs, check lists, numbered Sleep Fit steps, the size table (a real <table>), the FAQ and the
 * closing call to action and tagline, written in natural Spanish rather than word for word. Nothing is added: no claim,
 * price, offer, staff name or source the English article does not carry, and the numbers are the article's own (7 to 10
 * years, up to 30%, 7 or more hours, the mattress dimensions). The product and service names stay as the store uses
 * them: Sleep Fit, Dream Mapping, Sleep Coach, Sleep Score; mattress sizes keep their US names (twin, full, queen, king,
 * California king). "Snooze Mattress" inside the text is the articles' own wording.
 *
 * The internal links are the English article's, on the same words, pointing at the Spanish pages (/es/…; inline links
 * are written out in full here — components/blog/Rich.tsx does not localise them).
 *
 * What an article shares with its English twin is taken from the twin, not repeated: the hero image (same file, with a
 * Spanish alt), the publication dates, and the pairing itself — `en` names the English slug, and the Spanish slug comes
 * from lib/blog-nav.ts BLOG_SLUG_ES, so the hreflang pair, the sitemap alternates and the EN | ES switcher all read one
 * table.
 */
import type { BlogPost } from './blog-posts';
import { BLOG_SLUG_ES } from './blog-nav';

type SpanishPost = Omit<BlogPost, 'slug' | 'altSlug' | 'featured' | 'datePublished' | 'dateModified' | 'dateDisplay'> & {
  /** the English article this one translates (lib/blog-posts.ts slug) */
  en: string;
  /** the hero image's alt text in Spanish (the image itself is the English article's) */
  featuredAlt: string;
};

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
/** "2026-11-05" -> "5 de noviembre de 2026" */
const fecha = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return `${d} de ${MONTHS[m - 1]} de ${y}`; };

const ES: SpanishPost[] = [
  /* 1 — Mudanza a Castle Rock */
  {
    en: 'moving-to-castle-rock-mattress-guide',
    title: '¿Te mudas a Castle Rock? No te olvides de tu descanso',
    metaTitle: '¿Te Mudas a Castle Rock? Guía de Colchones | Snooze Mattress',
    metaDescription: 'Mudarte a una casa nueva significa cajas, horarios y una lista de pendientes larguísima. Tu cama quizá no encabece la lista, pero merece un lugar.',
    keywords: ['mudanza a Castle Rock', 'colchón nuevo', 'Sleep Fit', 'Dream Mapping', 'Snooze Mattress + Wellness Castle Rock'],
    featuredAlt: 'Fachada de Snooze Mattress + Wellness en Castle Rock, CO',
    excerpt: 'Mudarte a una casa nueva significa cajas, horarios y una lista de pendientes larguísima.',
    navBlurb: '¿Conviene llevarte tu colchón viejo?',
    sections: [
      {
        blocks: [
          { p: 'Mudarte a una casa nueva significa cajas, horarios y una lista de pendientes larguísima. Tu cama quizá no encabece la lista, pero merece un lugar.' },
          { p: 'Una casa nueva es un buen momento para preguntarte si tu colchón todavía va con tu vida. Ya sea que llegues a Castle Rock por primera vez o que te cambies al otro lado de la ciudad, esta guía repasa en qué pensar antes de cargar tu cama vieja a una recámara nueva.' },
        ],
      },
      {
        heading: 'Por qué una mudanza es el momento perfecto para replantearte tu colchón',
        blocks: [
          { p: 'Los cambios de vida cambian lo que necesitamos. Una mudanza suele venir con otros cambios: un trabajo nuevo, una pareja nueva, una familia que crece, una recámara más grande o más chica. Puede que tu cuerpo necesite algo distinto de lo que necesitaba la última vez que compraste colchón.' },
          { p: 'Y si tu colchón ya tiene sus años, una mudanza es un reinicio natural. La mayoría de los colchones empieza a perder soporte después de 7 a 10 años, aunque todavía se vean y se sientan bien.' },
        ],
      },
      {
        heading: '¿Conviene llevarte tu colchón viejo?',
        blocks: [
          { p: 'Antes de subirlo al camión, pregúntate:' },
          { list: { style: 'number', items: [
            '**¿Cuántos años tiene?** Si anda entre los 7 y los 10 años, puede estar perdiendo soporte.',
            '**¿Despiertas con dolor o rigidez?** Vale la pena ponerle atención.',
            '**¿Cabrá en el nuevo espacio?** Una recámara nueva puede pedir otro tamaño.',
            '**¿Ha cambiado tu vida?** Una pareja nueva, otros hábitos de sueño o nuevas necesidades de comodidad pueden cambiar lo que te funciona.',
            '**¿Vale la pena el esfuerzo?** Mudar un colchón que ya está viejo no siempre es el mejor uso del espacio ni del esfuerzo.',
          ] } },
          { p: 'Si respondiste que sí a varias, tu primera noche en la casa nueva puede ser un gran momento para empezar de cero.' },
        ],
      },
      {
        heading: 'Prepara tu nuevo santuario del sueño',
        blocks: [
          { p: 'Tu recámara debería ayudarte a descansar. Al armarla, piensa en algo más que la cama:' },
          { list: { style: 'check', items: [
            '**Tu colchón.** Busca uno que vaya con tu cuerpo y con tu forma de dormir.',
            '**Tu [almohada](/es/pillows).** Puede representar hasta el 30% de tu soporte mientras duermes.',
            '**Una [base ajustable](/es/adjustable-mattress-bases).** A algunas personas les gusta poder levantar la cabecera o los pies de la cama.',
            '**[Sábanas y protección](/es/premium-sheets).** Los detalles pequeños suman para una cama más cómoda.',
          ] } },
          { p: 'La meta es un sistema de descanso completo, no una sola pieza.' },
        ],
      },
      {
        heading: 'Haz que tus primeras noches cuenten',
        blocks: [
          { p: 'Mudarse cansa. Despertar en un cuarto desconocido después de una mala noche lo hace todo más difícil, desde desempacar hasta tu primer día de trabajo. Una cama que va contigo puede ayudarte a instalarte.' },
        ],
      },
      {
        heading: 'No adivines a la hora de comprar',
        blocks: [
          { p: 'La manera de antes de comprar colchón es acostarte cinco minutos en unos cuantos modelos y esperar que salga bien. Es mucha presión cuando además traes una mudanza encima. En Snooze Mattress en Castle Rock quitamos las adivinanzas con un [Sleep Fit](/es/booking):' },
          { list: { style: 'number', items: [
            '**Recuéstate en [Dream Mapping](/es/dream-mapping).** Nuestra tecnología usa miles de sensores para mostrar exactamente dónde necesita soporte tu cuerpo.',
            '**Descubre tu Sleep Score.** Es un resultado personalizado según el soporte que recibe tu cuerpo.',
            '**Trabaja con un [Sleep Coach](/es/about-us).** Tu coach te ayuda a encontrar el colchón que va con tu cuerpo y con tu nuevo espacio.',
            '**Duerme mejor.** Te vas sabiendo que elegiste bien.',
          ] } },
          { p: 'Sin presión, sin trucos, solo mejor descanso.' },
        ],
      },
      {
        heading: 'Lista rápida de descanso para el día de la mudanza',
        blocks: [
          { list: { style: 'check', items: [
            'Revisa cuántos años tiene tu colchón antes de decidir si te lo llevas.',
            'Mide tu nueva recámara para saber qué tamaño te sirve.',
            'Decide si quieres una almohada nueva o una base ajustable.',
            'Deja el armado de tu cama entre lo primero de tu lista para desempacar.',
            'Aparta tiempo para un Sleep Fit cuando las cajas ya estén en su lugar.',
          ] } },
        ],
      },
    ],
    faqTitle: 'Preguntas frecuentes',
    faqs: [
      { question: '¿Vale la pena comprar un colchón nuevo cuando me mudo?', answer: 'Puede ser. Si tu colchón ya tiene años o ya no va con lo que necesitas, una casa nueva es un buen momento para empezar de nuevo.' },
      { question: '¿Cuánto tarda un Sleep Fit?', answer: 'Es un proceso rápido y guiado. Un Sleep Coach te acompaña en cada paso.' },
      { question: '¿Necesito cita?', answer: 'Puedes llegar sin cita durante el horario de la tienda. También puedes llamar para planear tu visita.' },
      { question: '¿Puedo llevar a mi pareja?', answer: 'Sí. Si comparten cama, ven con tu pareja para que encuentren algo que les funcione a los dos.' },
    ],
    closing: {
      heading: 'Haz que tu nuevo lugar se sienta como tu hogar',
      lead: 'Ya sea que acabes de llegar a Castle Rock o solo al vecindario, Snooze Mattress está aquí para ayudarte.',
      cta: 'Empieza tu Sleep Fit.',
      tagline: 'Mejores noches. Mejores mañanas.',
    },
  },

  /* 2 — Dormir de lado */
  {
    en: 'side-sleeper-mattress-castle-rock',
    title: '¿Duermes de lado en Castle Rock? Cómo encontrar un colchón que dé soporte a tus hombros y caderas',
    metaTitle: 'Colchón para Dormir de Lado en Castle Rock | Snooze Mattress',
    metaDescription: 'Si duermes de lado, estás en buena compañía. Es una de las posiciones más comunes para dormir, y trae sus propios retos a la hora de elegir colchón.',
    keywords: ['colchón para dormir de lado', 'alivio de presión en hombros y caderas', 'firmeza del colchón', 'Sleep Fit', 'Snooze Mattress + Wellness Castle Rock'],
    featuredAlt: 'Persona con calcetines tejidos rosas sentada en una cama blanca, con una taza de té junto a un plato de galletas',
    excerpt: 'Si duermes de lado, estás en buena compañía.',
    navBlurb: 'Qué debe buscar quien duerme de lado',
    sections: [
      {
        blocks: [
          { p: 'Si duermes de lado, estás en buena compañía. Es una de las posiciones más comunes para dormir, y trae sus propios retos a la hora de elegir [colchón](/es/mattresses).' },
          { p: '¿Despiertas con el hombro adolorido o el brazo dormido? ¿Te volteas cada hora buscando una postura cómoda? Puede que tu colchón no vaya con tu forma de dormir. Esto es lo que conviene saber antes de comprar si duermes de lado.' },
        ],
      },
      {
        heading: 'Por qué dormir de lado es distinto',
        blocks: [
          { p: 'Cuando te acuestas boca arriba, tu peso se reparte en una superficie grande. De lado, se concentra en dos de los puntos más anchos de tu cuerpo: el hombro y la cadera. Esos puntos de presión se hunden en el colchón, mientras que la cintura y el cuello necesitan soporte para mantenerse alineados.' },
          { p: 'Un colchón demasiado firme puede presionar el hombro y la cadera. Uno demasiado suave puede dejar que la cadera se hunda de más y saque la columna de su alineación. La sensación correcta está en un punto medio.' },
        ],
      },
      {
        heading: 'Qué debe buscar quien duerme de lado',
        blocks: [
          { list: { style: 'check', items: [
            '**Alivio de presión en el hombro y la cadera.** El colchón debe dejar que esos puntos se hundan lo suficiente para estar cómodos.',
            '**Soporte en la cintura.** Tu columna debe mantenerse en una línea neutral, sin hundirse ni arquearse.',
            '**Un colchón que responda a tu cuerpo.** A quienes duermen de lado suelen irles bien las superficies que se amoldan, pero cuánto depende de tu complexión.',
            '**La [almohada](/es/pillows) correcta.** Tu almohada puede representar hasta el 30% de tu soporte mientras duermes. Si duermes de lado, tiene que llenar el espacio entre el hombro y la cabeza.',
          ] } },
        ],
      },
      {
        heading: 'Señales de que tu colchón no te funciona para dormir de lado',
        blocks: [
          { list: { style: 'number', items: [
            'Despiertas con dolor en el hombro o la cadera.',
            'Se te duerme el brazo o sientes hormigueo durante la noche.',
            'Cambias de posición todo el tiempo.',
            'Te sientes mejor después de una noche en otro lugar.',
            'Tu colchón tiene más de 7 a 10 años.',
          ] } },
          { p: 'Si los síntomas no se quitan, consulta a tu médico. Pero si es sobre todo cosa de las mañanas, vale la pena revisar tu sistema de descanso.' },
        ],
      },
      {
        heading: 'La firmeza no es talla única',
        blocks: [
          { p: 'Muchas personas que duermen de lado creen que necesitan algo muy suave. Otras piensan que lo firme da mejor soporte. Ninguna de las dos es una regla. Tu estatura, tu peso y tu complexión cambian cómo se siente un colchón. Por eso dos personas que duermen de lado pueden necesitar camas muy distintas.' },
        ],
      },
      {
        heading: 'Un ajuste, no una adivinanza',
        blocks: [
          { p: 'La manera de antes de comprar es acostarte de lado unos minutos en unos cuantos colchones. En Snooze Mattress en Castle Rock usamos, en cambio, un [Sleep Fit](/es/booking):' },
          { list: { style: 'number', items: [
            '**Cuéntale a tu [Sleep Coach](/es/about-us) cómo duermes.** De lado, boca arriba, boca abajo o una mezcla.',
            '**Recuéstate en [Dream Mapping](/es/dream-mapping).** Miles de sensores muestran dónde necesita soporte tu cuerpo.',
            '**Descubre tu Sleep Score.** Es un resultado personalizado para tu cuerpo.',
            '**Encuentra tu colchón ideal.** Tu coach reduce las opciones a los colchones y almohadas que van contigo.',
          ] } },
          { p: 'Sin presión, sin trucos, solo mejor descanso.' },
        ],
      },
    ],
    faqTitle: 'Preguntas frecuentes',
    faqs: [
      { question: '¿Cuál es el mejor colchón para dormir de lado?', answer: 'No hay una sola respuesta. Depende de tu cuerpo, del soporte que necesitas y de tus preferencias de comodidad. Un Sleep Fit te puede ayudar a encontrarlo.' },
      { question: '¿Quien duerme de lado necesita un colchón más suave?', answer: 'No siempre. Muchas personas necesitan alivio de presión en el hombro y la cadera, pero el soporte importa igual.' },
      { question: '¿Y si cambio de posición en la noche?', answer: 'A mucha gente le pasa. Cuéntaselo a tu Sleep Coach para que tome en cuenta todas las formas en que duermes.' },
    ],
    closing: { heading: 'Encuentra tu ajuste', cta: 'Ven por tu ajuste hoy.', tagline: 'No todos los colchones le quedan a todos los cuerpos.' },
  },

  /* 3 — Coloradenses activos */
  {
    en: 'sleep-recovery-active-coloradans',
    title: 'Sueño y recuperación para coloradenses activos: ¿tu colchón te sigue el paso?',
    metaTitle: 'Sueño y Recuperación: Coloradenses Activos | Snooze Mattress',
    metaDescription: 'Colorado está hecho para estar al aire libre. Senderismo, bici, esquí, correr, perseguir a los niños por el jardín.',
    keywords: ['sueño y recuperación', 'coloradenses activos', 'soporte del colchón', 'Sleep Fit', 'Snooze Mattress + Wellness Castle Rock'],
    featuredAlt: 'Hombre dormido de lado sobre una almohada blanca',
    excerpt: 'Colorado está hecho para estar al aire libre.',
    navBlurb: 'Por qué importa el sueño cuando eres activo',
    sections: [
      {
        blocks: [
          { p: 'Colorado está hecho para estar al aire libre. Senderismo, bici, esquí, correr, perseguir a los niños por el jardín. Si llevas una vida activa, le pides mucho a tu cuerpo.' },
          { p: 'Luego te vas a la cama, y aquello sobre lo que duermes importa más de lo que crees. Así es como tu sistema de descanso puede acompañar una vida activa.' },
        ],
      },
      {
        heading: 'Por qué importa el sueño cuando eres activo',
        blocks: [
          { p: 'Mientras duermes, tu cuerpo descansa y se recupera. Los adultos necesitan 7 horas de sueño o más, según las recomendaciones generales, y la calidad del sueño importa tanto como la cantidad.' },
          { p: 'Puedes dormir toda la noche y aun así despertar como si no hubieras dormido. Si tus músculos siguen tensos o te pasas la noche acomodándote, quizá no estés descansando tan bien como podrías.' },
        ],
      },
      {
        heading: 'Dónde entra tu colchón',
        blocks: [
          { p: 'Un colchón no te va a poner en mejor forma. Pero el soporte correcto puede ayudar a que tu cuerpo se relaje en lugar de esforzarse toda la noche por mantener la postura. Eso significa:' },
          { list: { style: 'check', items: [
            '**Alineación de la columna.** Tu columna debe mantenerse en una línea neutral.',
            '**Alivio de presión.** Tus hombros y caderas no deberían estar peleando con la superficie.',
            '**Menos vueltas en la cama.** Cuando el cuerpo está cómodo, se mueve menos.',
          ] } },
          { p: 'Un mejor soporte puede significar mejores mañanas, y las mejores mañanas te ayudan a salir por la puerta.' },
        ],
      },
      {
        heading: 'Señales de que tu sistema de descanso no te sigue el paso',
        blocks: [
          { list: { style: 'number', items: [
            'Despiertas con rigidez, incluso después de un día tranquilo.',
            'Te sientes mejor unas horas después de levantarte.',
            'Tu colchón tiene de 7 a 10 años o más.',
            'Duermes mejor en hoteles o de viaje.',
            'Tu [almohada](/es/pillows) no mantiene cómodo tu cuello.',
          ] } },
          { p: 'Si tienes un dolor que no se va, habla con tu médico o con un fisioterapeuta. Pero si simplemente no estás despertando en tu mejor forma, tu cama es un buen lugar para empezar a buscar.' },
        ],
      },
      {
        heading: 'Todo el sistema de descanso',
        blocks: [
          { p: 'La gente activa suele fijarse en los tenis, el equipo y los planes de entrenamiento. Tu equipo para dormir merece la misma atención:' },
          { list: { style: 'check', items: [
            '**Colchón.** La base de tu descanso.',
            '**Almohada.** Hasta el 30% de tu soporte.',
            '**[Base ajustable](/es/adjustable-mattress-bases).** A algunas personas les gusta levantar la cabeza o los pies para relajarse después de un día largo.',
            '**[Ropa de cama](/es/premium-sheets).** Unas sábanas cómodas y la protección completan tu cama.',
          ] } },
        ],
      },
      {
        heading: 'Con datos, no con adivinanzas',
        blocks: [
          { p: 'En Snooze Mattress en Castle Rock, un [Sleep Fit](/es/booking) empieza por cómo vives y cómo duermes:' },
          { list: { style: 'number', items: [
            '**Platica con un [Sleep Coach](/es/about-us)** sobre tu nivel de actividad y cualquier molestia.',
            '**Recuéstate en [Dream Mapping](/es/dream-mapping).** Miles de sensores muestran dónde necesita soporte tu cuerpo.',
            '**Descubre tu Sleep Score.**',
            '**Encuentra el colchón que va con tu cuerpo.**',
          ] } },
          { p: 'Hicimos del sueño una ciencia.' },
        ],
      },
    ],
    faqTitle: 'Preguntas frecuentes',
    faqs: [
      { question: '¿Un colchón puede ayudar con el dolor muscular?', answer: 'No podemos hacer afirmaciones médicas. Pero el soporte correcto puede ayudar a que tu cuerpo descanse cómodamente, y ahí empieza un buen sistema de descanso.' },
      { question: '¿Cada cuánto debe cambiar de colchón una persona activa?', answer: 'La mayoría de los colchones empieza a perder soporte después de 7 a 10 años. Si despiertas con dolor, revísalo antes.' },
      { question: '¿Necesito un colchón firme si soy deportista?', answer: 'No necesariamente. No hay una sola firmeza que le funcione a todo el mundo.' },
    ],
    closing: { heading: '¿Listo para dormir como juegas?', cta: 'Descubre tu Sleep Score.', tagline: 'Hicimos del sueño una ciencia.' },
  },

  /* 4 — Camas ajustables */
  {
    en: 'adjustable-beds-explained-castle-rock',
    title: 'Camas ajustables explicadas: para quién son y qué saber antes de comprar',
    metaTitle: 'Camas Ajustables: Qué Son y Para Quién Son | Snooze Mattress',
    metaDescription: 'Una base ajustable te permite subir o bajar la cabecera y los pies de tu cama. No es para todos, pero a mucha gente le sorprende cuánto le gusta.',
    keywords: ['camas ajustables', 'base ajustable', 'base dividida', 'Sleep Fit', 'Snooze Mattress + Wellness Castle Rock'],
    featuredAlt: 'Mujer sentada en la cama con la cabeza entre las manos',
    excerpt: 'Una base ajustable te permite subir o bajar la cabecera y los pies de tu cama.',
    navBlurb: 'En qué pensar antes de comprar',
    sections: [
      {
        blocks: [
          { p: 'Una [base ajustable](/es/adjustable-mattress-bases) te permite subir o bajar la cabecera y los pies de tu cama. No es para todos, pero a mucha gente le sorprende cuánto le gusta.' },
          { p: 'Si te preguntas si una cama ajustable tiene sentido para ti, esta guía cubre lo básico.' },
        ],
      },
      {
        heading: '¿Qué es una base ajustable?',
        blocks: [
          { p: 'Una base ajustable es una plataforma que se dobla en la cabecera y en los pies, para que cambies de posición sin amontonar almohadas. Muchas tienen control remoto y algunas ofrecen funciones adicionales. Las funciones varían según el modelo, así que pregunta qué hay disponible.' },
        ],
      },
      {
        heading: 'A quién le puede gustar',
        blocks: [
          { list: { style: 'check', items: [
            '**Quienes leen o ven tele** y les gusta sentarse cómodamente en la cama.',
            '**Quienes prefieren una ligera inclinación** mientras descansan o se relajan.',
            '**Parejas con preferencias distintas.** Algunas bases dejan que cada lado se ajuste por separado.',
            '**Cualquiera que quiera más formas de ponerse cómodo.**',
          ] } },
          { p: 'Algunas personas notan que ajustar su posición las ayuda a sentirse más cómodas. Cada quien es distinto, así que vale la pena probar una en persona.' },
        ],
      },
      {
        heading: 'En qué pensar antes de comprar',
        blocks: [
          { p: '**Compatibilidad del colchón.** No todos los colchones funcionan con todas las bases. Muchos están diseñados para flexionarse, pero lo mejor es comprarlos juntos.' },
          { p: '**Tu recámara.** Revisa cómo queda la base con tu marco, tu cabecera y tus burós. Algunas bases necesitan un poco de espacio para moverse.' },
          { p: '**Tu pareja.** Si comparten cama, decidan juntos si quieren una base dividida para que cada quien ajuste su lado.' },
          { p: '**Tu presupuesto.** Hay bases de distintos precios. Pregunta qué hay disponible y por las opciones de [financiamiento](/es/mattress-financing).' },
          { p: '**Tu posición al dormir.** Prueba acostarte en distintas posiciones para ver cuál se siente natural.' },
        ],
      },
      {
        heading: 'Base ajustable o no: una lista rápida',
        blocks: [
          { list: { style: 'number', items: [
            '¿Me gusta sentarme en la cama?',
            '¿Quiero encontrar una posición más cómoda sin almohadas extra?',
            '¿Mi pareja quiere ajustes distintos?',
            '¿Mi colchón es compatible?',
            '¿Tengo el espacio?',
          ] } },
          { p: 'Si dijiste que sí a varias, quizá valga la pena probar una base.' },
        ],
      },
      {
        heading: 'Prueba antes de decidir',
        blocks: [
          { p: 'Una base ajustable se siente muy distinta en persona de lo que suena en papel. En Snooze Mattress en Castle Rock puedes probar una en un [Sleep Fit](/es/booking). Un [Sleep Coach](/es/about-us) te explica cómo funciona cada opción, y [Dream Mapping](/es/dream-mapping) puede mostrar cómo recibe soporte tu cuerpo en distintas posiciones.' },
          { p: 'La meta no es solo vender una cama. Es un sistema de descanso completo: colchón, base, almohadas, sábanas y protección, todo a tu medida.' },
        ],
      },
    ],
    faqTitle: 'Preguntas frecuentes',
    faqs: [
      { question: '¿Puedo usar cualquier colchón en una base ajustable?', answer: 'No siempre. Pregúntale a tu Sleep Coach qué colchones funcionan con qué bases.' },
      { question: '¿Las bases ajustables son solo para adultos mayores?', answer: 'No. A personas de todas las edades les gustan para leer, relajarse y estar cómodas.' },
      { question: '¿Las pueden usar las parejas?', answer: 'Sí. Las opciones divididas dejan que cada persona elija su propia posición.' },
      { question: '¿Son difíciles de instalar?', answer: 'Pregunta por las opciones de entrega e instalación cuando vengas a comprar.' },
    ],
    closing: { heading: 'Ven a sentir la diferencia', cta: 'Empieza tu Sleep Fit.', tagline: 'Un ajuste a tu medida para dormir mejor.' },
  },

  /* 5 — Tamaños de colchón */
  {
    en: 'mattress-size-guide-castle-rock',
    title: '¿Queen, king o California king? Cómo elegir el tamaño de colchón correcto para tu recámara',
    metaTitle: '¿Queen, King o California King? Tamaños | Snooze Mattress',
    metaDescription: 'Ya decidiste que es hora de un colchón nuevo. Ahora viene una pregunta que a mucha gente se le complica: ¿de qué tamaño?',
    keywords: ['guía de tamaños de colchón', 'queen o king', 'California king', 'medidas de colchón', 'Snooze Mattress + Wellness Castle Rock'],
    featuredAlt: 'Pareja sonriente acostada bajo un edredón blanco',
    excerpt: 'Ya decidiste que es hora de un colchón nuevo.',
    navBlurb: 'Tamaños de colchón de un vistazo',
    sections: [
      {
        blocks: [
          { p: 'Ya decidiste que es hora de un [colchón](/es/mattresses) nuevo. Ahora viene una pregunta que a mucha gente se le complica: ¿de qué tamaño?' },
          { p: 'Más grande no siempre es mejor, y más chico no siempre es más práctico. Así puedes elegir el tamaño que va con tu cuerpo, con tu pareja y con tu recámara.' },
        ],
      },
      {
        heading: 'Tamaños de colchón de un vistazo',
        blocks: [
          { table: {
            head: ['Tamaño', 'Medidas aproximadas'],
            rows: [
              ['[Twin](/es/full-twin-mattresses)', '38" x 75"'],
              ['[Twin XL](/es/full-twin-mattresses)', '38" x 80"'],
              ['[Full](/es/full-twin-mattresses)', '54" x 75"'],
              ['[Queen](/es/queen-mattresses)', '60" x 80"'],
              ['[King](/es/king-mattresses)', '76" x 80"'],
              ['[California King](/es/king-mattresses)', '72" x 84"'],
            ],
          } },
          { h3: 'Twin y Twin XL' },
          { p: 'Ideales para niños, cuartos de visitas y espacios pequeños. El Twin XL agrega 5 pulgadas de largo, lo que ayuda a las personas altas.' },
          { h3: 'Full' },
          { p: 'Funciona para una persona que quiere más espacio, pero queda justo para dos adultos.' },
          { h3: 'Queen' },
          { p: 'Es el tamaño más popular, y con razón. Cabe en la mayoría de las recámaras y sirve tanto para quien duerme solo como para parejas. Eso sí: si comparten cama, a cada persona le tocan unas 30 pulgadas, menos de lo que mide de ancho un colchón de cuna. Quienes se mueven poco pueden estar bien, pero algunas parejas se sienten apretadas.' },
          { h3: 'King' },
          { p: 'Es más ancho que un queen, así que cada persona tiene más espacio. Es buena opción para parejas que se mueven mucho, que duermen con mascotas o que simplemente quieren espacio para estirarse. También necesita una recámara más grande.' },
          { h3: 'California King' },
          { p: 'Es un poco más angosto y más largo que un king estándar. Les queda bien a las personas altas que necesitan el largo, y funciona en cuartos donde un king estándar se siente demasiado ancho.' },
        ],
      },
      {
        heading: 'Cómo elegir',
        blocks: [
          { list: { style: 'number', items: [
            '**¿Cuántas personas duermen en la cama?** A las parejas les suele gustar el king por el espacio extra.',
            '**¿Cuánto mides?** Si te cuelgan los pies, piensa en el largo.',
            '**¿Se suben los niños o las mascotas?** Más espacio puede ayudar.',
            '**¿De qué tamaño es la recámara?** Deja espacio para caminar alrededor de la cama.',
            '**¿Quieres una [base ajustable](/es/adjustable-mattress-bases)?** El tamaño influye en qué opciones hay disponibles.',
          ] } },
        ],
      },
      {
        heading: 'Primero mide',
        blocks: [
          { p: 'Antes de comprar, mide tu recámara y piensa en las puertas, los pasillos y las escaleras. Una cama que cabe en el cuarto pero no por la entrada puede darte dolores de cabeza el día de la entrega. Pregunta por la entrega y la instalación cuando vengas a comprar.' },
        ],
      },
      {
        heading: 'El tamaño es solo una parte del ajuste',
        blocks: [
          { p: 'El tamaño correcto no sirve de mucho si el colchón no te da soporte. En Snooze Mattress en Castle Rock empezamos con un [Sleep Fit](/es/booking):' },
          { list: { style: 'number', items: [
            '**Platica con un [Sleep Coach](/es/about-us)** sobre quién duerme en la cama y cómo.',
            '**Recuéstense en [Dream Mapping](/es/dream-mapping).** Miles de sensores muestran dónde necesita soporte cada persona.',
            '**Descubre tu Sleep Score.**',
            '**Encuentra el tamaño y el colchón que van contigo.**',
          ] } },
          { p: 'Ven con tu pareja para que encuentren algo que les funcione a los dos.' },
        ],
      },
    ],
    faqTitle: 'Preguntas frecuentes',
    faqs: [
      { question: '¿Un king es demasiado grande para una recámara?', answer: 'Depende del espacio. Mide tu cuarto y pregúntale a tu Sleep Coach.' },
      { question: '¿Un queen alcanza para dos?', answer: 'Para muchas parejas, sí. Para otras, sobre todo si son personas altas o de sueño ligero, un king puede ser más cómodo.' },
      { question: '¿Cuál es la diferencia entre un king y un California king?', answer: 'Un king estándar es más ancho. Un California king es más angosto y más largo.' },
      { question: '¿El tamaño afecta el precio?', answer: 'Por lo general, los tamaños más grandes cuestan más. Pregunta por las opciones actuales y por el [financiamiento](/es/mattress-financing) disponible con crédito aprobado.' },
    ],
    closing: { heading: 'Encuentra el tamaño que va contigo', cta: 'Encuentra tu ajuste.', tagline: 'Duerme mejor, desde esta noche.' },
  },
];

/** The Spanish articles, completed from their English twins (hero image, dates) and paired through BLOG_SLUG_ES. */
export function spanishPosts(english: BlogPost[]): BlogPost[] {
  return ES.map(({ en, featuredAlt, ...post }) => {
    const twin = english.find((p) => p.slug === en);
    const slug = BLOG_SLUG_ES[en];
    if (!twin || !slug) throw new Error(`lib/blog-posts-es.ts: "${en}" has no ${twin ? 'Spanish slug in lib/blog-nav.ts BLOG_SLUG_ES' : 'English article in lib/blog-posts.ts'}`);
    return {
      ...post,
      slug,
      altSlug: en,
      featured: { ...twin.featured, alt: featuredAlt },
      datePublished: twin.datePublished,
      ...(twin.dateModified ? { dateModified: twin.dateModified } : {}),
      dateDisplay: fecha(twin.datePublished),
    };
  });
}
