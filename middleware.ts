import { NextResponse, type NextRequest } from 'next/server';

/* Canonical-host redirect (November 2026, "site broken on *.vercel.app" fix).
   The earlier rule lived in vercel.json as `source: "/:path*"` + `has: host *.vercel.app` → 308 to the custom domain. That
   matched EVERY path — stylesheets, fonts, chunks, images, robots, sitemap — so while the custom domain was not attached
   every asset request left for a host that did not resolve: images showed alt text, fonts fell back, icons rendered as
   boxes, the hero text lost its background. Vercel's static config cannot be gated on an environment variable, so the
   redirect moved here, where it can be:
     - it only runs when NEXT_PUBLIC_SITE_URL is set (the canonical origin, e.g. https://castlerock.snoozemattresscompany.com);
       unset → nothing happens, the site works on any host (set the variable in Vercel's PRODUCTION environment only,
       after the custom domain is attached and resolving; leave it unset for Preview so preview URLs never redirect);
     - it only redirects page requests: the matcher below excludes /_next/*, /api/*, /assets/*, the GHL placeholder
       stubs, favicon*, robots.txt, sitemap*.xml, /images/*, /fonts/* and any path with a file extension, so assets are
       never redirected whatever the host;
     - it redirects a *.vercel.app host to the canonical host (308), normalises www ↔ non-www to the canonical host, and
       sends http → https on the custom domain (Vercel already does the latter at the edge; this keeps it explicit).
   The pages are all prerendered at build time, so this is the only code that runs per request, and only for HTML routes. */
const RAW = (process.env.NEXT_PUBLIC_SITE_URL || '').trim().replace(/\/+$/, '');
let CANONICAL: URL | null = null;
try { CANONICAL = RAW ? new URL(RAW) : null; } catch { CANONICAL = null; }

export function middleware(req: NextRequest) {
  if (!CANONICAL) return NextResponse.next();
  const host = (req.headers.get('x-forwarded-host') || req.headers.get('host') || req.nextUrl.host).toLowerCase().split(':')[0];
  const target = CANONICAL.hostname.toLowerCase();
  if (!host || host === 'localhost' || host === '127.0.0.1') return NextResponse.next();
  const proto = (req.headers.get('x-forwarded-proto') || req.nextUrl.protocol.replace(':', '')).toLowerCase();
  const onVercelHost = host.endsWith('.vercel.app');
  const wwwVariant = host === `www.${target}` || `www.${host}` === target;
  const wrongHost = host !== target && (onVercelHost || wwwVariant);
  const wrongProto = host === target && CANONICAL.protocol === 'https:' && proto === 'http';
  if (!wrongHost && !wrongProto) return NextResponse.next();
  const url = new URL(req.nextUrl.pathname + req.nextUrl.search, CANONICAL);
  return NextResponse.redirect(url, 308);
}

export const config = {
  /* page routes only: never _next (static chunks, fonts, images), api, the local asset library, the GHL stubs, favicon,
     robots, sitemap, images/, fonts/, or any path that ends in a file extension */
  matcher: ['/((?!_next/|api/|assets/|ghl-stub|favicon|robots\\.txt|sitemap[^/]*\\.xml|images/|fonts/|.*\\.[A-Za-z0-9]{1,8}$).*)'],
};
