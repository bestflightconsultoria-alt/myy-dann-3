/**
 * Utilitário Central de Telemetria e Eventos GA4 (Google Analytics 4)
 * CannaGuia — Seu Guia de Cannabis Medicinal
 */

export const trackCustomEvent = (eventName: string, params: Record<string, any> = {}) => {
  try {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, params);
      if (process.env.NODE_ENV === 'development') {
        console.log(`[GA4 Event] ${eventName}:`, params);
      }
    }
  } catch (err) {
    console.warn(`[GA4 Error] Falha ao enviar evento ${eventName}:`, err);
  }
};
