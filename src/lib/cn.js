import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Helper estandar para componer clases Tailwind con dedupe.
 * Uso: cn('px-3 py-2', condicional && 'bg-accent', extra)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
