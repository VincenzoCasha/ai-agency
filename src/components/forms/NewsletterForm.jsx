import React, { useId, useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { FormSuccess } from './FormSuccess';
import { FormError } from './FormError';
import { validateEmail, validateConsent } from '../../lib/formValidation';
import { subscribeNewsletter } from '../../lib/newsletterApi';
import { trackGenerateLead } from '../../lib/analytics';

export function NewsletterForm({ source = 'footer', requireConsent = true, compact = false }) {
  const reactId = useId();
  const consentId = `nl-consent-${reactId}`;
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (loading) return;
    const next = {};
    const em = validateEmail(email); if (em) next.email = em;
    if (requireConsent) {
      const c = validateConsent(consent); if (c) next.consent = c;
    }
    if (Object.keys(next).length > 0) { setErrors(next); return; }
    setErrors({});
    setGeneralError(null);

    setLoading(true);
    const result = await subscribeNewsletter({ email: email.trim(), source });
    setLoading(false);

    if (result.ok) {
      trackGenerateLead({ form: 'newsletter', source });
      setSubmitted(true);
      setEmail('');
      setConsent(false);
      return;
    }
    if (result.status === 0) {
      setGeneralError('No hay conexión. Inténtalo de nuevo en un momento.');
      return;
    }
    if (result.status === 429) {
      setGeneralError('Demasiados intentos. Espera un momento.');
      return;
    }
    setGeneralError(result.error?.detail || 'No pudimos completar la suscripción. Inténtalo de nuevo.');
  }

  if (submitted) {
    return (
      <FormSuccess
        title="¡Casi listo!"
        message="Revisa tu correo para confirmar la suscripción."
        withSticker
      />
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className={compact ? 'space-y-2' : 'space-y-3'}>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          name="email"
          aria-label="Correo electrónico"
          placeholder="tu@correo.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          className="flex-1"
          required
        />
        <Button type="submit" loading={loading} disabled={loading}>
          {loading ? 'Enviando…' : 'Suscribirme'}
        </Button>
      </div>
      {requireConsent ? (
        <div className="flex items-start gap-2">
          <input
            id={consentId}
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-invalid={errors.consent ? 'true' : undefined}
            className="mt-1"
          />
          <label htmlFor={consentId} className="text-xs text-text-secondary">
            Acepto recibir noticias de CRUDO. Puedo darme de baja en cualquier momento.
          </label>
        </div>
      ) : null}
      {errors.consent ? (
        <p className="text-xs text-error" role="alert">{errors.consent}</p>
      ) : null}
      <FormError message={generalError} />
    </form>
  );
}
