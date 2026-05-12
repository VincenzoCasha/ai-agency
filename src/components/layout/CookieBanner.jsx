import React, { useState } from 'react';
import { useConsent } from '../../hooks/useConsent';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

/**
 * Cookie banner AEPD-compliant.
 * Aceptar / Rechazar / Configurar con el mismo peso visual.
 * No carga GA4/Pixel: solo registra la decision (analytics.js es noop hasta
 * que el flag de la categoria correspondiente este en true).
 */
export function CookieBanner() {
  const {
    consent,
    hasDecision,
    acceptAll,
    rejectAll,
    setCategories,
  } = useConsent();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    analytics: !!consent?.analytics,
    marketing: !!consent?.marketing,
    preferences: !!consent?.preferences,
  });

  if (hasDecision && !open) return null;

  return (
    <>
      <div
        role="region"
        aria-label="Aviso de cookies"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg-secondary/97 backdrop-blur-md shadow-elevated"
      >
        <div className="container-page py-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <p className="text-sm text-text-secondary">
            Usamos cookies necesarias para que la web funcione. Las cookies
            analiticas y de marketing solo se activan si las aceptas. Puedes
            configurar tus preferencias en cualquier momento.
            {' '}
            <a href="/cookies" className="underline">Mas informacion</a>.
          </p>
          <div className="flex flex-wrap gap-2 md:justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setOpen(true)}
              data-testid="cookie-configure"
            >
              Configurar
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => rejectAll()}
              data-testid="cookie-reject"
            >
              Rechazar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => acceptAll()}
              data-testid="cookie-accept"
            >
              Aceptar
            </Button>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Configurar cookies">
        <div className="space-y-4">
          <Category
            label="Necesarias"
            description="Imprescindibles para que la web funcione (sesion, seguridad, formularios)."
            checked
            disabled
          />
          <Category
            label="Analiticas"
            description="Nos ayudan a entender que paginas se visitan para mejorar el servicio."
            checked={draft.analytics}
            onChange={(v) => setDraft((d) => ({ ...d, analytics: v }))}
          />
          <Category
            label="Marketing"
            description="Permiten medir clics a WhatsApp y reservas de eventos."
            checked={draft.marketing}
            onChange={(v) => setDraft((d) => ({ ...d, marketing: v }))}
          />
          <Category
            label="Preferencias"
            description="Recuerdan filtros del catalogo y datos del formulario."
            checked={draft.preferences}
            onChange={(v) => setDraft((d) => ({ ...d, preferences: v }))}
          />
          <div className="flex flex-wrap gap-2 justify-end pt-2">
            <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={async () => {
                await setCategories(draft);
                setOpen(false);
              }}
              data-testid="cookie-save"
            >
              Guardar preferencias
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function Category({ label, description, checked, disabled, onChange }) {
  return (
    <label className="flex items-start gap-3 p-3 rounded-md border border-border bg-bg-elevated cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 w-4 h-4 accent-[var(--color-accent)]"
      />
      <span className="flex-1">
        <span className="block font-semibold text-text-primary">{label}</span>
        <span className="block text-sm text-text-secondary">{description}</span>
      </span>
    </label>
  );
}
