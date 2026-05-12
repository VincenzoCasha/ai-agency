import React from 'react';
import { ProductCard } from './ProductCard';
import { cn } from '../../lib/cn';

export function ProductGrid({ products, whatsappNumber, className }) {
  if (!Array.isArray(products) || products.length === 0) return null;
  return (
    <ul
      className={cn(
        'grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
        className,
      )}
    >
      {products.map((p) => (
        <li key={p.id || p.slug}>
          <ProductCard product={p} whatsappNumber={whatsappNumber} />
        </li>
      ))}
    </ul>
  );
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <ul
      aria-hidden="true"
      className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="bg-bg-secondary border border-border rounded-md overflow-hidden animate-pulse"
        >
          <div style={{ aspectRatio: '1 / 1' }} className="bg-bg-elevated" />
          <div className="p-4 space-y-2">
            <div className="h-3 w-1/2 bg-bg-elevated rounded" />
            <div className="h-5 w-3/4 bg-bg-elevated rounded" />
            <div className="h-3 w-full bg-bg-elevated rounded" />
            <div className="h-8 w-1/3 bg-bg-elevated rounded mt-3" />
          </div>
        </li>
      ))}
    </ul>
  );
}
