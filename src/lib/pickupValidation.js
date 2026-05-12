/**
 * Validacion cliente del PickupForm. La fuente autoritativa es el backend
 * (Fase 4): aqui solo evitamos round-trips obvios y guiamos al usuario.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLOT_RE = /^([01]\d|2[0-3]):(00|30)$/;
const PHONE_RE = /^[+\d\s().-]{6,}$/;

export function validateName(name) {
  const v = (name || '').trim();
  if (v.length === 0) return 'Indícanos tu nombre.';
  if (v.length > 120) return 'El nombre es demasiado largo.';
  return null;
}

export function validateEmail(email) {
  const v = (email || '').trim();
  if (v.length === 0) return 'Necesitamos un correo de contacto.';
  if (!EMAIL_RE.test(v)) return 'Ese correo no parece válido.';
  if (v.length > 254) return 'El correo es demasiado largo.';
  return null;
}

export function validatePhone(phone) {
  const v = (phone || '').trim();
  if (v.length === 0) return 'Necesitamos un teléfono para confirmarte por WhatsApp.';
  if (!PHONE_RE.test(v)) return 'Ese teléfono no parece válido.';
  return null;
}

export function validatePickupDate(dateStr, today = new Date()) {
  if (!dateStr) return 'Elige un día para recoger.';
  // ISO YYYY-MM-DD esperado del <input type="date">
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return 'Fecha no válida.';
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return 'Fecha no válida.';
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (date < startOfToday) return 'No podemos retroceder en el tiempo.';
  // Maximo 14 dias (alineado con backend Fase 4).
  const maxDate = new Date(startOfToday.getTime() + 14 * 24 * 60 * 60 * 1000);
  if (date > maxDate) return 'Como mucho 14 días vista.';
  return null;
}

export function validatePickupSlot(slot) {
  if (!slot) return 'Elige una hora de recogida.';
  if (!SLOT_RE.test(slot)) return 'Hora no válida. Usa HH:mm en bloques de 30 minutos.';
  return null;
}

export function validateNotes(notes) {
  const v = (notes || '').trim();
  if (v.length > 1000) return 'Las notas no pueden superar 1000 caracteres.';
  return null;
}

export function validatePickupForm(fields, options = {}) {
  const errors = {};
  const nameErr = validateName(fields.name);
  if (nameErr) errors.name = nameErr;
  const emailErr = validateEmail(fields.email);
  if (emailErr) errors.email = emailErr;
  const phoneErr = validatePhone(fields.phone);
  if (phoneErr) errors.phone = phoneErr;
  const dateErr = validatePickupDate(fields.pickup_date, options.today);
  if (dateErr) errors.pickup_date = dateErr;
  const slotErr = validatePickupSlot(fields.pickup_slot);
  if (slotErr) errors.pickup_slot = slotErr;
  const notesErr = validateNotes(fields.notes);
  if (notesErr) errors.notes = notesErr;
  return { valid: Object.keys(errors).length === 0, errors };
}

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

/**
 * Genera slots HH:mm cada 30 min entre los rangos `HH:mm-HH:mm` del horario
 * del DOW (Day Of Week). El horario puede tener varios rangos separados por `,`.
 * Si no hay horario, devuelve `[]`.
 */
export function getSlotsForDate(dateStr, hours) {
  if (!dateStr || !hours) return [];
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return [];
  const dowKey = DAY_KEYS[date.getDay()];
  const ranges = hours[dowKey];
  if (typeof ranges !== 'string' || ranges.length === 0) return [];
  const slots = [];
  for (const piece of ranges.split(',').map((s) => s.trim()).filter(Boolean)) {
    const [from, to] = piece.split('-').map((s) => s.trim());
    if (!from || !to) continue;
    const [fh, fm] = from.split(':').map((n) => parseInt(n, 10));
    const [th, tm] = to.split(':').map((n) => parseInt(n, 10));
    if ([fh, fm, th, tm].some((n) => Number.isNaN(n))) continue;
    let cur = fh * 60 + (fm || 0);
    const end = th * 60 + (tm || 0);
    cur = Math.ceil(cur / 30) * 30;
    while (cur < end) {
      const hh = String(Math.floor(cur / 60)).padStart(2, '0');
      const mm = String(cur % 60).padStart(2, '0');
      slots.push(`${hh}:${mm}`);
      cur += 30;
    }
  }
  return slots;
}
