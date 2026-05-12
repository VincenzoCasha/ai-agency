import React from 'react';
import { ProductCard } from '../catalog/ProductCard';

export function RelatedProducts({ products = [], whatsappNumber, heading = 'También te puede interesar' }) {
  const list = Array.isArray(products) ? products.filter(Boolean).slice(0, 4) : [];
  if (list.length === 0) return null;
  return (
    <section aria-labelledby="related-heading" className="mt-12">
      <h2 id="related-heading" className="font-display italic text-2xl text-text-primary mb-5">
        {heading}
      </h2>
      <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {list.map((p) => (
          <li key={p.id || p.slug}>
            <ProductCard product={p} whatsappNumber={whatsappNumber} />
          </li>
        ))}
      </ul>
    </section>
  );
}
