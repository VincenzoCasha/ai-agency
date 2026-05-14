import React from 'react';
import { Tag } from '../ui/Tag';
import { StockBadge } from '../catalog/StockBadge';
import { AddToTablaButton } from './AddToTablaButton';
import { WineWhatsAppButton } from './WineWhatsAppButton';

function formatPrice(cents) {
  if (cents == null || Number.isNaN(Number(cents))) return null;
  const n = Number(cents) / 100;
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

export function ProductMeta({ product, whatsappNumber }) {
  if (!product) return null;
  const isWine = product.is_alcohol === true;
  const price = formatPrice(product.price_cents);
  const eyebrow = [product.producer, product.region].filter(Boolean).join(' · ');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {product.is_seasonal ? <Tag tone="gold">Temporada</Tag> : null}
          {product.is_featured ? <Tag>Destacado</Tag> : null}
          {product.stock_status === 'OUT' ? (
            <StockBadge stockStatus="OUT" />
          ) : product.stock_status === 'LOW' ? (
            <StockBadge stockStatus="LOW" />
          ) : null}
          {isWine ? <Tag tone="warning">Reserva por WhatsApp</Tag> : null}
        </div>
        {eyebrow ? (
          <p className="eyebrow text-text-muted text-xs">{eyebrow}</p>
        ) : null}
        <h1 className="font-display text-4xl sm:text-5xl leading-[1.05] text-text-primary">
          {product.name}
        </h1>
        {product.short_desc ? (
          <p className="text-text-secondary text-lg max-w-prose">{product.short_desc}</p>
        ) : null}
        {price ? (
          <p
            className="font-mono text-2xl text-text-primary"
            aria-label={`Precio ${price}`}
          >
            {price}
          </p>
        ) : null}
      </div>
      <div>
        {isWine ? (
          <WineWhatsAppButton product={product} whatsappNumber={whatsappNumber} />
        ) : (
          <AddToTablaButton product={product} />
        )}
      </div>
    </div>
  );
}
