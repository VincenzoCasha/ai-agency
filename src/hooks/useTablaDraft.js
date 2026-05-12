import { useEffect, useState, useCallback } from 'react';
import {
  getDraft,
  getItemCount,
  getTotalCents,
  addItem as addItemStorage,
  removeItem as removeItemStorage,
  setQuantity as setQuantityStorage,
  clearDraft as clearDraftStorage,
  subscribe,
  AlcoholInTablaError,
} from '../lib/tablaDraft';

export function useTablaDraft() {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribe(() => setVersion((v) => v + 1));
    function onStorage(e) {
      if (!e || !e.key || e.key.startsWith('crudo:tabla:draft')) {
        setVersion((v) => v + 1);
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', onStorage);
    }
    return () => {
      unsubscribe();
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', onStorage);
      }
    };
  }, []);

  const addItem = useCallback((product, quantity) => {
    try {
      return { ok: true, draft: addItemStorage(product, quantity) };
    } catch (err) {
      if (err instanceof AlcoholInTablaError) {
        return { ok: false, error: err, code: 'ALCOHOL_NOT_ALLOWED' };
      }
      return { ok: false, error: err, code: 'UNKNOWN' };
    }
  }, []);

  const removeItem = useCallback((productId) => removeItemStorage(productId), []);
  const setQuantity = useCallback((productId, qty) => setQuantityStorage(productId, qty), []);
  const clear = useCallback(() => clearDraftStorage(), []);

  return {
    draft: getDraft(),
    items: getDraft().items,
    count: getItemCount(),
    totalCents: getTotalCents(),
    addItem,
    removeItem,
    setQuantity,
    clear,
    // version exposed so consumers can key on it if needed
    _version: version,
  };
}
