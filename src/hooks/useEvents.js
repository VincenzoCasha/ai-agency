import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export function useEvents(params = {}) {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const key = JSON.stringify(params);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setError(null);
    api
      .get('/events', { params })
      .then((res) => {
        if (cancelled) return;
        const payload = res?.data;
        const list = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
        setEvents(list);
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

  return { events, status, error, loading: status === 'loading' };
}
