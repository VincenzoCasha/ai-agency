import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const key = JSON.stringify(params);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setError(null);
    api
      .get('/products', { params })
      .then((res) => {
        if (cancelled) return;
        const payload = res?.data || {};
        setProducts(Array.isArray(payload.data) ? payload.data : Array.isArray(payload.items) ? payload.items : Array.isArray(payload) ? payload : []);
        setPagination(payload.pagination || null);
        setStatus('ok');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { products, pagination, status, error, loading: status === 'loading' };
}
