import type { Metadata } from 'next';
import { NotFoundContent, NOT_FOUND_TITLE } from '@/components/NotFoundContent';

/* notFound() dentro del árbol en español: el 404 de la marca dentro del layout en español */
export const metadata: Metadata = { title: NOT_FOUND_TITLE.es, robots: { index: false, follow: true } };

export default function NotFound() {
  return <NotFoundContent locale="es" />;
}
