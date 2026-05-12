const STORAGE_KEY = 'crudo:tabla:draft:v1';
const MAX_QTY = 99;

function safeStorage() {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

function load() {
  const ls = safeStorage();
  if (!ls) return { items: [] };
  try {
    const raw = ls.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return { items: [] };
    return parsed;
  } catch {
    return { items: [] };
  }
}

function persist(draft) {
  const ls = safeStorage();
  if (ls) {
    try { ls.setItem(STORAGE_KEY, JSON.stringify(draft)); } catch { /* ignore */ }
  }
  notify();
  return draft;
}

const listeners = new Set();
function notify() {
  for (const fn of listeners) {
    try { fn(); } catch { /* ignore */ }
  }
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export class AlcoholInTablaError extends Error {
  constructor(productName) {
    super(`No se pueden añadir productos con alcohol a Mi Tabla: ${productName}`);
    this.name = 'AlcoholInTablaError';
  }
}

export function getDraft() {
  return load();
}

export function getItems() {
  return load().items;
}

export function getItemCount() {
  return load().items.reduce((sum, i) => sum + (i.quantity || 0), 0);
}

export function getTotalCents() {
  return load().items.reduce((sum, i) => sum + ((i.price_cents || 0) * (i.quantity || 0)), 0);
}

export function addItem(product, quantity = 1) {
  if (!product || typeof product !== 'object') {
    throw new Error('Producto inválido');
  }
  if (product.is_alcohol === true) {
    throw new AlcoholInTablaError(product.name || product.slug || 'desconocido');
  }
  const draft = load();
  const qty = Math.max(1, Math.min(MAX_QTY, Number(quantity) || 1));
  const existing = draft.items.find((i) => i.id === product.id);
  if (existing) {
    existing.quantity = Math.min(MAX_QTY, existing.quantity + qty);
  } else {
    draft.items.push({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price_cents: product.price_cents,
      quantity: qty,
      is_alcohol: false,
      image_url: product.images?.[0]?.url || null,
    });
  }
  return persist(draft);
}

export function removeItem(productId) {
  const draft = load();
  draft.items = draft.items.filter((i) => i.id !== productId);
  return persist(draft);
}

export function setQuantity(productId, quantity) {
  const draft = load();
  const item = draft.items.find((i) => i.id === productId);
  if (!item) return draft;
  const qty = Math.max(1, Math.min(MAX_QTY, Number(quantity) || 1));
  item.quantity = qty;
  return persist(draft);
}

export function clearDraft() {
  return persist({ items: [] });
}

export const TABLA_DRAFT_STORAGE_KEY = STORAGE_KEY;
