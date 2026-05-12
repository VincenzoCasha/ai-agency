import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { buildProductInquiryUrl } from '../../lib/whatsapp';
import { trackWineWhatsAppClick } from '../../lib/analytics';

export function WineWhatsAppButton({ product, whatsappNumber, source = 'pdp', size = 'lg' }) {
  if (!product) return null;
  const href = buildProductInquiryUrl(product.name, whatsappNumber);

  function onClick() {
    trackWineWhatsAppClick({
      item_id: product.id,
      item_name: product.name,
      source,
    });
  }

  return (
    <div className="space-y-2">
      <Button
        as="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        variant="primary"
        size={size}
        block
        aria-label={`Consultar disponibilidad de ${product.name} por WhatsApp`}
      >
        <MessageCircle size={18} aria-hidden="true" />
        Consultar por WhatsApp
      </Button>
      <p className="text-xs text-text-muted">
        Los vinos se reservan y se pagan en CRUDO.
      </p>
    </div>
  );
}
