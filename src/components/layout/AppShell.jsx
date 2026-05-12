import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { StickyCTA } from './StickyCTA';
import { CookieBanner } from './CookieBanner';
import { useSiteConfig } from '../../hooks/useSiteConfig';

export function AppShell({ children }) {
  const { config } = useSiteConfig();
  return (
    <div className="min-h-screen flex flex-col">
      <Header siteConfig={config} />
      <main id="main" className="flex-1 pb-24 md:pb-0">
        {children}
      </main>
      <Footer siteConfig={config} />
      <StickyCTA />
      <CookieBanner />
    </div>
  );
}
