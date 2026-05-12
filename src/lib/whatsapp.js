const DEFAULT_NUMBER = (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_WHATSAPP_NUMBER) || '';

export function buildWhatsAppUrl(phoneNumber, text) {
  const number = (phoneNumber || DEFAULT_NUMBER).replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(text);
  if (!number) return `https://wa.me/?text=${encoded}`;
  return `https://wa.me/${number}?text=${encoded}`;
}

export function buildProductInquiryUrl(productName, phoneNumber) {
  const text = `Hola, me interesa ${productName}. ¿Lo tenéis disponible en CRUDO?`;
  return buildWhatsAppUrl(phoneNumber, text);
}

export function buildTableInquiryUrl(phoneNumber) {
  const text = 'Hola, me gustaría consultar sobre una tabla con maridaje en CRUDO.';
  return buildWhatsAppUrl(phoneNumber, text);
}

export function buildGenericUrl(phoneNumber) {
  const text = 'Hola, tengo una consulta sobre CRUDO.';
  return buildWhatsAppUrl(phoneNumber, text);
}
