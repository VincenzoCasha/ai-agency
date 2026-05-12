import React, { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTablaDraft } from '../../hooks/useTablaDraft';
import { trackSelectItem } from '../../lib/analytics';

export function AddToTablaButton({ product, source = 'pdp', size = 'lg' }) {
  const { addItem } = useTablaDraft();
  const [feedback, setFeedback] = useState(null);

  if (!product || product.is_alcohol === true) return null;
  const isOut = product.stock_status === 'OUT';

  function onClick() {
    const result = addItem(product, 1);
    if (result.ok) {
      trackSelectItem({
        item_id: product.id,
        item_name: product.name,
        item_category: product.type || null,
        source,
      });
      setFeedback('added');
      window.setTimeout(() => setFeedback(null), 1800);
    } else {
      setFeedback('error');
      window.setTimeout(() => setFeedback(null), 2500);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="primary"
        size={size}
        block
        onClick={onClick}
        disabled={isOut}
        aria-label={`Añadir ${product.name} a Mi Tabla`}
      >
        {feedback === 'added' ? (
          <>
            <Check size={18} aria-hidden="true" />
            Añadido a Mi Tabla
          </>
        ) : (
          <>
            <Plus size={18} aria-hidden="true" />
            Añadir a Mi Tabla
          </>
        )}
      </Button>
      {isOut ? (
        <p className="text-xs text-warning">
          Producto agotado de momento. Pregúntanos en tienda por la próxima entrada.
        </p>
      ) : (
        <p className="text-xs text-text-muted">
          Reservas tu tabla aquí y la pagas en CRUDO al recoger.
        </p>
      )}
      {feedback === 'error' ? (
        <p role="alert" className="text-xs text-error">
          No se pudo añadir. Inténtalo de nuevo.
        </p>
      ) : null}
    </div>
  );
}
