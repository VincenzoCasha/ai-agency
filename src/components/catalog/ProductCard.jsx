import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Plus } from 'lucide-react';
import { Tag } from '../ui/Tag';
import { StockBadge } from './StockBadge';
import { cn } from '../../lib/cn';
import { trackSelectItem, trackWineWhatsAppClick } from '../../lib/analytics';
import { buildProductInquiryUrl } from '../../lib/whatsapp';
import { useTablaDraft } from '../../hooks/useTablaDraft';
import { V2_ASSETS } from '../../lib/v2Assets';

function formatPrice(cents) {
  if (cents == null || Number.isNaN(Number(cents))) return null;
  const n = Number(cents) / 100;
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

// Fallbacks editoriales 1:1 optimizados (manifest V2, Fase 4).
const FALLBACK_BY_TYPE = {
  CHEESE: V2_ASSETS['fallback-queso'],
  WINE: V2_ASSETS['fallback-maridaje'],
};

function getFallback(product) {
  const type = (product.type || '').toUpperCase();
  return FALLBACK_BY_TYPE[type] || V2_ASSETS['fallback-queso'] || null;
}

export function ProductCard({ product, whatsappNumber }) {
  const { addItem } = useTablaDraft();
  if (!product) return null;

  const isWine = product.is_alcohol === true;
  const isOut = product.stock_status === 'OUT';
  const price = formatPrice(product.price_cents);
  const image = product.images?.[0];
  const fallback = !image?.url ? getFallback(product) : null;
  const detailHref = `/producto/${product.slug}`;
  const eyebrow = [product.producer, product.region].filter(Boolean).join(' · ');

  function handleAdd(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    const result = addItem(product, 1);
    if (result.ok) {
      trackSelectItem({
        item_id: product.id,
        item_name: product.name,
        item_category: product.type || null,
        source: 'product_card',
      });
    }
  }

  function handleWineClick() {
    trackWineWhatsAppClick({
      item_id: product.id,
      item_name: product.name,
      source: 'product_card',
    });
  }

  return (
    <article
      className={cn(
        'group flex flex-col bg-bg-secondary border border-border rounded-md overflow-hidden',
        'transition-all hover:border-border-strong hover:-translate-y-0.5 hover:shadow-elevated',
      )}
    >
      <Link
        to={detailHref}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        onClick={() => trackSelectItem({ item_id: product.id, item_name: product.name, source: 'card_image' })}
      >
        <div className="relative" style={{ aspectRatio: '1 / 1' }}>
          {image?.url ? (
            <img
              src={image.url}
              alt={image.alt_text || product.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-95"
            />
          ) : fallback ? (
            <img
              src={fallback.src}
              srcSet={fallback.srcSet}
              sizes="(max-width: 768px) 50vw, 25vw"
              alt={fallback.alt}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-bg-elevated text-text-muted">
              <span className="font-display text-3xl opacity-50">CRUDO</span>
            </div>
          )}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {product.is_seasonal ? <Tag tone="gold">Temporada</Tag> : null}
            {product.is_featured ? <Tag>Destacado</Tag> : null}
          </div>
          {isOut ? (
            <div className="absolute top-2 right-2">
              <StockBadge stockStatus="OUT" />
            </div>
          ) : product.stock_status === 'LOW' ? (
            <div className="absolute top-2 right-2">
              <StockBadge stockStatus="LOW" />
            </div>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-col gap-2 p-4 flex-1">
        {eyebrow ? (
          <p className="eyebrow text-text-muted text-[0.65rem]">{eyebrow}</p>
        ) : null}
        <h3 className="font-display text-xl leading-tight text-text-primary">
          <Link
            to={detailHref}
            className="hover:text-gold focus-visible:outline-none focus-visible:underline"
            onClick={() => trackSelectItem({ item_id: product.id, item_name: product.name, source: 'card_title' })}
          >
            {product.name}
          </Link>
        </h3>
        {product.short_desc ? (
          <p className="text-sm text-text-secondary line-clamp-2">{product.short_desc}</p>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          {price ? (
            <span className="font-mono text-sm text-text-primary" aria-label="Precio">
              {price}
            </span>
          ) : (
            <span aria-hidden="true" />
          )}
          {isWine ? (
            <a
              href={buildProductInquiryUrl(product.name, whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWineClick}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 min-h-[40px] rounded-md text-sm font-semibold',
                'border border-border-strong text-text-primary hover:border-gold',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
              )}
              aria-label={`Consultar ${product.name} por WhatsApp`}
            >
              <MessageCircle size={16} aria-hidden="true" />
              WhatsApp
            </a>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              disabled={isOut}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 min-h-[40px] rounded-md text-sm font-semibold',
                'bg-accent text-text-inverse hover:bg-accent-hover',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
              )}
              aria-label={`Añadir ${product.name} a Mi Cesta`}
            >
              <Plus size={16} aria-hidden="true" />
              Añadir
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
