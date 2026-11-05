import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Every route is prerendered at build time (no dynamic data), so Vercel serves the pages from its CDN like static files.
  // The site is not a static export (`output: 'export'`): the canonical-host redirect lives in middleware.ts (Next.js
  // rejects middleware under a static export), gated on NEXT_PUBLIC_SITE_URL and matching page routes only, so the site
  // works unchanged on any host — including *.vercel.app previews, where every asset must keep loading. Redirects for
  // legacy slugs, the GHL stub rewrites and cache headers stay in vercel.json; the ghl-stub rewrites are mirrored below
  // so `next start` behaves like the deployment.
  // Assets are always relative (no assetPrefix).
  // inlineCss: the page's own CSS is written into the HTML instead of render-blocking stylesheet requests.
  // globalNotFound: app/global-not-found.tsx is the 404 for unknown URLs — the site has two root layouts (English and
  // Spanish, each with its own <html lang>), so a top-level not-found page has no layout to sit in.
  experimental: { inlineCss: true, globalNotFound: true },
  // next/image's optimizer (/_next/image) serves the blog's hero and card images, the footer logo, and — from the
  // generated pages, by URL — the location photos and the desktop heroes (lib/location.ts STORE_PHOTO_URL /
  // TEAM_PHOTO_URL, overrides/overrides.json heroBackgrounds): resized and as WebP, never the 1–2 MB originals. Remote
  // sources are limited to two folders of the client's media library: the Castle Rock location's own
  // (gsqZfpbY5MmVessxREvK: storefront, team, heroes — November 5, 2026) and the one that holds the blog hero images
  // (kfb27KLffGslRPEihqeR); local /assets files need no pattern.
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'assets.cdn.filesafe.space', pathname: '/gsqZfpbY5MmVessxREvK/media/**' },
      { protocol: 'https', hostname: 'assets.cdn.filesafe.space', pathname: '/kfb27KLffGslRPEihqeR/media/**' },
    ],
  },
  async rewrites() {
    return [
      { source: '/ghl-stub/widget/:path*', destination: '/ghl-stub.html' },
      { source: '/ghl-stub/form/:path*', destination: '/ghl-stub.html' },
      { source: '/ghl-stub/link/:path*', destination: '/ghl-stub.html' },
      { source: '/ghl-stub/api/js/:path*', destination: '/ghl-stub/empty.js' },
      { source: '/ghl-stub/api/:path*', destination: '/ghl-stub/ok.json' },
    ];
  },
};

export default nextConfig;
