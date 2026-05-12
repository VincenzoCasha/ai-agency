import { describe, it, expect } from 'vitest';
import {
  validatePickupForm,
  validatePickupDate,
  validatePickupSlot,
  getSlotsForDate,
} from '../lib/pickupValidation';

describe('pickupValidation', () => {
  it('flags missing required fields', () => {
    const { valid, errors } = validatePickupForm({});
    expect(valid).toBe(false);
    expect(errors.name).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(errors.phone).toBeTruthy();
    expect(errors.pickup_date).toBeTruthy();
    expect(errors.pickup_slot).toBeTruthy();
  });

  it('flags invalid email format', () => {
    const { errors } = validatePickupForm({
      name: 'Ana',
      email: 'no-es-email',
      phone: '+34600111222',
      pickup_date: '2030-01-01',
      pickup_slot: '12:30',
    });
    expect(errors.email).toMatch(/válido/i);
  });

  it('rejects past dates and dates beyond 14 days', () => {
    const past = validatePickupDate('2020-01-01', new Date('2026-05-12T10:00:00'));
    expect(past).toMatch(/retroceder/);
    const tooFar = validatePickupDate('2026-06-30', new Date('2026-05-12T10:00:00'));
    expect(tooFar).toMatch(/14 días/);
    const ok = validatePickupDate('2026-05-15', new Date('2026-05-12T10:00:00'));
    expect(ok).toBeNull();
  });

  it('accepts slot HH:mm in 30-min blocks only', () => {
    expect(validatePickupSlot('17:30')).toBeNull();
    expect(validatePickupSlot('17:00')).toBeNull();
    expect(validatePickupSlot('17:15')).toMatch(/no válida/);
    expect(validatePickupSlot('25:00')).toMatch(/no válida/);
    expect(validatePickupSlot('')).toMatch(/Elige/);
  });

  it('generates 30-min slots from a horario range', () => {
    const slots = getSlotsForDate('2026-05-12', { tue: '17:30-19:30' });
    expect(slots).toEqual(['17:30', '18:00', '18:30', '19:00']);
  });

  it('returns empty slots for a day without horario', () => {
    expect(getSlotsForDate('2026-05-12', {})).toEqual([]);
  });
});
