import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { SiteBody, SiteHead } from '@/components/SiteDocument';
import { NotFoundContent, NOT_FOUND_TITLE } from '@/components/NotFoundContent';
import { SITE_URL } from '@/lib/location';
import '../overrides/global.css';

/* The 404 for every URL that matches no route (next.config.ts experimental.globalNotFound). The site has two root
   layouts — English (app/(en)/layout.tsx) and Spanish (app/es/layout.tsx) — so there is no single layout a top-level
   not-found page could sit in; this file is its own complete document: the same chrome as every page
   (components/SiteDocument.tsx: top bar, header, ticker, footer, tracking) around the branded 404
   (components/NotFoundContent.tsx). Prerendered once (/_not-found) and served with a 404 status. An unknown URL carries
   no language, so the page is English and offers the Spanish home page in one line. */
const poppins = Poppins({ weight: ['400', '500', '600', '700', '800'], subsets: ['latin'], display: 'swap', variable: '--font-poppins', preload: true });

export const metadata: Metadata = { metadataBase: new URL(SITE_URL), title: NOT_FOUND_TITLE.en, robots: { index: false, follow: true } };

export default function GlobalNotFound() {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <SiteHead />
      </head>
      <body>
        <SiteBody locale="en">
          <NotFoundContent locale="en" otherLanguage />
        </SiteBody>
      </body>
    </html>
  );
}
