import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductMeta } from '../components/product/ProductMeta';
import { ProductLongRead } from '../components/product/ProductLongRead';
import { RelatedProducts } from '../components/product/RelatedProducts';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/catalog/EmptyState';
import { Button } from '../components/ui/Button';
import { useProduct } from '../hooks/useProduct';
import { useProducts } from '../hooks/useProducts';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { buildProductSchema } from '../lib/schemaOrg';
import { trackSelectItem } from '../lib/analytics';

export default function ProductPage() {
  const { slug } = useParams();
  const { product, loading, notFound } = useProduct(slug);
  const { config } = useSiteConfig();
  const { products: related } = useProducts(
    product?.category_id
      ? { category: product.category?.slug, limit: 5 }
      : { limit: 4 },
  );

  useEffect(() => {
    if (!product) return;
    trackSelectItem({
      item_id: product.id,
      item_name: product.name,
      item_category: product.type || null,
      source: 'pdp',
    });
    if (typeof document !== 'undefined') {
      document.title = `${product.name} · CRUDO`;
      const descMeta = document.querySelector('meta[name="description"]');
      if (descMeta && product.short_desc) {
        descMeta.setAttribute('content', product.short_desc);
      }
    }
  }, [product]);

  if (loading) {
    return (
      <div className="container-page py-20 flex items-center justify-center" role="status" aria-live="polite">
        <Spinner size={28} />
        <span className="sr-only">Cargando producto…</span>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="container-page py-16">
        <EmptyState
          title="Producto no encontrado"
          description="Puede que ya no esté en la vitrina o que el enlace haya cambiado. Vuelve al catálogo para ver lo de esta semana."
          action={
            <Button as={Link} to="/catalogo">
              Ver catálogo
            </Button>
          }
        />
      </div>
    );
  }

  const schema = buildProductSchema(product);
  const relatedFiltered = related.filter(
    (p) => p && p.slug && p.slug !== product.slug,
  );

  return (
    <article className="container-page py-8 md:py-12">
      <nav aria-label="Migas de pan" className="mb-6 text-sm">
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-1 text-text-secondary hover:text-text-primary"
        >
          <ChevronLeft size={14} aria-hidden="true" />
          Volver al catálogo
        </Link>
      </nav>
      <div className="grid gap-8 md:gap-12 md:grid-cols-2 items-start">
        <ProductGallery images={product.images} productName={product.name} />
        <ProductMeta
          product={product}
          whatsappNumber={config?.contact?.whatsapp_public}
        />
      </div>
      <div className="mt-12">
        <ProductLongRead product={product} />
      </div>
      <RelatedProducts
        products={relatedFiltered}
        whatsappNumber={config?.contact?.whatsapp_public}
      />
      {schema ? (
        <script
          type="application/ld+json"
          // El schema sale de buildProductSchema y solo contiene strings/numbers
          // saneados desde la API; safe para JSON.stringify.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ) : null}
    </article>
  );
}
