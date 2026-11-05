/* The blog's author (the client's decision, November 4, 2026; it replaces the October 27 "Snooze Mattress Company"):
   the Organization "Snooze Mattress + Wellness in Castle Rock" at the site's home URL, on every post. The name is given
   in the page's language — "Snooze Mattress + Wellness in Castle Rock" on the English posts, "Snooze Mattress + Wellness
   en Castle Rock" on the Spanish ones (the Spanish brief, November 2026) — in the BlogPosting author, the article:author
   tag and the visible byline ("By …" / "Por …": lib/i18n.ts `by` + the name below). The LocalBusiness legalName is
   unchanged. The city comes from lib/location.ts. */
import { LOCATION } from './location';
import { SITE_URL } from './schema';
import type { Locale } from './i18n';

export const BLOG_AUTHOR = { name: `Snooze Mattress + Wellness in ${LOCATION.city}`, url: `${SITE_URL}/` } as const;

/* the name as the byline shows it, per language */
export const BLOG_BYLINE_NAME: Record<Locale, string> = { en: BLOG_AUTHOR.name, es: `Snooze Mattress + Wellness en ${LOCATION.city}` };
