import React from 'react';
import { Route, Routes } from 'react-router-dom';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import SeasonalPage from './pages/SeasonalPage';
import TablasPage from './pages/TablasPage';
import ProductPage from './pages/ProductPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import WholesalePage from './pages/WholesalePage';
import CelebrateWithUsPage from './pages/CelebrateWithUsPage';
import MyTablaPage from './pages/MyTablaPage';
import MyTablaConfirmationPage from './pages/MyTablaConfirmationPage';
import LegalPage from './pages/LegalPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiesPage from './pages/CookiesPage';
import AdminEntryPage from './pages/AdminEntryPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Rutas V1 alineadas con docs/V1/V1Tecnico.md §0.2 (override autoritativo):
 *  - SIN /catalogo/vinos publico (los vinos solo viajan via WhatsApp).
 *  - Quesos de temporada y Tablas son los dos sub-listados publicos del catalogo.
 *  - /celebra-con-nosotros es la pagina nueva obligatoria.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalogo" element={<CatalogPage />} />
      <Route path="/catalogo/temporada" element={<SeasonalPage />} />
      <Route path="/tablas" element={<TablasPage />} />
      <Route path="/producto/:slug" element={<ProductPage />} />
      <Route path="/eventos" element={<EventsPage />} />
      <Route path="/eventos/:slug" element={<EventDetailPage />} />
      <Route path="/sobre-crudo" element={<AboutPage />} />
      <Route path="/contacto" element={<ContactPage />} />
      <Route path="/mayoristas" element={<WholesalePage />} />
      <Route path="/celebra-con-nosotros" element={<CelebrateWithUsPage />} />
      <Route path="/mi-tabla" element={<MyTablaPage />} />
      <Route path="/mi-tabla/confirmacion" element={<MyTablaConfirmationPage />} />
      <Route path="/aviso-legal" element={<LegalPage />} />
      <Route path="/privacidad" element={<PrivacyPage />} />
      <Route path="/cookies" element={<CookiesPage />} />
      <Route path="/admin" element={<AdminEntryPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
