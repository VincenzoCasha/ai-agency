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
} from '../../lib/formValidation';
import { submitInquiry } from '../../lib/inquiriesApi';
import { trackGenerateLead } from '../../lib/analytics';

const INITIAL = { name: '', email: '', phone: '', message: '' };

export function ContactForm() {
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
    const n = validateName(fields.name); if (n) next.name = n;
    const em = validateEmail(fields.email); if (em) next.email = em;
    const ph = validatePhone(fields.phone, { required: false }); if (ph) next.phone = ph;
    const ms = validateMessage(fields.message, { min: 5, max: 2000 }); if (ms) next.message = ms;
    const clean = Object.fromEntries(Object.entries(next).filter(([, v]) => v));
    if (Object.keys(clean).length > 0) {
      setErrors(clean);
      return;
    }
    setErrors({});

    setLoading(true);
    const result = await submitInquiry({
      type: 'CONTACT',
      name: fields.name.trim(),
      email: fields.email.trim(),
      phone: fields.phone.trim() || undefined,
      message: fields.message.trim(),
    });
    setLoading(false);

    if (result.ok) {
      trackGenerateLead({ form: 'contact' });
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
        title="¡Gracias por escribirnos!"
        message="Te respondemos en cuanto leamos tu mensaje. Si es urgente, escríbenos por WhatsApp."
      />
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Nombre" name="name" autoComplete="name" value={fields.name}
          onChange={(e) => setField('name', e.target.value)} error={errors.name} required />
        <Input label="Email" type="email" name="email" autoComplete="email" value={fields.email}
          onChange={(e) => setField('email', e.target.value)} error={errors.email} required />
        <Input label="Teléfono (opcional)" type="tel" name="phone" autoComplete="tel" value={fields.phone}
          onChange={(e) => setField('phone', e.target.value)} error={errors.phone} />
      </div>
      <Textarea label="Mensaje" name="message" rows={4} value={fields.message}
        onChange={(e) => setField('message', e.target.value)} error={errors.message} required />
      <FormError message={generalError} />
      <Button type="submit" size="lg" loading={loading} disabled={loading}>
        {loading ? 'Enviando…' : 'Enviar consulta'}
      </Button>
    </form>
  );
}
