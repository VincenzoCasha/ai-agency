import React from 'react';

const MILK_TYPE_LABELS = {
  COW: 'Vaca',
  GOAT: 'Cabra',
  SHEEP: 'Oveja',
  BUFFALO: 'Búfala',
  MIXED: 'Mezcla',
};

const MILK_TREATMENT_LABELS = {
  RAW: 'Leche cruda',
  PASTEURIZED: 'Pasteurizada',
  THERMIZED: 'Termizada',
};

const INTENSITY_LABELS = {
  MILD: 'Suave',
  MEDIUM: 'Media',
  STRONG: 'Fuerte',
  INTENSE: 'Intensa',
};

export function ProductLongRead({ product }) {
  if (!product) return null;
  const attrs = [];
  if (product.milk_type) {
    attrs.push({ label: 'Leche', value: MILK_TYPE_LABELS[product.milk_type] || product.milk_type });
  }
  if (product.milk_treatment) {
    attrs.push({
      label: 'Tratamiento',
      value: MILK_TREATMENT_LABELS[product.milk_treatment] || product.milk_treatment,
    });
  }
  if (product.intensity) {
    attrs.push({ label: 'Intensidad', value: INTENSITY_LABELS[product.intensity] || product.intensity });
  }
  if (product.region) attrs.push({ label: 'Origen', value: product.region });
  if (product.producer) attrs.push({ label: 'Productor', value: product.producer });

  const hasLongDesc = !!(product.long_desc && product.long_desc.trim());
  const hasPairing = !!(product.pairing && product.pairing.trim());

  if (!hasLongDesc && !hasPairing && attrs.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="product-longread" className="space-y-8">
      {attrs.length > 0 ? (
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          {attrs.map((a) => (
            <div key={a.label} className="border-l border-border pl-3">
              <dt className="eyebrow text-[0.65rem] text-text-muted">{a.label}</dt>
              <dd className="mt-1 text-text-primary">{a.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {hasLongDesc ? (
        <div>
          <h2 id="product-longread" className="font-display italic text-2xl text-text-primary mb-3">
            La historia
          </h2>
          <p className="text-text-secondary leading-relaxed max-w-prose whitespace-pre-line">
            {product.long_desc}
          </p>
        </div>
      ) : null}
      {hasPairing ? (
        <div>
          <h3 className="font-display italic text-xl text-text-primary mb-2">Maridaje</h3>
          <p className="text-text-secondary leading-relaxed max-w-prose whitespace-pre-line">
            {product.pairing}
          </p>
        </div>
      ) : null}
    </section>
  );
}
