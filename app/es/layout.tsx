import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { SiteBody, SiteHead } from '@/components/SiteDocument';
import { SITE_URL } from '@/lib/location';
import { INTEGRATIONS } from '@/lib/integrations';
import '../../overrides/global.css';

/* The Spanish root layout: <html lang="es">. The English site has its own root layout (app/(en)/layout.tsx, lang="en");
   everything the two documents share — tracking, the chrome, the scripts — is components/SiteDocument.tsx.

   The site typeface. next/font downloads the Google Fonts files at build time and serves them from this origin (no
   request to fonts.googleapis.com / fonts.gstatic.com at runtime), emits the @font-face rules with font-display: swap,
   preloads the files and generates a metric-matched fallback face so the swap causes no layout shift. Weights: 400 body,
   500 medium copy, 600 buttons / navigation, 700 bold text, 800 headings. The latin subset covers every English and
   Spanish character (accents and ñ are in U+00C0-00FF), so only five files are preloaded. Exposed as --font-poppins;
   overrides/global.css builds --font-poppins-stack from it. Declared in the root layout itself: Next only registers a
   font for preloading when the call sits in a layout or page module. */
const poppins = Poppins({ weight: ['400', '500', '600', '700', '800'], subsets: ['latin'], display: 'swap', variable: '--font-poppins', preload: true });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  /* Google Search Console: <meta name="google-site-verification"> on every page once supplied (lib/integrations.ts) */
  verification: INTEGRATIONS.googleSiteVerification ? { google: INTEGRATIONS.googleSiteVerification } : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={poppins.variable}>
      <head>
        <SiteHead />
      </head>
      <body>
        <SiteBody locale="es">{children}</SiteBody>
      </body>
    </html>
  );
}
