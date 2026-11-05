import { LOCATION, areaList } from '@/lib/location';
import { localizeHref, type Locale } from '@/lib/i18n';
import { ArrowRightIcon, Icon } from './icons';

/* "Shopping from Parker, Highlands Ranch or Lone Tree?" — a short band at the end of the home page linking the service-area
   pages (SEO audit build pass, C1; the Castle Rock clone, November 2026). Server-rendered, so it reads with or without
   JavaScript. The three links are cards (map-pin badge, city, a line naming the area, "View page"), each card one link.
   No drive times (the brief: none are asserted). Styles: overrides/global.css (.snz-areas, .snz-card). */
const cities = LOCATION.serviceAreas.map((a) => a.city);
const COPY = {
  en: {
    eyebrow: 'Service area',
    title: `Shopping from ${cities.slice(0, -1).join(', ')} or ${cities[cities.length - 1]}?`,
    text: `Snooze Mattress + Wellness is at ${LOCATION.street} in ${LOCATION.city} (${LOCATION.county}, the ${LOCATION.metro}) and serves ${areaList()} with a free five-minute Dream Mapping fitting. See what a visit from your city gets you:`,
    line: `${LOCATION.county} · ${LOCATION.metro}`,
    view: 'View page',
  },
  es: {
    eyebrow: 'Zona de servicio',
    title: `¿Vienes de ${cities.slice(0, -1).join(', ')} o ${cities[cities.length - 1]}?`,
    text: `Snooze Mattress + Wellness está en ${LOCATION.street}, en Castle Rock (condado de Douglas, al sur del área metropolitana de Denver), y atiende a ${areaList('y')} con una sesión gratis de Dream Mapping de cinco minutos. Mira qué te da una visita desde tu ciudad:`,
    line: 'Condado de Douglas · sur del área metropolitana de Denver',
    view: 'Ver página',
  },
};

export function AreaLinks({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  return (
    <section className="snz-areas" aria-labelledby="snz-areas-title">
      <div className="snz-areas__inner">
        <p className="snz-areas__eyebrow">{c.eyebrow}</p>
        <h2 id="snz-areas-title" className="snz-areas__title">{c.title}</h2>
        <p className="snz-areas__text">{c.text}</p>
        <ul className="snz-cards snz-areas__cards">
          {LOCATION.serviceAreas.map(({ city, slug }) => (
            <li key={slug}>
              <a className="snz-card snz-card--link" href={localizeHref(slug, locale)}>
                <span className="snz-badge"><Icon name="map-pin" /></span>
                <span className="snz-card__title">{city}</span>
                <span className="snz-card__text">{c.line}</span>
                <span className="snz-card__more">{c.view} <ArrowRightIcon /></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
