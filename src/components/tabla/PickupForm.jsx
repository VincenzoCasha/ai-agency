import React, { useMemo, useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { FieldError } from '../ui/FieldError';
import {
  validatePickupForm,
  getSlotsForDate,
} from '../../lib/pickupValidation';
import { submitPickupOrder } from '../../lib/pickupApi';
import { generateIdempotencyKey } from '../../lib/idempotency';
import { trackPickupRequest } from '../../lib/analytics';

const PAYMENT_NOTICE =
  'Reserva tu cesta. El pago se realiza en CRUDO al recoger. Te confirmaremos por WhatsApp en menos de 24 horas.';

function todayIso() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function maxDateIso() {
  const d = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

const INITIAL_FIELDS = {
  name: '',
  email: '',
  phone: '',
  pickup_date: '',
  pickup_slot: '',
  notes: '',
};

/**
 * Formulario de pickup. Props:
 *  - items: array de line items con `id`, `slug`, `quantity` (price snapshot ignorado).
 *  - totalCents: total estimado (analytics, no se envía como autoridad).
 *  - hours: site_config.hours (object con mon/tue/... -> "HH:mm-HH:mm").
 *  - onSuccess(confirmation): callback tras 201.
 *  - getPayloadItems: fn que retorna items sanitizados para enviar al backend.
 */
export function PickupForm({ items = [], totalCents = 0, hours, onSuccess, getPayloadItems }) {
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState(() => generateIdempotencyKey());
  const [lastSubmittedSignature, setLastSubmittedSignature] = useState(null);

  const slots = useMemo(
    () => getSlotsForDate(fields.pickup_date, hours),
    [fields.pickup_date, hours],
  );

  // Si los items cambian (usuario quita/añade), invalidamos la idempotency key
  // ya que el payload cambia.
  useEffect(() => {
    const sig = JSON.stringify((getPayloadItems ? getPayloadItems() : []));
    if (lastSubmittedSignature && sig !== lastSubmittedSignature) {
      setIdempotencyKey(generateIdempotencyKey());
      setLastSubmittedSignature(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, items.map((i) => `${i.id}:${i.quantity}`).join('|')]);

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

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (loading) return;
    setGeneralError(null);

    if (items.length === 0) {
      setGeneralError('Tu cesta está vacía. Añade algún queso antes de reservar.');
      return;
    }
    if (items.some((i) => i.is_alcohol === true)) {
      setGeneralError('No se puede reservar alcohol online. Quita los vinos y vuelve a intentarlo.');
      return;
    }

    const { valid, errors: fieldErrors } = validatePickupForm(fields);
    if (!valid) {
      setErrors(fieldErrors);
      return;
    }

    const payload = {
      name: fields.name.trim(),
      email: fields.email.trim(),
      phone: fields.phone.trim(),
      pickup_date: fields.pickup_date,
      pickup_slot: fields.pickup_slot,
      notes: fields.notes.trim() || undefined,
      items: getPayloadItems ? getPayloadItems() : [],
    };

    const signature = JSON.stringify(payload.items);
    setLoading(true);
    const result = await submitPickupOrder(payload, { idempotencyKey });
    setLoading(false);

    if (result.ok) {
      setLastSubmittedSignature(signature);
      trackPickupRequest({
        item_count: items.reduce((s, i) => s + (i.quantity || 0), 0),
        total_cents: totalCents,
        contents: items.map((i) => ({ id: i.id, slug: i.slug, qty: i.quantity })),
      });
      onSuccess?.({ confirmation: result.data, request: payload });
      return;
    }

    // Manejo de errores
    const err = result.error;
    if (result.status === 422) {
      if (err?.code === 'ALCOHOL_NOT_ALLOWED_IN_PICKUP' || /alcohol/i.test(err?.detail || '')) {
        setGeneralError(
          'No se puede reservar alcohol online. Quita los vinos de tu cesta y vuelve a intentarlo.',
        );
      } else if (Array.isArray(err?.errors) && err.errors.length > 0) {
        const nextErrors = {};
        for (const e of err.errors) {
          if (e?.field && e?.message) nextErrors[e.field] = e.message;
        }
        setErrors(nextErrors);
        setGeneralError('Revisa los campos marcados.');
      } else {
        setGeneralError(err?.detail || 'No pudimos procesar la reserva. Revisa los datos.');
      }
      return;
    }
    if (result.status === 409) {
      setGeneralError(
        'Detectamos un envío duplicado. Pulsa "Reservar" de nuevo para reintentar con una nueva referencia.',
      );
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
    setGeneralError(err?.detail || 'Algo no fue bien. Vuelve a intentarlo en unos segundos.');
  }

  const slotOptions = useMemo(() => {
    if (!fields.pickup_date) return [];
    return slots.map((s) => ({ value: s, label: s }));
  }, [fields.pickup_date, slots]);

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5" aria-describedby="pickup-payment-notice">
      <p id="pickup-payment-notice" className="text-sm text-text-secondary">
        {PAYMENT_NOTICE}
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
          hint="Te confirmamos por WhatsApp en este número."
          required
        />
        <Input
          label="Día de recogida"
          type="date"
          name="pickup_date"
          value={fields.pickup_date}
          min={todayIso()}
          max={maxDateIso()}
          onChange={(e) => setField('pickup_date', e.target.value)}
          error={errors.pickup_date}
          required
        />
        <Select
          label="Hora"
          name="pickup_slot"
          value={fields.pickup_slot}
          onChange={(e) => setField('pickup_slot', e.target.value)}
          options={slotOptions}
          placeholder={
            fields.pickup_date
              ? slotOptions.length === 0
                ? 'Sin horario disponible ese día'
                : 'Elige una hora'
              : 'Elige primero el día'
          }
          disabled={!fields.pickup_date || slotOptions.length === 0}
          error={errors.pickup_slot}
          required
        />
      </div>

      <Textarea
        label="Notas para CRUDO (opcional)"
        name="notes"
        rows={3}
        value={fields.notes}
        onChange={(e) => setField('notes', e.target.value)}
        error={errors.notes}
        hint="¿Cumpleaños, alergias, gusto picante? Escríbenoslo aquí."
      />

      {generalError ? (
        <div role="alert" className="rounded-md border border-error/40 bg-error/10 p-3">
          <FieldError message={generalError} />
        </div>
      ) : null}

      <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-3">
        <p className="text-xs text-text-muted">
          Al enviar aceptas que CRUDO te contacte por email o WhatsApp para confirmar tu reserva.
        </p>
        <Button type="submit" size="lg" loading={loading} disabled={loading}>
          {loading ? 'Enviando…' : 'Reservar para recoger'}
        </Button>
      </div>
    </form>
  );
}
