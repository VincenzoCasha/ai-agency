import React, { useId } from 'react';
import { cn } from '../../lib/cn';
import { FieldError } from './FieldError';

const fieldClasses = [
  'w-full min-h-[44px] px-3 py-2 rounded-md',
  'bg-bg-elevated text-text-primary placeholder:text-text-muted',
  'border border-border',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold',
  'disabled:opacity-60',
].join(' ');

export const Input = React.forwardRef(function Input(
  { id, label, hint, error, className, type = 'text', ...rest },
  ref,
) {
  const reactId = useId();
  const inputId = id || `input-${reactId}`;
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
      <input
        ref={ref}
        id={inputId}
        type={type}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className={cn(
          fieldClasses,
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
