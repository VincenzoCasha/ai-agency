import { describe, it, expect, beforeEach } from 'vitest';
import {
  addItem,
  removeItem,
  clearDraft,
  getDraft,
  getItemCount,
  getTotalCents,
  setQuantity,
  AlcoholInTablaError,
  TABLA_DRAFT_STORAGE_KEY,
} from '../lib/tablaDraft';

const CHEESE = {
  id: 1,
  slug: 'manchego-curado',
  name: 'Manchego curado',
  price_cents: 1450,
  is_alcohol: false,
  images: [{ url: '/img/cheese.jpg', alt_text: 'Manchego' }],
};

const WINE = {
  id: 2,
  slug: 'rioja-reserva',
  name: 'Rioja Reserva',
  price_cents: 2400,
  is_alcohol: true,
};

describe('tablaDraft', () => {
  beforeEach(() => {
    window.localStorage.removeItem(TABLA_DRAFT_STORAGE_KEY);
    clearDraft();
  });

  it('starts empty', () => {
    expect(getItemCount()).toBe(0);
    expect(getDraft().items).toEqual([]);
    expect(getTotalCents()).toBe(0);
  });

  it('adds a non-alcohol product', () => {
    addItem(CHEESE, 2);
    const draft = getDraft();
    expect(draft.items).toHaveLength(1);
    expect(draft.items[0]).toMatchObject({
      id: CHEESE.id,
      name: CHEESE.name,
      quantity: 2,
      is_alcohol: false,
    });
    expect(getItemCount()).toBe(2);
    expect(getTotalCents()).toBe(2900);
  });

  it('rejects an alcohol product with AlcoholInTablaError', () => {
    expect(() => addItem(WINE, 1)).toThrow(AlcoholInTablaError);
    expect(getDraft().items).toHaveLength(0);
  });

  it('accumulates quantity when adding the same product twice', () => {
    addItem(CHEESE, 1);
    addItem(CHEESE, 3);
    const items = getDraft().items;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(4);
  });

  it('caps quantity at 99', () => {
    addItem(CHEESE, 50);
    addItem(CHEESE, 200);
    expect(getDraft().items[0].quantity).toBe(99);
  });

  it('removes items by id', () => {
    addItem(CHEESE, 1);
    removeItem(CHEESE.id);
    expect(getDraft().items).toHaveLength(0);
  });

  it('updates quantity via setQuantity', () => {
    addItem(CHEESE, 1);
    setQuantity(CHEESE.id, 5);
    expect(getDraft().items[0].quantity).toBe(5);
  });

  it('persists to localStorage', () => {
    addItem(CHEESE, 2);
    const raw = window.localStorage.getItem(TABLA_DRAFT_STORAGE_KEY);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw);
    expect(parsed.items[0].id).toBe(CHEESE.id);
  });
});
