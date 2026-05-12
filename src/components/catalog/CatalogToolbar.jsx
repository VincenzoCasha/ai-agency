import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { cn } from '../../lib/cn';

export function CatalogToolbar({
  query = '',
  onQueryChange,
  categorySlug = '',
  onCategoryChange,
  categories = [],
  showSeasonalToggle = false,
  seasonalOnly = false,
  onSeasonalChange,
  resultsCount = null,
  className,
}) {
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (localQuery !== query && typeof onQueryChange === 'function') {
        onQueryChange(localQuery);
      }
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localQuery]);

  function clearAll() {
    setLocalQuery('');
    if (typeof onQueryChange === 'function') onQueryChange('');
    if (typeof onCategoryChange === 'function') onCategoryChange('');
    if (typeof onSeasonalChange === 'function') onSeasonalChange(false);
  }

  const hasFilters = !!(localQuery || categorySlug || seasonalOnly);

  return (
    <div
      className={cn(
        'flex flex-col gap-3 md:flex-row md:items-center md:justify-between',
        'border-b border-border pb-4 mb-6',
        className,
      )}
      role="search"
      aria-label="Filtros de catálogo"
    >
      <div className="flex flex-1 flex-col sm:flex-row gap-2 sm:items-center">
        <label className="flex-1 relative">
          <span className="sr-only">Buscar productos</span>
          <Search
            size={16}
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <Input
            type="search"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Buscar quesos, productores, regiones…"
            className="pl-9"
          />
        </label>
        {categories.length > 0 ? (
          <label className="sm:w-56">
            <span className="sr-only">Categoría</span>
            <Select
              value={categorySlug}
              onChange={(e) => onCategoryChange?.(e.target.value)}
              options={[
                { value: '', label: 'Todas las categorías' },
                ...categories.map((c) => ({ value: c.slug, label: c.name })),
              ]}
            />
          </label>
        ) : null}
        {showSeasonalToggle ? (
          <label className="inline-flex items-center gap-2 px-3 min-h-[44px] rounded-md border border-border text-sm text-text-secondary hover:border-border-strong cursor-pointer">
            <input
              type="checkbox"
              checked={seasonalOnly}
              onChange={(e) => onSeasonalChange?.(e.target.checked)}
              className="accent-accent"
            />
            <span>Sólo temporada</span>
          </label>
        ) : null}
      </div>
      <div className="flex items-center gap-3 text-sm text-text-muted">
        {resultsCount != null ? (
          <span aria-live="polite">
            {resultsCount} {resultsCount === 1 ? 'resultado' : 'resultados'}
          </span>
        ) : null}
        {hasFilters ? (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <X size={14} aria-hidden="true" />
            Limpiar
          </Button>
        ) : null}
      </div>
    </div>
  );
}
