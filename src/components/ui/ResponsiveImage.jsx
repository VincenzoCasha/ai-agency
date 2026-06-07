import React from 'react';
import { V2_ASSETS } from '../../lib/v2Assets';

/**
 * ResponsiveImage — sirve imágenes optimizadas del manifest V2 (Fase 4).
 * Usa WebP responsive con srcSet/sizes y, opcionalmente, art-direction
 * (imagen distinta en móvil vía `mobileAssetId`).
 *
 * Props:
 * - assetId: clave en V2_ASSETS (obligatoria)
 * - mobileAssetId: clave alternativa para móvil (<768px) — art direction
 * - sizes: atributo sizes (default '100vw')
 * - eager: carga prioritaria (hero above-the-fold)
 * - decorative: imagen decorativa → alt="" + aria-hidden
 * - alt: override del alt del manifest
 */
export function ResponsiveImage({
  assetId,
  mobileAssetId,
  sizes = '100vw',
  eager = false,
  decorative = false,
  alt,
  className,
  style,
}) {
  const a = V2_ASSETS[assetId];
  if (!a) return null;

  const finalAlt = decorative ? '' : (alt ?? a.alt);
  const loadingProps = eager
    ? { loading: 'eager', fetchPriority: 'high' }
    : { loading: 'lazy' };
  const a11yProps = decorative ? { 'aria-hidden': 'true' } : {};

  const m = mobileAssetId ? V2_ASSETS[mobileAssetId] : null;
  if (m) {
    return (
      <picture>
        <source media="(max-width: 767px)" srcSet={m.srcSet} sizes={sizes} />
        <source media="(min-width: 768px)" srcSet={a.srcSet} sizes={sizes} />
        <img
          src={a.src}
          alt={finalAlt}
          width={a.width}
          height={a.height}
          decoding="async"
          className={className}
          style={style}
          {...loadingProps}
          {...a11yProps}
        />
      </picture>
    );
  }

  return (
    <img
      src={a.src}
      srcSet={a.srcSet}
      sizes={sizes}
      alt={finalAlt}
      width={a.width}
      height={a.height}
      decoding="async"
      className={className}
      style={style}
      {...loadingProps}
      {...a11yProps}
    />
  );
}
