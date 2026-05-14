import React, { useId, useMemo, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { buildWhatsAppUrl } from '../../lib/whatsapp';
import { trackWineWhatsAppClick } from '../../lib/analytics';

const TABLA_SIZES = [
  { id: '3', label: '3 quesos', desc: '60-70 g por queso · ideal para 2 personas' },
  { id: '6', label: '6 quesos', desc: 'Surtido amplio · ideal para 2-3 personas' },
  { id: '8', label: '8 quesos', desc: 'Cata completa · ideal para 4 personas' },
];

const PAIRINGS = [
  { id: 'none', label: 'Sin maridaje', wine: false },
  { id: 'white_dry', label: 'Vino blanco seco', wine: true },
  { id: 'white_fruity', label: 'Vino blanco afrutado', wine: true },
  { id: 'red_light', label: 'Vino tinto ligero', wine: true },
  { id: 'red_full', label: 'Vino tinto con cuerpo', wine: true },
];

function buildMessage({ size, pairingLabel, isNatural, hasWine }) {
  const sizeLabel = TABLA_SIZES.find((s) => s.id === size)?.label || `${size} quesos`;
  const naturalSuffix = isNatural && hasWine ? ', preferiblemente natural' : '';
  if (!hasWine) {
    return `Hola CRUDO, me interesa una tabla de ${sizeLabel} sin maridaje. ¿Podemos confirmar disponibilidad y recogida?`;
  }
  return `Hola CRUDO, me interesa una tabla de ${sizeLabel} con maridaje ${pairingLabel.toLowerCase()}${naturalSuffix}. ¿Cuándo podríais prepararla?`;
}

/**
 * Selector de tabla con maridaje. Por regla V1 toda tabla con vino se acuerda
 * por WhatsApp (no entra a Mi Tabla). La tabla "sin maridaje" también se
 * gestiona por WhatsApp aquí porque las tablas no están como producto SKU
 * todavía — cuando lo estén, podríamos enviar la "sin maridaje" a Mi Tabla.
 */
export function TablaMaridajeSelector({ siteConfig }) {
  const reactId = useId();
  const naturalId = `tabla-natural-${reactId}`;
  const [size, setSize] = useState('3');
  const [pairingId, setPairingId] = useState('none');
  const [isNatural, setIsNatural] = useState(false);

  const pairing = useMemo(() => PAIRINGS.find((p) => p.id === pairingId), [pairingId]);
  const hasWine = pairing?.wine === true;
  const whatsappNumber = siteConfig?.contact?.whatsapp_public;
  const message = buildMessage({
    size,
    pairingLabel: pairing?.label || '',
    isNatural,
    hasWine,
  });
  const href = whatsappNumber ? buildWhatsAppUrl(whatsappNumber, message) : null;

  function handleClick() {
    trackWineWhatsAppClick({
      source: 'tabla_selector',
      size,
      pairing: pairingId,
      natural: isNatural && hasWine,
    });
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="bg-bg-secondary border border-border rounded-md p-5 md:p-6 space-y-6"
      aria-label="Configura tu tabla"
    >
      <fieldset>
        <legend className="text-sm uppercase tracking-eyebrow text-text-muted mb-3">
          Tamaño
        </legend>
        <div className="grid gap-2 md:grid-cols-3">
          {TABLA_SIZES.map((s) => (
            <label
              key={s.id}
              className={[
                'cursor-pointer rounded-md border p-4 transition-colors',
                size === s.id
                  ? 'border-accent bg-accent/10'
                  : 'border-border hover:border-border-strong',
              ].join(' ')}
            >
              <input
                type="radio"
                name="size"
                value={s.id}
                checked={size === s.id}
                onChange={() => setSize(s.id)}
                className="sr-only"
              />
              <p className="font-display text-2xl text-text-primary leading-tight">
                {s.label}
              </p>
              <p className="mt-1 text-xs text-text-secondary">{s.desc}</p>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm uppercase tracking-eyebrow text-text-muted mb-3">
          Maridaje
        </legend>
        <div className="grid gap-2 md:grid-cols-2">
          {PAIRINGS.map((p) => (
            <label
              key={p.id}
              className={[
                'cursor-pointer rounded-md border p-3 flex items-center gap-2 transition-colors',
                pairingId === p.id
                  ? 'border-accent bg-accent/10'
                  : 'border-border hover:border-border-strong',
              ].join(' ')}
            >
              <input
                type="radio"
                name="pairing"
                value={p.id}
                checked={pairingId === p.id}
                onChange={() => setPairingId(p.id)}
                className="sr-only"
              />
              <span className="text-text-primary">{p.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {hasWine ? (
        <div className="flex items-start gap-2">
          <input
            id={naturalId}
            type="checkbox"
            checked={isNatural}
            onChange={(e) => setIsNatural(e.target.checked)}
            className="mt-1"
          />
          <label htmlFor={naturalId} className="text-sm text-text-secondary">
            Prefiero que sea vino natural si es posible.
          </label>
        </div>
      ) : null}

      <div className="border-t border-border pt-5 space-y-3">
        <p className="text-xs text-text-muted italic">
          {hasWine
            ? 'Los vinos no se reservan online: confirmamos disponibilidad y precio por WhatsApp y pagas en CRUDO al recoger.'
            : 'Sin vino: la tabla se confirma por WhatsApp y la pagas en CRUDO al recoger.'}
        </p>
        {href ? (
          <Button
            as="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            size="lg"
            block
          >
            <MessageCircle size={18} aria-hidden="true" />
            Reservar por WhatsApp
          </Button>
        ) : (
          <p className="text-sm text-warning">
            WhatsApp no configurado. Escríbenos a {siteConfig?.contact?.email || 'crudomov@gmail.com'}.
          </p>
        )}
      </div>
    </form>
  );
}
