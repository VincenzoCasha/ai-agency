import React from 'react';
import { cn } from '../../lib/cn';

export function Spinner({ size = 18, className, ...rest }) {
  return (
    <span
      role="status"
      className={cn('inline-block', className)}
      style={{ width: size, height: size }}
      {...rest}
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        aria-hidden="true"
        className="animate-spin"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="40 60"
          opacity="0.6"
        />
      </svg>
    </span>
  );
}
