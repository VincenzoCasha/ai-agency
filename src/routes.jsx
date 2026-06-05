import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { RouteLoading } from './components/layout/RouteLoading';

// HomePage se carga eager: es el landing y queremos que aparezca al instante.
import HomePage from './pages/HomePage';

// Resto de rutas: lazy loading. Vite genera un chunk por import dinámico,
// agrupando por proximidad. Cada página entra bajo demanda al navegar.
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const CatalogQuesoPage = lazy(() => import('./pages/CatalogQuesoPage'));
const CatalogVinosPage = lazy(() => import('./pages/CatalogVinosPage'));
const SeasonalPage = lazy(() => import('./pages/SeasonalPage'));
const TablasPage = lazy(() => import('./pages/TablasPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const WholesalePage = lazy(() => import('./pages/WholesalePage'));
const CelebrateWithUsPage = lazy(() => import('./pages/CelebrateWithUsPage'));
const MyTablaPage = lazy(() => import('./pages/MyTablaPage'));
const MyTablaConfirmationPage = lazy(() => import('./pages/MyTablaConfirmationPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const CookiesPage = lazy(() => import('./pages/CookiesPage'));
const AdminEntryPage = lazy(() => import('./pages/AdminEntryPage'));
const MerchPage = lazy(() => import('./pages/MerchPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

/**
 * Rutas V1/V2. Los vinos se muestran en catálogo (Fase 8) pero el CTA siempre es
 * WhatsApp — no "Añadir a Mi Tabla". El alcohol guard del backend (Fase 4)
 * sigue siendo la red de seguridad final.
 *
 * Code splitting (V2 Fase 3): todas las rutas salvo Home cargan en chunks
 * bajo demanda mediante React.lazy + Suspense.
 */
export function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* /seleccion es la ruta principal; /catalogo se mantiene como alias */}
        <Route path="/seleccion" element={<CatalogPage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/catalogo/quesos" element={<CatalogQuesoPage />} />
        <Route path="/catalogo/vinos" element={<CatalogVinosPage />} />
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
        <Route path="/merch" element={<MerchPage />} />
        <Route path="/admin" element={<AdminEntryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
