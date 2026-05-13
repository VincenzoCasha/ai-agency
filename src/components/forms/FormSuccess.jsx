import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { BrandSticker } from '../brand/BrandSticker';

export function FormSuccess({ title, message, withSticker = false }) {
  return (
    <div
      role="status"
      className="relative rounded-md border border-success/40 bg-success/10 p-5"
    >
      {withSticker ? (
        <div aria-hidden="true" className="absolute -top-6 right-4 hidden md:block">
          <BrandSticker rotation={-10} size={56} />
        </div>
      ) : null}
      <div className="flex items-start gap-3">
        <CheckCircle2 size={20} aria-hidden="true" className="shrink-0 mt-0.5 text-success" />
        <div>
          <p className="font-semibold text-text-primary">{title}</p>
          {message ? <p className="mt-1 text-sm text-text-secondary">{message}</p> : null}
        </div>
      </div>
    </div>
  );
}
