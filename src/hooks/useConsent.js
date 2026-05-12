import { useCallback, useEffect, useState } from 'react';
import {
  loadConsent,
  acceptAll as acceptAllStorage,
  rejectAll as rejectAllStorage,
  setCategories as setCategoriesStorage,
  CONSENT_VERSION,
} from '../lib/consent';
import { api } from '../lib/api';

/**
 * Hook que expone el estado de consentimiento + acciones para aceptar,
 * rechazar o configurar. Persiste en localStorage y, si la API esta
 * disponible, replica en `POST /consent` (sin bloquear UX si falla).
 */
export function useConsent() {
  const [consent, setConsent] = useState(() => loadConsent());

  useEffect(() => {
    // Re-sincronizar con localStorage si otra tab lo cambia.
    function onStorage(e) {
      if (!e || e.key === null || e.key === undefined) {
        setConsent(loadConsent());
        return;
      }
      if (e.key.startsWith('crudo:consent')) {
        setConsent(loadConsent());
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', onStorage);
      return () => window.removeEventListener('storage', onStorage);
    }
    return undefined;
  }, []);

  const replicateRemote = useCallback(async (saved) => {
    if (!saved || !saved.consent_id) return;
    try {
      await api.post('/consent', {
        consent_id: saved.consent_id,
        analytics: !!saved.analytics,
        marketing: !!saved.marketing,
        preferences: !!saved.preferences,
      });
    } catch {
      // Best-effort: si el backend no responde, mantenemos consent local.
    }
  }, []);

  const acceptAll = useCallback(async () => {
    const saved = acceptAllStorage();
    setConsent(saved);
    await replicateRemote(saved);
    return saved;
  }, [replicateRemote]);

  const rejectAll = useCallback(async () => {
    const saved = rejectAllStorage();
    setConsent(saved);
    await replicateRemote(saved);
    return saved;
  }, [replicateRemote]);

  const setCategories = useCallback(async (categories) => {
    const saved = setCategoriesStorage(categories);
    setConsent(saved);
    await replicateRemote(saved);
    return saved;
  }, [replicateRemote]);

  return {
    consent,
    hasDecision: !!consent && consent.version === CONSENT_VERSION,
    isAnalyticsAllowed: !!(consent && consent.analytics),
    isMarketingAllowed: !!(consent && consent.marketing),
    isPreferencesAllowed: !!(consent && consent.preferences),
    acceptAll,
    rejectAll,
    setCategories,
  };
}
