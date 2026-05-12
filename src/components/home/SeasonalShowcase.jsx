import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ProductGrid, ProductGridSkeleton } from '../catalog/ProductGrid';
import { useProducts } from '../../hooks/useProducts';

export function SeasonalShowcase({ whatsappNumber }) {
  const { products, loading, status } = useProducts({ seasonal: true, limit: 4 });
  if (status === 'error') return null;
  if (!loading && products.length === 0) return null;

  return (
    <section
      aria-labelledby="seasonal-heading"
      className="container-page py-12 md:py-16"
    >
      <header className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <p className="eyebrow text-gold mb-2">Esta semana</p>
          <h2
            id="seasonal-heading"
            className="font-display italic text-3xl md:text-4xl text-text-primary"
          >
            De temporada
          </h2>
        </div>
        <Link
          to="/catalogo/temporada"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
        >
          Ver todo <ChevronRight size={16} aria-hidden="true" />
        </Link>
      </header>
      {loading ? (
        <ProductGridSkeleton count={4} />
      ) : (
        <ProductGrid products={products.slice(0, 4)} whatsappNumber={whatsappNumber} />
      )}
    </section>
  );
}
