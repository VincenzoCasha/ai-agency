import { useEffect, useState } from 'react';
import { fetchSiteConfig, FALLBACK_SITE_CONFIG } from '../lib/siteConfig';

/**
 * Hook que entrega `siteConfig` para el layout. Empieza con el fallback
 * documentado y reemplaza con la respuesta real cuando la API responde.
 */
export function useSiteConfig() {
  const [config, setConfig] = useState(FALLBACK_SITE_CONFIG);
  const [status, setStatus] = useState('idle'); // idle | loading | ok | error

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    fetchSiteConfig()
      .then((data) => {
        if (cancelled) return;
        setConfig({ ...FALLBACK_SITE_CONFIG, ...data });
        setStatus('ok');
      })
      .catch(() => {
        if (cancelled) return;
        setStatus('error');
      });
    return () => { cancelled = true; };
  }, []);

  return { config, status };
}
