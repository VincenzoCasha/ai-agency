import React from 'react';
import { AlertTriangle } from 'lucide-react';

export function AlcoholBlockedNotice({ removed = [] }) {
  return (
    <div
      role="alert"
      className="rounded-md border border-warning/50 bg-warning/10 p-4 text-sm text-text-primary"
    >
      <div className="flex items-start gap-2">
        <AlertTriangle size={18} aria-hidden="true" className="shrink-0 mt-0.5 text-warning" />
        <div>
          <p className="font-semibold">Los vinos no se reservan online.</p>
          <p className="mt-1 text-text-secondary">
            Para vinos y maridajes, escríbenos por WhatsApp y los acordamos contigo.
          </p>
          {removed.length > 0 ? (
            <p className="mt-2 text-xs text-text-muted">
              Quitamos automáticamente: {removed.map((r) => r.name).filter(Boolean).join(', ')}.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
