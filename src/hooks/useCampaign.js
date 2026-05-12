import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export function useActiveCampaign() {
  const [campaign, setCampaign] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setError(null);
    api
      .get('/campaigns/active')
      .then((res) => {
        if (cancelled) return;
        setCampaign(res?.data || null);
        setStatus('ok');
      })
      .catch((err) => {
        if (cancelled) return;
        if (err?.status === 404) {
          setCampaign(null);
          setStatus('ok');
          return;
        }
        setError(err);
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { campaign, status, error, loading: status === 'loading' };
}
