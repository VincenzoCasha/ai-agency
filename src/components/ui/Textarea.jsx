import React, { useId } from 'react';
import { cn } from '../../lib/cn';
import { FieldError } from './FieldError';

export const Textarea = React.forwardRef(function Textarea(
  { id, label, hint, error, rows = 4, className, ...rest },
  ref,
) {
  const reactId = useId();
  const inputId = id || `textarea-${reactId}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      ) : null}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className={cn(
          'w-full px-3 py-2 rounded-md min-h-[88px]',
          'bg-bg-elevated text-text-primary placeholder:text-text-muted',
          'border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-gold',
          'disabled:opacity-60 resize-y',
          error ? 'border-error focus-visible:ring-error' : 'hover:border-border-strong',
          className,
        )}
        {...rest}
      />
      {hint && !error ? (
        <p id={hintId} className="text-xs text-text-muted">{hint}</p>
      ) : null}
      <FieldError id={errorId} message={error} />
    </div>
  );
});
