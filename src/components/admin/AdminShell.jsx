import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, CalendarDays, ShoppingBag, LogOut } from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { cn } from '../../lib/cn';

const NAV = [
  { to: '/admin/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { to: '/admin/productos', label: 'Catálogo', icon: Package },
  { to: '/admin/eventos', label: 'Eventos', icon: CalendarDays },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
];

/**
 * Layout del panel admin, mobile-first. Cabecera fija + bottom-nav táctil
 * con targets ≥44px. Contenido scrolleable en medio.
 */
export function AdminShell({ children }) {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/admin');
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <header className="sticky top-0 z-20 border-b border-border bg-bg-primary/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-display text-lg text-text-primary">CRUDO · Admin</span>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary min-h-[44px] px-2"
          >
            <LogOut size={16} aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Salir</span>
          </button>
        </div>
        {user?.email ? (
          <p className="px-4 pb-2 -mt-1 text-xs text-text-muted truncate">{user.email}</p>
        ) : null}
      </header>

      <main className="flex-1 px-4 py-5 pb-24 max-w-3xl w-full mx-auto">{children}</main>

      <nav
        aria-label="Navegación admin"
        className="fixed bottom-0 inset-x-0 z-20 border-t border-border bg-bg-primary/95 backdrop-blur-md"
      >
        <ul className="flex max-w-3xl mx-auto">
          {NAV.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center gap-1 py-2 min-h-[56px] text-xs',
                    isActive ? 'text-accent' : 'text-text-muted hover:text-text-primary',
                  )
                }
              >
                <Icon size={20} aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
