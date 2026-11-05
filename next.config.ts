import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Every route is prerendered at build time (no dynamic data), so Vercel serves the pages from its CDN like static files.
  // The site is not a static export (`output: 'export'`): the canonical-host redirect lives in middleware.ts (Next.js
  // rejects middleware under a static export), gated on NEXT_PUBLIC_SITE_URL and matching page routes only, so the site
  // works unchanged on any host — including *.vercel.app previews, where every asset must keep loading. Redirects for
  // legacy slugs, the GHL stub rewrites and cache headers stay in vercel.json; the ghl-stub rewrites are mirrored below
  // so `next start` behaves like the deployment.
  // Assets are always relative (no assetPrefix).
  experimental: { inlineCss: true }, // the page's own CSS is written into the HTML instead of render-blocking stylesheet requests
  // next/image (the blog's hero and card images, the footer logo) goes through the image optimizer: resized and served as
  // WebP at /_next/image, never the originals. Remote sources are limited to the client's media library folder that holds
  // the blog hero images (the Castle Rock blog brief, November 5, 2026); local /assets files need no pattern.
  images: {
    formats: ['image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: 'assets.cdn.filesafe.space', pathname: '/kfb27KLffGslRPEihqeR/media/**' }],
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
