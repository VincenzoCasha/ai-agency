import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, MapPin, MessageCircle, ShoppingBag, ExternalLink } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { trackMapsClick, trackWhatsAppClick } from '../../lib/analytics';
import { useTablaDraft } from '../../hooks/useTablaDraft';
import { cn } from '../../lib/cn';

const NAV_LINKS = [
  { to: '/eventos', label: 'Eventos' },
  { to: '/seleccion', label: 'Selección del mes' },
  { to: '/contacto', label: 'Contacto' },
];

// URL de la tienda de merch — actualizar con la URL real cuando esté lista
const MERCH_URL = 'https://www.instagram.com/crudomov';

function navClasses({ isActive }) {
  return cn(
    'inline-flex items-center px-3 min-h-[44px] rounded-md text-sm font-medium',
    'text-text-secondary hover:text-text-primary hover:bg-bg-elevated',
    isActive && 'text-text-primary bg-bg-elevated',
  );
}

export function Header({ siteConfig, onOpenTabla }) {
  const [open, setOpen] = useState(false);
  const { count } = useTablaDraft();
  const whatsapp = siteConfig?.contact?.whatsapp_public;
  const maps = siteConfig?.contact?.google_maps_url;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg-primary">
      <div className="container-page flex items-center justify-between gap-4 py-3">
        <Link to="/" className="flex items-center gap-3 text-text-primary" aria-label="CRUDO — inicio">
          <img
            src="/img/brand/crudo-logo.png"
            alt="CRUDO"
            width={132}
            height={44}
            className="h-11 w-auto"
          />
        </Link>
        <nav aria-label="Principal" className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navClasses}>
              {link.label}
            </NavLink>
          ))}
          {/* Merch — enlace externo con indicador ↗ */}
          <a
            href={MERCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-1 px-3 min-h-[44px] rounded-md text-sm font-medium',
              'text-text-secondary hover:text-text-primary hover:bg-bg-elevated',
            )}
          >
            Merch
            <ExternalLink size={11} aria-hidden="true" className="opacity-60" />
          </a>
        </nav>
        <div className="flex items-center gap-2">
          {maps ? (
            <a
              href={maps}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackMapsClick({ source: 'header' })}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 min-h-[44px] rounded-md text-sm text-text-secondary hover:text-text-primary"
            >
              <MapPin size={16} aria-hidden="true" /> Madrid
            </a>
          ) : null}
          {whatsapp ? (
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick({ source: 'header' })}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 min-h-[44px] rounded-md text-sm text-text-secondary hover:text-text-primary"
            >
              <MessageCircle size={16} aria-hidden="true" /> WhatsApp
            </a>
          ) : null}
          {onOpenTabla ? (
            <button
              type="button"
              onClick={onOpenTabla}
              aria-label={
                count > 0
                  ? `Abrir Mi Tabla, ${count} ${count === 1 ? 'producto' : 'productos'}`
                  : 'Abrir Mi Tabla'
              }
              className="hidden md:inline-flex items-center gap-1.5 px-3 min-h-[44px] rounded-md text-sm font-semibold text-text-primary border border-border-strong hover:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <ShoppingBag size={16} aria-hidden="true" />
              Mi Tabla
              {count > 0 ? (
                <span className="font-mono text-xs px-1.5 py-0.5 rounded-pill bg-accent text-text-inverse">
                  {count}
                </span>
              ) : null}
            </button>
          ) : null}
          <IconButton
            aria-label={open ? 'Cerrar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden"
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </IconButton>
        </div>
      </div>
      {open ? (
        <nav
          aria-label="Mobile"
          className="md:hidden border-t border-border bg-bg-primary"
        >
          <ul className="container-page flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={navClasses}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <a
                href={MERCH_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className={cn(
                  'inline-flex items-center gap-1 px-3 min-h-[44px] rounded-md text-sm font-medium w-full',
                  'text-text-secondary hover:text-text-primary hover:bg-bg-elevated',
                )}
              >
                Merch
                <ExternalLink size={11} aria-hidden="true" className="opacity-60" />
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
