/**
 * Utilitário Central de Telemetria e Eventos GA4 (Google Analytics 4)
 * CannaGuia — Seu Guia de Cannabis Medicinal
 */

type AnalyticsParamValue = string | number | boolean | null | undefined | Array<string | number>;

interface WindowWithGtag extends Window {
  gtag?: (command: 'event', eventName: string, eventParams?: Record<string, AnalyticsParamValue>) => void;
}

export const trackCustomEvent = (
  eventName: string,
  params: Record<string, AnalyticsParamValue> = {}
): void => {
  try {
    if (typeof window !== 'undefined') {
      const win = window as unknown as WindowWithGtag;
      if (typeof win.gtag === 'function') {
        win.gtag('event', eventName, params);
        if (process.env.NODE_ENV === 'development') {
          console.log(`[GA4 Event] ${eventName}:`, params);
        }
      }
    }
  } catch (err) {
    console.warn(`[GA4 Error] Falha ao enviar evento ${eventName}:`, err);
  }
};
