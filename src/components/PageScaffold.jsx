import React, { useEffect } from 'react';

/**
 * Estructura semantica minima compartida por las pages placeholder.
 * Pone el title del documento y un hero coherente con la marca.
 */
export function PageScaffold({ title, eyebrow, intro, children }) {
  useEffect(() => {
    if (title && typeof document !== 'undefined') {
      document.title = `${title} · CRUDO`;
    }
  }, [title]);

  return (
    <article className="container-page py-10 md:py-16">
      <header className="max-w-prose">
        {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05]">
          {title}
        </h1>
        {intro ? (
          <p className="mt-4 text-text-secondary text-lg">{intro}</p>
        ) : null}
      </header>
      {children ? <div className="mt-10">{children}</div> : null}
    </article>
  );
}
