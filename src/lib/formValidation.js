/**
 * Validadores compartidos para los formularios públicos (Contact, Wholesale,
 * Newsletter, Reservation). El backend (Fase 3) es la fuente autoritativa;
 * aquí solo evitamos round-trips obvios y guiamos al usuario.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d\s().-]{6,}$/;

export function validateName(v) {
  const value = (v || '').trim();
  if (value.length === 0) return 'Indícanos tu nombre.';
  if (value.length > 120) return 'El nombre es demasiado largo.';
  return null;
}

export function validateEmail(v) {
  const value = (v || '').trim();
  if (value.length === 0) return 'Necesitamos un correo de contacto.';
  if (!EMAIL_RE.test(value)) return 'Ese correo no parece válido.';
  if (value.length > 254) return 'El correo es demasiado largo.';
  return null;
}

export function validatePhone(v, { required = true } = {}) {
  const value = (v || '').trim();
  if (value.length === 0) return required ? 'Necesitamos un teléfono.' : null;
  if (!PHONE_RE.test(value)) return 'Ese teléfono no parece válido.';
  return null;
}

export function validateMessage(v, { min = 5, max = 2000, label = 'mensaje' } = {}) {
  const value = (v || '').trim();
  if (value.length === 0) return `Cuéntanos brevemente en el ${label}.`;
  if (value.length < min) return `El ${label} es demasiado corto.`;
  if (value.length > max) return `El ${label} no puede superar ${max} caracteres.`;
  return null;
}

export function validatePartySize(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 'Indica cuántas personas vais.';
  if (!Number.isInteger(n)) return 'Indica un número entero.';
  if (n < 1) return 'Mínimo 1 persona.';
  if (n > 4) return 'Para grupos de más de 4, contáctanos por WhatsApp.';
  return null;
}

export function validateBusinessName(v) {
  const value = (v || '').trim();
  if (value.length === 0) return 'Indícanos el nombre del negocio.';
  if (value.length > 160) return 'El nombre del negocio es demasiado largo.';
  return null;
}

export function validateConsent(v) {
  if (v === true) return null;
  return 'Necesitamos tu consentimiento para seguir.';
}
