// Analytics configuration and utilities
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_MEASUREMENT_ID = 'G-7G16WXBKNE'; // Your Google Analytics 4 Measurement ID

// Initialize Google Analytics
export const initGA = () => {
  // Only initialize in production or when explicitly enabled
  if (import.meta.env.MODE !== 'production' && !import.meta.env.VITE_ENABLE_ANALYTICS) {
    console.log('Analytics disabled in development mode');
    return;
  }

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    // Privacy-friendly defaults
    anonymize_ip: true,
    cookie_flags: 'secure;samesite=strict',
  });
};

// Track page views
export const trackPageView = (page_title: string, page_location?: string) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_title,
      page_location: page_location || window.location.href,
    });
  } else {
    console.log('Analytics: page_view', { page_title, page_location });
  }
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  customParameters?: Record<string, any>
) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
      ...customParameters,
    });
  } else {
    console.log('Analytics: event', { action, category, label, value, customParameters });
  }
};

// Museum-specific tracking events
export const MuseumAnalytics = {
  // Navigation tracking
  trackCitySelected: (cityId: string, cityName: string) => {
    trackEvent('city_selected', 'navigation', cityName, undefined, { city_id: cityId });
  },

  trackMuseumSelected: (museumId: string, museumName: string, cityId: string) => {
    trackEvent('museum_selected', 'navigation', museumName, undefined, {
      museum_id: museumId,
      city_id: cityId,
    });
  },

  trackTourSelected: (tourId: string, tourName: string, museumId: string) => {
    trackEvent('tour_selected', 'navigation', tourName, undefined, {
      tour_id: tourId,
      museum_id: museumId,
    });
  },

  // Tour engagement tracking
  trackTourStarted: (tourId: string, tourName: string) => {
    trackEvent('tour_started', 'engagement', tourName, undefined, { tour_id: tourId });
  },

  trackTourCompleted: (tourId: string, tourName: string, completionTime: number) => {
    trackEvent('tour_completed', 'engagement', tourName, completionTime, { tour_id: tourId });
  },

  trackTourAbandoned: (tourId: string, tourName: string, stopsCompleted: number, totalStops: number) => {
    trackEvent('tour_abandoned', 'engagement', tourName, stopsCompleted, {
      tour_id: tourId,
      total_stops: totalStops,
      completion_rate: Math.round((stopsCompleted / totalStops) * 100),
    });
  },

  // Audio tracking
  trackAudioPlay: (tourId: string, stopId: string, audioType: 'artwork' | 'artist') => {
    trackEvent('audio_play', 'audio', `${audioType}_audio`, undefined, {
      tour_id: tourId,
      stop_id: stopId,
      audio_type: audioType,
    });
  },

  trackAudioComplete: (tourId: string, stopId: string, audioType: 'artwork' | 'artist') => {
    trackEvent('audio_complete', 'audio', `${audioType}_audio`, undefined, {
      tour_id: tourId,
      stop_id: stopId,
      audio_type: audioType,
    });
  },

  // Stop tracking
  trackStopCompleted: (tourId: string, stopId: string, completionType: 'auto' | 'manual') => {
    trackEvent('stop_completed', 'progress', stopId, undefined, {
      tour_id: tourId,
      stop_id: stopId,
      completion_type: completionType,
    });
  },

  // Session tracking
  trackSessionStart: () => {
    trackEvent('session_start', 'session', undefined, undefined, {
      timestamp: Date.now(),
    });
  },

  trackSessionEnd: (sessionDuration: number) => {
    trackEvent('session_end', 'session', undefined, sessionDuration, {
      timestamp: Date.now(),
    });
  },

  // Generic event tracking
  trackEvent: (action: string, category: string, label?: string, value?: number, customParameters?: Record<string, any>) => {
    trackEvent(action, category, label, value, customParameters);
  },
};