import React, { useId } from 'react';
import { cn } from '../../lib/cn';
import { FieldError } from './FieldError';

export const Select = React.forwardRef(function Select(
  { id, label, hint, error, options = [], placeholder, className, ...rest },
  ref,
) {
  const reactId = useId();
  const inputId = id || `select-${reactId}`;
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
      <select
        ref={ref}
        id={inputId}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className={cn(
          'w-full min-h-[44px] px-3 py-2 rounded-md',
          'bg-bg-elevated text-text-primary border border-border',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold',
          error ? 'border-error focus-visible:ring-error' : 'hover:border-border-strong',
          className,
        )}
        {...rest}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && !error ? (
        <p id={hintId} className="text-xs text-text-muted">{hint}</p>
      ) : null}
      <FieldError id={errorId} message={error} />
    </div>
  );
});
