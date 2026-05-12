import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setProduct(null);
      setStatus('idle');
      return undefined;
    }
    let cancelled = false;
    setStatus('loading');
    setError(null);
    api
      .get(`/products/${encodeURIComponent(slug)}`)
      .then((res) => {
        if (cancelled) return;
        setProduct(res?.data || null);
        setStatus('ok');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setStatus(err?.status === 404 ? 'not_found' : 'error');
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return {
    product,
    status,
    error,
    loading: status === 'loading',
    notFound: status === 'not_found',
  };
}
