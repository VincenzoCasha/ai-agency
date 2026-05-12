import React, { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { StickyCTA } from './StickyCTA';
import { CookieBanner } from './CookieBanner';
import { TablaDrawer } from '../tabla/TablaDrawer';
import { useSiteConfig } from '../../hooks/useSiteConfig';

export function AppShell({ children }) {
  const { config } = useSiteConfig();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header siteConfig={config} onOpenTabla={openDrawer} />
      <main id="main" className="flex-1 pb-24 md:pb-0">
        {children}
      </main>
      <Footer siteConfig={config} />
      <StickyCTA onOpenTabla={openDrawer} />
      <TablaDrawer open={drawerOpen} onClose={closeDrawer} />
      <CookieBanner />
    </div>
  );
}
