import { SITE } from '@/components/site-config';
import { LOCATION } from '@/lib/location';
import { Icon } from '@/components/icons';
import { localizeHref, type Locale } from '@/lib/i18n';

/* The branded 404 (November 2026 brief, E): the site's own navy ground, the logo, a short line and the three ways on —
   the home page, the mattresses page and a free Dream Mapping fitting — plus the store's phone, in the page's language.
   Rendered by app/global-not-found.tsx (every unknown URL: a complete static page with a 404 status, inside the site
   chrome) and by the two trees' own not-found boundaries (app/(en)/not-found.tsx, app/es/not-found.tsx). */
const S = {
  main: { fontFamily: 'var(--font-poppins-stack)', background: 'radial-gradient(120% 90% at 50% 0%, #0b2aa8 0%, #001489 55%, #000b4a 100%)', color: '#fff', padding: 'clamp(56px, 9vw, 112px) 20px', textAlign: 'center' as const },
  inner: { maxWidth: 680, margin: '0 auto' },
  /* the navy logo sits on a white pill so it reads on the navy ground */
  logo: { display: 'block', width: 170, height: 'auto', margin: '0 auto 28px', padding: '12px 18px', borderRadius: 14, background: '#fff', boxSizing: 'content-box' as const },
  eyebrow: { margin: '0 0 10px', fontSize: 13, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#F58433' },
  h1: { margin: '0 0 16px', fontSize: 'clamp(30px, 5vw, 48px)', lineHeight: 1.12, fontWeight: 800 },
  p: { margin: '0 auto 30px', maxWidth: 540, fontSize: 17, lineHeight: 1.6, color: 'rgba(255,255,255,0.86)' },
  row: { display: 'flex', flexWrap: 'wrap' as const, justifyContent: 'center', gap: 12 },
  btn: { display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 48, padding: '0 22px', borderRadius: 10, background: 'linear-gradient(135deg, #d96a1a 0%, #f58433 100%)', color: '#fff', fontWeight: 700, fontSize: 16, textDecoration: 'none' },
  ghost: { display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 48, padding: '0 22px', borderRadius: 10, border: '2px solid rgba(255,255,255,0.55)', color: '#fff', fontWeight: 700, fontSize: 16, textDecoration: 'none' },
  call: { marginTop: 26, fontSize: 15, color: 'rgba(255,255,255,0.86)' },
  callLink: { color: '#fff', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3 },
};

export const NOT_FOUND_TITLE: Record<Locale, string> = { en: 'Page Not Found | Snooze Mattress', es: 'Página no encontrada | Snooze Mattress' };

const COPY = {
  en: {
    h1: 'That page is still asleep.',
    text: (city: string) => `The address you followed does not exist on the Snooze Mattress + Wellness ${city} site. The pages below are awake, and a free Dream Mapping fitting is one tap away.`,
    home: 'Back to the home page', shop: 'Shop mattresses', book: 'Book a free Dream Mapping fitting',
    call: 'Rather talk to a Sleep Coach? Call',
  },
  es: {
    h1: 'Esa página sigue dormida.',
    text: (city: string) => `La dirección que seguiste no existe en el sitio de Snooze Mattress + Wellness en ${city}. Las páginas de abajo sí están despiertas, y tu ajuste gratis de Dream Mapping está a un toque.`,
    home: 'Volver al inicio', shop: 'Ver colchones', book: 'Reserva tu ajuste gratis de Dream Mapping',
    call: '¿Prefieres hablar con un Sleep Coach? Llama al',
  },
};

/** `otherLanguage`: on the global 404 (always English: an unknown URL carries no language) a line offers the Spanish home page */
export function NotFoundContent({ locale, otherLanguage = false }: { locale: Locale; otherLanguage?: boolean }) {
  const c = COPY[locale];
  const hours = LOCATION.hours[locale] || LOCATION.hours.en;
  return (
    <main style={S.main}>
      <div style={S.inner}>
        <img src={SITE.logo} alt={SITE.logoAlt} width={190} height={53} style={S.logo} />
        <p style={S.eyebrow}>Error 404</p>
        <h1 style={S.h1}>{c.h1}</h1>
        <p style={S.p}>{c.text(LOCATION.city)}</p>
        <div style={S.row}>
          <a href={localizeHref('/', locale)} style={S.btn}><Icon name="map-pin" /> {c.home}</a>
          <a href={localizeHref('/mattresses', locale)} style={S.ghost}>{c.shop}</a>
          <a href={localizeHref('/booking', locale)} style={S.ghost}>{c.book}</a>
        </div>
        <p style={S.call}>{c.call} <a href={LOCATION.phoneHref} style={S.callLink}>{LOCATION.phone}</a> · {hours[0]}, {hours[1]}</p>
        {otherLanguage ? <p style={S.call} lang="es">¿Buscas el sitio en español? <a href="/es" hrefLang="es" style={S.callLink}>Ir al inicio en español</a></p> : null}
      </div>
    </main>
  );
}
