import type { Metadata } from 'next';
import { NotFoundContent, NOT_FOUND_TITLE } from '@/components/NotFoundContent';

/* notFound() inside the English tree: the branded 404 within the English layout (unknown URLs are app/global-not-found.tsx) */
export const metadata: Metadata = { title: NOT_FOUND_TITLE.en, robots: { index: false, follow: true } };

export default function NotFound() {
  return <NotFoundContent locale="en" />;
}
