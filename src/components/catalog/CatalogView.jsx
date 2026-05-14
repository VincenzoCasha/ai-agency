import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { CatalogToolbar } from './CatalogToolbar';
import { ProductGrid, ProductGridSkeleton } from './ProductGrid';
import { EmptyState } from './EmptyState';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useSiteConfig } from '../../hooks/useSiteConfig';

export function CatalogView({
  pageTitle,
  pageEyebrow,
  pageIntro,
  fixedFilters = {},
  showCategoryFilter = true,
  showSeasonalToggle = false,
  emptyMessage,
}) {
  const [query, setQuery] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [seasonalOnly, setSeasonalOnly] = useState(false);

  const { config } = useSiteConfig();
  const { categories } = useCategories();

  const filters = useMemo(() => {
    const f = { limit: 24, ...fixedFilters };
    if (query) f.q = query;
    if (categorySlug) f.category = categorySlug;
    if (seasonalOnly) f.seasonal = true;
    return f;
  }, [fixedFilters, query, categorySlug, seasonalOnly]);

  const { products, loading, status, error } = useProducts(filters);

  useEffect(() => {
    if (typeof document !== 'undefined' && pageTitle) {
      document.title = `${pageTitle} · CRUDO`;
    }
  }, [pageTitle]);

  return (
    <article className="container-page py-10 md:py-14">
      <header className="mb-8 max-w-prose">
        {pageEyebrow ? <p className="eyebrow mb-3">{pageEyebrow}</p> : null}
        <h1 className="font-display text-4xl md:text-5xl text-text-primary leading-[1.05]">
          {pageTitle}
        </h1>
        {pageIntro ? (
          <p className="mt-4 text-text-secondary text-lg">{pageIntro}</p>
        ) : null}
      </header>

      <CatalogToolbar
        query={query}
        onQueryChange={setQuery}
        categorySlug={categorySlug}
        onCategoryChange={setCategorySlug}
        categories={showCategoryFilter ? categories : []}
        showSeasonalToggle={showSeasonalToggle}
        seasonalOnly={seasonalOnly}
        onSeasonalChange={setSeasonalOnly}
        resultsCount={status === 'ok' ? products.length : null}
      />

      {loading ? (
        <ProductGridSkeleton count={6} />
      ) : status === 'error' ? (
        <EmptyState
          title="No hemos podido cargar el catálogo."
          description={
            error?.detail ||
            'Inténtalo de nuevo en unos segundos o pásate por la tienda.'
          }
          action={
            <Button as={Link} to="/">
              Volver al inicio
            </Button>
          }
        />
      ) : products.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          description={
            emptyMessage ||
            'Prueba a quitar filtros o escríbenos por WhatsApp y te decimos qué tenemos hoy.'
          }
          action={
            <Button
              variant="ghost"
              onClick={() => {
                setQuery('');
                setCategorySlug('');
                setSeasonalOnly(false);
              }}
            >
              Limpiar filtros
            </Button>
          }
        />
      ) : (
        <ProductGrid
          products={products}
          whatsappNumber={config?.contact?.whatsapp_public}
        />
      )}
    </article>
  );
}
