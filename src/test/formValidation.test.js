import { describe, it, expect } from 'vitest';
import {
  validateName,
  validateEmail,
  validatePhone,
  validateMessage,
  validatePartySize,
  validateBusinessName,
  validateConsent,
} from '../lib/formValidation';

describe('formValidation', () => {
  it('validateName flags empty', () => {
    expect(validateName('')).toMatch(/nombre/i);
    expect(validateName('Ana')).toBeNull();
  });

  it('validateEmail flags malformed', () => {
    expect(validateEmail('')).toMatch(/correo/i);
    expect(validateEmail('foo')).toMatch(/válido/i);
    expect(validateEmail('a@b.co')).toBeNull();
  });

  it('validatePhone optional vs required', () => {
    expect(validatePhone('', { required: false })).toBeNull();
    expect(validatePhone('', { required: true })).toMatch(/teléfono/i);
    expect(validatePhone('abc', { required: true })).toMatch(/válido/i);
    expect(validatePhone('+34600111222')).toBeNull();
  });

  it('validateMessage min/max', () => {
    expect(validateMessage('', { min: 5 })).toMatch(/mensaje/i);
    expect(validateMessage('hola que tal', { min: 5 })).toBeNull();
    expect(validateMessage('a'.repeat(2001), { max: 2000 })).toMatch(/2000/);
  });

  it('validatePartySize 1-4 integer', () => {
    expect(validatePartySize('1')).toBeNull();
    expect(validatePartySize('4')).toBeNull();
    expect(validatePartySize('5')).toMatch(/WhatsApp/);
    expect(validatePartySize('0')).toMatch(/Mínimo/);
    expect(validatePartySize('1.5')).toMatch(/entero/);
  });

  it('validateBusinessName flags empty', () => {
    expect(validateBusinessName('')).toMatch(/negocio/i);
    expect(validateBusinessName('Bar Pepe')).toBeNull();
  });

  it('validateConsent requires true', () => {
    expect(validateConsent(false)).toMatch(/consentimiento/i);
    expect(validateConsent(true)).toBeNull();
  });
});
