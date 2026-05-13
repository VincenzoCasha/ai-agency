import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { FormSuccess } from './FormSuccess';
import { FormError } from './FormError';
import {
  validateName,
  validateEmail,
  validatePhone,
  validateMessage,
  validateBusinessName,
} from '../../lib/formValidation';
import { submitInquiry } from '../../lib/inquiriesApi';
import { trackGenerateLead } from '../../lib/analytics';

const INITIAL = {
  business_name: '',
  contact_name: '',
  email: '',
  phone: '',
  message: '',
};

export function WholesaleForm() {
  const [fields, setFields] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function setField(name, value) {
    setFields((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
    if (generalError) setGeneralError(null);
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (loading) return;
    const next = {};
    const bn = validateBusinessName(fields.business_name); if (bn) next.business_name = bn;
    const n = validateName(fields.contact_name); if (n) next.contact_name = n;
    const em = validateEmail(fields.email); if (em) next.email = em;
    const ph = validatePhone(fields.phone, { required: true }); if (ph) next.phone = ph;
    const ms = validateMessage(fields.message, { min: 10, max: 2000 }); if (ms) next.message = ms;
    const clean = Object.fromEntries(Object.entries(next).filter(([, v]) => v));
    if (Object.keys(clean).length > 0) { setErrors(clean); return; }
    setErrors({});

    setLoading(true);
    const result = await submitInquiry({
      type: 'WHOLESALE',
      name: fields.contact_name.trim(),
      email: fields.email.trim(),
      phone: fields.phone.trim(),
      message: fields.message.trim(),
      payload: {
        business_name: fields.business_name.trim(),
      },
    });
    setLoading(false);

    if (result.ok) {
      trackGenerateLead({ form: 'wholesale' });
      setSubmitted(true);
      setFields(INITIAL);
      return;
    }
    if (result.status === 422 && Array.isArray(result.error?.errors)) {
      const next = {};
      for (const e of result.error.errors) {
        if (e?.field && e?.message) next[e.field] = e.message;
      }
      setErrors(next);
      setGeneralError('Revisa los campos marcados.');
      return;
    }
    if (result.status === 429) {
      setGeneralError('Demasiadas consultas seguidas. Espera un momento y vuelve a intentarlo.');
      return;
    }
    if (result.status === 0) {
      setGeneralError('No hay conexión. Revisa tu red y vuelve a intentarlo.');
      return;
    }
    setGeneralError(result.error?.detail || 'No pudimos enviar la consulta. Inténtalo de nuevo.');
  }

  if (submitted) {
    return (
      <FormSuccess
        title="¡Gracias!"
        message="Estudiamos disponibilidad y condiciones y te respondemos lo antes posible."
      />
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      <Input label="Nombre del negocio" name="business_name" value={fields.business_name}
        onChange={(e) => setField('business_name', e.target.value)} error={errors.business_name} required />
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Persona de contacto" name="contact_name" autoComplete="name" value={fields.contact_name}
          onChange={(e) => setField('contact_name', e.target.value)} error={errors.contact_name} required />
        <Input label="Email" type="email" name="email" autoComplete="email" value={fields.email}
          onChange={(e) => setField('email', e.target.value)} error={errors.email} required />
        <Input label="Teléfono" type="tel" name="phone" autoComplete="tel" value={fields.phone}
          onChange={(e) => setField('phone', e.target.value)} error={errors.phone} required />
      </div>
      <Textarea label="Cuéntanos sobre tu negocio y qué necesitas" name="message" rows={5}
        value={fields.message} onChange={(e) => setField('message', e.target.value)} error={errors.message}
        hint="Volumen estimado, frecuencia, quesos que te interesan, ciudad…" required />
      <FormError message={generalError} />
      <Button type="submit" size="lg" loading={loading} disabled={loading}>
        {loading ? 'Enviando…' : 'Enviar consulta mayorista'}
      </Button>
    </form>
  );
}
