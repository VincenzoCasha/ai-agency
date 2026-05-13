import React from 'react';
import { MapPin, MessageCircle, Instagram } from 'lucide-react';
import { Button } from '../ui/Button';
import { getContactLinks } from '../../lib/contactLinks';
import { trackWhatsAppClick, trackMapsClick } from '../../lib/analytics';

export function ContactCtas({ siteConfig, source = 'contact_page' }) {
  const links = getContactLinks(siteConfig);
  return (
    <div className="flex flex-wrap gap-3">
      {links.whatsapp ? (
        <Button
          as="a"
          href={links.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick({ source })}
          variant="primary"
        >
          <MessageCircle size={16} aria-hidden="true" />
          WhatsApp
        </Button>
      ) : null}
      {links.maps ? (
        <Button
          as="a"
          href={links.maps}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackMapsClick({ source })}
          variant="secondary"
        >
          <MapPin size={16} aria-hidden="true" />
          Cómo llegar
        </Button>
      ) : null}
      {links.instagram ? (
        <Button
          as="a"
          href={links.instagram}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
        >
          <Instagram size={16} aria-hidden="true" />
          Instagram
        </Button>
      ) : null}
    </div>
  );
}
