import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useAdminAuth } from '../../hooks/useAdminAuth';

export default function AdminLoginPage() {
  const { isAuthenticated, login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Admin · CRUDO';
    if (isAuthenticated) navigate('/admin/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err?.detail || 'Email o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg-primary px-5">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-text-primary text-center mb-2">CRUDO · Admin</h1>
        <p className="text-sm text-text-secondary text-center mb-8">
          Accede para gestionar la tienda.
        </p>
        <form
          onSubmit={handleSubmit}
          className="bg-bg-secondary border border-border rounded-md p-6 space-y-4"
        >
          <label className="block">
            <span className="block text-xs uppercase tracking-eyebrow text-text-muted mb-1.5">
              Email
            </span>
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-bg-primary px-3 py-3 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            />
          </label>
          <label className="block">
            <span className="block text-xs uppercase tracking-eyebrow text-text-muted mb-1.5">
              Contraseña
            </span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border bg-bg-primary px-3 py-3 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            />
          </label>
          {error ? (
            <p role="alert" className="text-sm text-error">
              {error}
            </p>
          ) : null}
          <Button type="submit" size="lg" block loading={loading} disabled={loading}>
            Entrar
          </Button>
        </form>
      </div>
    </main>
  );
}
