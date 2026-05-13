import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export function useEvent(slug) {
  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState(slug ? 'loading' : 'idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setEvent(null);
      setStatus('idle');
      return undefined;
    }
    let cancelled = false;
    setStatus('loading');
    setError(null);
    api
      .get(`/events/${encodeURIComponent(slug)}`)
      .then((res) => {
        if (cancelled) return;
        setEvent(res?.data || null);
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
  }, [slug]);

  return { event, status, error, loading: status === 'loading' };
}
