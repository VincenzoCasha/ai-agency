import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { FieldError } from '../ui/FieldError';
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePartySize,
  validateMessage,
} from '../../lib/formValidation';
import { submitEventReservation } from '../../lib/eventsApi';
import { generateIdempotencyKey } from '../../lib/idempotency';
import { trackEventInquiry } from '../../lib/analytics';

const INITIAL = {
  name: '',
  email: '',
  phone: '',
  party_size: '2',
  notes: '',
};

export function ReservationForm({ eventSlug, eventTitle, onSuccess }) {
  const [fields, setFields] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState(() => generateIdempotencyKey());

  function setField(name, value) {
    setFields((f) => ({ ...f, [name]: value }));
    if (errors[name]) {
      setErrors((e) => {
        const next = { ...e };
        delete next[name];
        return next;
      });
    }
    if (generalError) setGeneralError(null);
  }

  function clientValidate() {
    const next = {};
    const n = validateName(fields.name); if (n) next.name = n;
    const em = validateEmail(fields.email); if (em) next.email = em;
    const ph = validatePhone(fields.phone, { required: true }); if (ph) next.phone = ph;
    const ps = validatePartySize(fields.party_size); if (ps) next.party_size = ps;
    const ms = validateMessage(fields.notes, { min: 0, max: 1000, label: 'mensaje' });
    if (fields.notes && ms) next.notes = ms;
    return next;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (loading) return;
    setGeneralError(null);

    const fieldErrors = clientValidate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    const payload = {
      name: fields.name.trim(),
      email: fields.email.trim(),
      phone: fields.phone.trim(),
      party_size: Number(fields.party_size),
      notes: fields.notes.trim() || undefined,
    };

    setLoading(true);
    const result = await submitEventReservation(eventSlug, payload, { idempotencyKey });
    setLoading(false);

    if (result.ok) {
      trackEventInquiry({
        event_slug: eventSlug,
        party_size: payload.party_size,
      });
      onSuccess?.({ confirmation: result.data, request: payload, event: { slug: eventSlug, title: eventTitle } });
      return;
    }

    const err = result.error;
    if (result.status === 422 && Array.isArray(err?.errors) && err.errors.length > 0) {
      const next = {};
      for (const e of err.errors) {
        if (e?.field && e?.message) next[e.field] = e.message;
      }
      setErrors(next);
      setGeneralError('Revisa los campos marcados.');
      return;
    }
    if (result.status === 422) {
      setGeneralError(err?.detail || 'No pudimos procesar la reserva.');
      return;
    }
    if (result.status === 409) {
      setGeneralError('Detectamos un envío duplicado. Vuelve a pulsar "Solicitar reserva" para reintentar.');
      setIdempotencyKey(generateIdempotencyKey());
      return;
    }
    if (result.status === 429) {
      setGeneralError('Demasiados intentos en poco tiempo. Espera un momento y vuelve a intentarlo.');
      return;
    }
    if (result.status === 0) {
      setGeneralError('No hay conexión con el servidor. Revisa tu red y vuelve a intentarlo.');
      return;
    }
    setGeneralError(err?.detail || 'Algo no fue bien. Vuelve a intentarlo.');
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      <p className="text-sm text-text-secondary">
        Esto es una solicitud de reserva. CRUDO te confirmará por email o WhatsApp.
        No se cobra nada online.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Nombre"
          name="name"
          autoComplete="name"
          value={fields.name}
          onChange={(e) => setField('name', e.target.value)}
          error={errors.name}
          required
        />
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          value={fields.email}
          onChange={(e) => setField('email', e.target.value)}
          error={errors.email}
          required
        />
        <Input
          label="Teléfono"
          type="tel"
          name="phone"
          autoComplete="tel"
          value={fields.phone}
          onChange={(e) => setField('phone', e.target.value)}
          error={errors.phone}
          required
        />
        <Input
          label="Plazas (máx. 4)"
          type="number"
          name="party_size"
          inputMode="numeric"
          min={1}
          max={4}
          step={1}
          value={fields.party_size}
          onChange={(e) => setField('party_size', e.target.value)}
          error={errors.party_size}
          hint="Para grupos mayores, contáctanos por WhatsApp."
          required
        />
      </div>
      <Textarea
        label="Notas (opcional)"
        name="notes"
        rows={3}
        value={fields.notes}
        onChange={(e) => setField('notes', e.target.value)}
        error={errors.notes}
        hint="¿Alergias o comentarios? Cuéntanoslo aquí."
      />

      {generalError ? (
        <div role="alert" className="rounded-md border border-error/40 bg-error/10 p-3">
          <FieldError message={generalError} />
        </div>
      ) : null}

      <Button type="submit" size="lg" loading={loading} disabled={loading}>
        {loading ? 'Enviando…' : 'Solicitar reserva'}
      </Button>
    </form>
  );
}
