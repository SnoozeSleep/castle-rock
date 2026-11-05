import type { Metadata } from 'next';
import { SITE } from '@/components/site-config';
import { LOCATION } from '@/lib/location';
import { Icon } from '@/components/icons';

/* The branded 404 (November 2026 brief, E): the site's own navy ground, the logo, a short line and the three ways on —
   the home page, the mattresses page and a free Dream Mapping fitting — plus the store's phone. It sits next to the root
   layout (app/layout.tsx, moved out of the (en) route group so Next can prerender /_not-found inside the site chrome:
   top bar, header, ticker and footer), so every unknown URL is served as a complete static page with a 404 status. */
export const metadata: Metadata = { title: 'Page Not Found | Snooze Mattress', robots: { index: false, follow: true } };

const S = {
  main: { fontFamily: 'var(--font-poppins-stack)', background: 'radial-gradient(120% 90% at 50% 0%, #0b2aa8 0%, #001489 55%, #000b4a 100%)', color: '#fff', padding: 'clamp(56px, 9vw, 112px) 20px', textAlign: 'center' as const },
  inner: { maxWidth: 680, margin: '0 auto' },
  /* the navy logo sits on a white pill so it reads on the navy ground */
  logo: { display: 'block', width: 170, height: 'auto', margin: '0 auto 28px', padding: '12px 18px', borderRadius: 14, background: '#fff', boxSizing: 'content-box' as const },
  eyebrow: { margin: '0 0 10px', fontSize: 13, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#F58433' },
  h1: { margin: '0 0 16px', fontSize: 'clamp(30px, 5vw, 48px)', lineHeight: 1.12, fontWeight: 800 },
  p: { margin: '0 auto 30px', maxWidth: 540, fontSize: 17, lineHeight: 1.6, color: 'rgba(255,255,255,0.86)' },
  row: { display: 'flex', flexWrap: 'wrap' as const, justifyContent: 'center', gap: 12 },
  btn: { display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 48, padding: '0 22px', borderRadius: 10, background: 'linear-gradient(135deg, #d96a1a 0%, #f58433 100%)', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none' },
  ghost: { display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 48, padding: '0 22px', borderRadius: 10, border: '2px solid rgba(255,255,255,0.55)', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none' },
  call: { marginTop: 26, fontSize: 15, color: 'rgba(255,255,255,0.86)' },
  callLink: { color: '#fff', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3 },
};

export default function NotFound() {
  return (
    <main style={S.main}>
      <div style={S.inner}>
        <img src={SITE.logo} alt={SITE.logoAlt} width={190} height={53} style={S.logo} />
        <p style={S.eyebrow}>Error 404</p>
        <h1 style={S.h1}>That page is still asleep.</h1>
        <p style={S.p}>The address you followed does not exist on the Snooze Mattress + Wellness {LOCATION.city} site. The pages below are awake, and a free Dream Mapping fitting is one tap away.</p>
        <div style={S.row}>
          <a href="/" style={S.btn}><Icon name="map-pin" /> Back to the home page</a>
          <a href="/mattresses" style={S.ghost}>Shop mattresses</a>
          <a href="/booking" style={S.ghost}>Book a free Dream Mapping fitting</a>
        </div>
        <p style={S.call}>Rather talk to a Sleep Coach? Call <a href={LOCATION.phoneHref} style={S.callLink}>{LOCATION.phone}</a> · {LOCATION.hours.en[0]}, {LOCATION.hours.en[1]}</p>
      </div>
    </main>
  );
}
