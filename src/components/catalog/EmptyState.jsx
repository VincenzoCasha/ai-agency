import React from 'react';
import { cn } from '../../lib/cn';

export function EmptyState({ title, description, action, className }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'border border-border rounded-md bg-bg-secondary px-6 py-10 text-center',
        className,
      )}
    >
      <p className="font-display text-2xl text-text-primary">
        {title || 'Sin resultados'}
      </p>
      {description ? (
        <p className="mt-2 text-text-secondary text-sm max-w-prose mx-auto">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
