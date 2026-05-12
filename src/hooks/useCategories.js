import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setError(null);
    api
      .get('/categories')
      .then((res) => {
        if (cancelled) return;
        const payload = res?.data;
        const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
        setCategories(list);
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
  }, []);

  return { categories, status, error, loading: status === 'loading' };
}
