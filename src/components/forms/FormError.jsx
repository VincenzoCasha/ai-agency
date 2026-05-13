import React from 'react';
import { AlertTriangle } from 'lucide-react';

export function FormError({ message }) {
  if (!message) return null;
  return (
    <div role="alert" className="rounded-md border border-error/40 bg-error/10 p-3">
      <p className="flex items-start gap-2 text-sm text-text-primary">
        <AlertTriangle size={16} aria-hidden="true" className="shrink-0 mt-0.5 text-error" />
        <span>{message}</span>
      </p>
    </div>
  );
}
